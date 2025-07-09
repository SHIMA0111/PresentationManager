package handler

import (
	"log/slog"

	"github.com/gin-gonic/gin"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/service"
)

type TeamHandler struct {
	service service.TeamService
}

func NewTeamHandler(service service.TeamService) *TeamHandler {
	return &TeamHandler{service: service}
}

func (h *TeamHandler) CreateTeam(c *gin.Context) {
	var req domain.TeamCreateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	team, err := h.service.CreateTeam(ctx, &req)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create team"})
		slog.Error("failed to create team", "error", err)
		return
	}

	c.JSON(201, team)
}

func (h *TeamHandler) AddTeamMember(c *gin.Context) {
	var req domain.TeamMemberAddRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.AddTeamMember(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to add team member"})
		slog.Error("failed to add team member", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *TeamHandler) GetTeam(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	team, err := h.service.GetTeam(ctx, uri.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get team"})
		slog.Error("failed to get team", "error", err)
		return
	}

	c.JSON(200, team)
}

func (h *TeamHandler) GetTeams(c *gin.Context) {
	ctx := c.Request.Context()
	teams, err := h.service.GetTeams(ctx)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to get teams"})
		slog.Error("failed to get teams", "error", err)
		return
	}

	c.JSON(200, teams)
}

func (h *TeamHandler) UpdateTeam(c *gin.Context) {
	var req domain.TeamUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.UpdateTeam(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to update team"})
		slog.Error("failed to update team", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *TeamHandler) RemoveTeamMember(c *gin.Context) {
	var req domain.TeamMemberRemoveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind json", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.RemoveTeamMember(ctx, &req); err != nil {
		c.JSON(500, gin.H{"error": "failed to remove team member"})
		slog.Error("failed to remove team member", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *TeamHandler) DeleteTeam(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.DeleteTeam(ctx, uri.Id); err != nil {
		c.JSON(500, gin.H{"error": "failed to delete team"})
		slog.Error("failed to delete team", "error", err)
		return
	}

	c.JSON(204, nil)
}

func (h *TeamHandler) HardDeleteTeam(c *gin.Context) {
	var uri struct {
		Id string `uri:"id" binding:"required,uuid"`
	}

	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		slog.Error("failed to bind uri", "error", err)
		return
	}

	ctx := c.Request.Context()
	if err := h.service.HardDeleteTeam(ctx, uri.Id); err != nil {
		c.JSON(500, gin.H{"error": "failed to hard delete team"})
		slog.Error("failed to hard delete team", "error", err)
		return
	}

	c.JSON(204, nil)
}
