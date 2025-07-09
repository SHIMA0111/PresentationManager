package handler

import (
	"log/slog"

	"github.com/gin-gonic/gin"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/service"
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
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	user, err := h.service.CreateUser(ctx, &req)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create user"})
		slog.Error("failed to create user", "error", err)
		return
	}
	c.JSON(201, user)
}

func (h *UserHandler) GetUser(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	user, err := h.service.GetUser(ctx, uri.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get user"})
		slog.Error("failed to get user", "error", err)
		return
	}

	c.JSON(200, user)
}

func (h *UserHandler) GetUsersByTeam(c *gin.Context) {
	var uri struct {
		TeamId string `uri:"teamId" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	users, err := h.service.GetUsersByTeam(ctx, uri.TeamId)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get users by team"})
		slog.Error("failed to get users by team", "error", err)
		return
	}

	c.JSON(200, users)
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	ctx := c.Request.Context()
	users, err := h.service.GetAllUsers(ctx)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get users"})
		slog.Error("failed to get users", "error", err)
		return
	}

	c.JSON(200, users)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	var req domain.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if _, err := h.service.UpdateUser(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to update user"})
		slog.Error("failed to update user", "error", err)
		return
	}

	c.JSON(200, nil)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.DeleteUser(ctx, uri.Id); err != nil {
		c.JSON(500, gin.H{"error": "failed to delete user"})
		slog.Error("failed to delete user", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *UserHandler) HardDeleteUser(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.HardDeleteUser(ctx, uri.Id); err != nil {
		c.JSON(500, gin.H{"error": "failed to hard delete user"})
		slog.Error("failed to hard delete user", "error", err)
		return
	}

	c.JSON(204, nil)
}
