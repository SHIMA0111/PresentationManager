package infra

import (
	"context"
	"fmt"
	"github.com/SHIMA0111/PresentationManager/backend/internal/infra/utils"
	"os"
)

type OIDC struct {
	RealmURL string
	ClientID string
	KeyCache *utils.JwksCache
}

func SetupOIDC(ctx context.Context) (*OIDC, error) {
	realmURL := os.Getenv("OIDC_REALM_URL")
	clientId := os.Getenv("OIDC_CLIENT_ID")

	if realmURL == "" || clientId == "" {
		return nil, fmt.Errorf("OIDC_REALM_URL or OIDC_CLIENT_ID or the both are empty. please check your environment variables")
	}

	jwksURL := fmt.Sprintf("%s/protocol/openid-connect/certs", realmURL)

	cache, err := utils.NewJwksCache(ctx, jwksURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create jwks cache: %w", err)
	}

	return &OIDC{
		RealmURL: realmURL,
		ClientID: clientId,
		KeyCache: cache,
	}, nil
}
