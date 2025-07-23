package auth

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/SHIMA0111/PresentationManager/backend/internal/infra"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTAuthMiddleware(oidc *infra.OIDC) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract Authorization header token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
			return
		}

		// Remove prefix("Bearer")
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token format. expected \"Bearer <token>\""})
			return
		}

		token, err := jwt.Parse(tokenString, oidc.KeyCache.KeyFunc,
			jwt.WithIssuer(oidc.RealmURL),
		)

		if err == nil {
			claims := token.Claims.(jwt.MapClaims)
			if claims["aud"] != oidc.ClientID && claims["azp"] != oidc.ClientID {
				err = fmt.Errorf("invalid audience or authorized party")
			}
		}

		if err != nil {
			slog.Error("invalid token", "error", err)
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		userId := token.Claims.(jwt.MapClaims)["sub"].(string)
		c.Set("userId", userId)

		c.Next()
	}
}
