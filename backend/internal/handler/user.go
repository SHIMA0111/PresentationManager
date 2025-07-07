package handler

import (
	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/service"
	"github.com/gin-gonic/gin"
	"log/slog"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(service service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req domain.UserCreateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json: %w", err)
		return
	}

	ctx := c.Request.Context()
	user, err := h.service.CreateUser(ctx, req)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create user"})
		slog.Error("failed to create user: %w", err)
		return
	}
	c.JSON(201, user)
}

func (h *UserHandler) GetUser(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri: %w", err)
		return
	}

	ctx := c.Request.Context()
	user, err := h.service.GetUser(ctx, uri.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get user"})
		slog.Error("failed to get user: %w", err)
		return
	}

	c.JSON(200, user)
}

func (h *UserHandler) GetUsersByTeam(c *gin.Context) {
	var uri struct {
		TeamId string `uri:"teamId" binding:"required"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri: %w", err)
		return
	}

	ctx := c.Request.Context()
	users, err := h.service.GetUsersByTeam(ctx, uri.TeamId)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get users by team"})
		slog.Error("failed to get users by team: %w", err)
	}

	c.JSON(200, users)
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	ctx := c.Request.Context()
	users, err := h.service.GetAllUsers(ctx)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get users"})
		slog.Error("failed to get users: %w", err)
	}

	c.JSON(200, users)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	var req domain.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json: %w", err)
		return
	}
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri: %w", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.DeleteUser(ctx, uri.Id); err != nil {
		c.JSON(500, gin.H{"error": "failed to delete user"})
		slog.Error("failed to delete user: %w", err)
	}

	c.JSON(204, nil)
}

func (h *UserHandler) HardDeleteUser(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri: %w", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.HardDeleteUser(ctx, uri.Id); err != nil {
		c.JSON(500, gin.H{"error": "failed to hard delete user"})
		slog.Error("failed to hard delete user: %w", err)
	}

	c.JSON(204, nil)
}
