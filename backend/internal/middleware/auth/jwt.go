package auth

import (
	"github.com/gin-gonic/gin"
	"strings"
)

func JWTAuthMiddleware() gin.HandlerFunc {
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

		if !validateToken(tokenString) {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		userId := getUserIDFromToken(tokenString)
		c.Set("userId", userId)

		c.Next()
	}
}

// Fake validation function
func validateToken(token string) bool {
	return token == "1234567890"
}

// Fake getting user id function
func getUserIDFromToken(token string) string {
	token = strings.TrimPrefix(token, "Bearer ")
	return token
}
