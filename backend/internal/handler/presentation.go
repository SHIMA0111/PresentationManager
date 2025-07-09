package handler

import (
	"log/slog"

	"github.com/gin-gonic/gin"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/service"
)

type PresentationHandler struct {
	service service.PresentationService
}

func NewPresentationHandler(service service.PresentationService) *PresentationHandler {
	return &PresentationHandler{service: service}
}

func (h *PresentationHandler) CreatePresentation(c *gin.Context) {
	var req domain.PresentationCreateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	presentation, err := h.service.CreatePresentation(ctx, &req)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create presentation"})
		slog.Error("failed to create presentation", "error", err)
		return
	}

	c.JSON(201, presentation)
}

func (h *PresentationHandler) GetPresentations(c *gin.Context) {
	ctx := c.Request.Context()
	presentations, err := h.service.GetPresentations(ctx)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get presentations"})
		slog.Error("failed to get presentations", "error", err)
		return
	}

	c.JSON(200, presentations)
}

func (h *PresentationHandler) GetTeamPresentations(c *gin.Context) {
	var uri struct {
		TeamId string `uri:"teamId" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	presentation, err := h.service.GetPresentationsByTeam(ctx, uri.TeamId)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get presentations by team"})
		slog.Error("failed to get presentations by team", "error", err)
		return
	}

	c.JSON(200, presentation)
}

func (h *PresentationHandler) GetUserPresentations(c *gin.Context) {
	var uri struct {
		UserId string `uri:"userId" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	presentation, err := h.service.GetPresentationsByUser(ctx, uri.UserId)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get presentations by user"})
		slog.Error("failed to get presentations by user", "error", err)
		return
	}

	c.JSON(200, presentation)
}

func (h *PresentationHandler) UpdatePresentationTeam(c *gin.Context) {
	var req domain.PresentationUpdateTeamRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.UpdatePresentation(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to update presentation"})
		slog.Error("failed to update presentation", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *PresentationHandler) UpdatePresentationAssign(c *gin.Context) {
	var req domain.PresentationUpdateAssigneeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.UpdatePresentation(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to update presentation"})
		slog.Error("failed to update presentation", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *PresentationHandler) UpdatePresentationContent(c *gin.Context) {
	var req domain.PresentationUpdateContentsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.UpdatePresentation(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to update presentation"})
		slog.Error("failed to update presentation", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *PresentationHandler) UpdatePresentation(c *gin.Context) {
	var req domain.PresentationUpdateAllRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.UpdatePresentation(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to update presentation"})
		slog.Error("failed to update presentation", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *PresentationHandler) DeletePresentation(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	err := h.service.DeletePresentation(ctx, uri.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to delete presentation"})
		slog.Error("failed to delete presentation", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *PresentationHandler) HardDeletePresentation(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	err := h.service.HardDeletePresentation(ctx, uri.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to hard delete presentation"})
		slog.Error("failed to hard delete presentation", "error", err)
		return
	}

	c.JSON(204, nil)
}
