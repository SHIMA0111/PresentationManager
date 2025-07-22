package utils

import (
	"context"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"math/big"
	"net/http"
	"sync"
	"time"
)

type JSONWebKeySet struct {
	Keys []JSONWebKey `json:"keys"`
}

type JSONWebKey struct {
	KID       string `json:"kid"`
	Algorithm string `json:"alg"`
	KeyType   string `json:"kty"`
	// N represents the modulus value of the RSA key in base64url-encoded form.
	N string `json:"n"`
	// E represents the exponent value of the RSA key in base64url-encoded form.
	E string `json:"e"`
}

type JwksCache struct {
	mu      sync.RWMutex
	keys    map[string]*rsa.PublicKey
	jwksURL string
}

func NewJwksCache(ctx context.Context, url string) (*JwksCache, error) {
	cache := &JwksCache{
		keys:    make(map[string]*rsa.PublicKey),
		jwksURL: url,
	}
	if err := cache.refreshKeys(ctx); err != nil {
		return nil, fmt.Errorf("initial key refresh failed: %w", err)
	}

	go cache.startRefresh(ctx)

	return cache, nil
}

func (c *JwksCache) refreshKeys(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.jwksURL, nil)
	if err != nil {
		return err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var jwks JSONWebKeySet
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return fmt.Errorf("failed to decode jwks json: %w", err)
	}

	newKeys := make(map[string]*rsa.PublicKey)
	for _, key := range jwks.Keys {
		if key.KeyType == "RSA" {
			pubKey, err := parseRSAPublicKey(key.N, key.E)
			if err != nil {
				log.Printf("failed to parse public key for kid %s: %v", key.KID, err)
				continue
			}
			newKeys[key.KID] = pubKey
		}
	}

	c.mu.Lock()
	defer c.mu.Unlock()
	c.keys = newKeys
	log.Printf("refreshed keys")
	return nil
}

func (c *JwksCache) startRefresh(ctx context.Context) {
	ticker := time.NewTimer(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if err := c.refreshKeys(ctx); err != nil {
				log.Printf("failed to refresh keys: %v", err)
			}
		case <-ctx.Done():
			return
		}
	}
}

func (c *JwksCache) KeyFunc(token *jwt.Token) (interface{}, error) {
	kid, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("kid header not found")
	}
	c.mu.RLock()
	defer c.mu.RUnlock()
	key, found := c.keys[kid]
	if !found {
		return nil, fmt.Errorf("key with kid %s not found", kid)
	}

	return key, nil
}

func parseRSAPublicKey(nStr, eStr string) (*rsa.PublicKey, error) {
	nBytes, err := base64.RawURLEncoding.DecodeString(nStr)
	if err != nil {
		return nil, err
	}

	eBytes, err := base64.RawURLEncoding.DecodeString(eStr)
	if err != nil {
		return nil, err
	}
	eInt := big.NewInt(0).SetBytes(eBytes).Int64()

	return &rsa.PublicKey{
		N: big.NewInt(0).SetBytes(nBytes),
		E: int(eInt),
	}, nil
}
