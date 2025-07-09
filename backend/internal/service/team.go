package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository"
)

type TeamService interface {
	CreateTeam(ctx context.Context, team *domain.TeamCreateRequest) (*domain.Team, error)
	AddTeamMember(ctx context.Context, teamMember *domain.TeamMemberAddRequest) error
	GetTeam(ctx context.Context, id string) (*domain.Team, error)
	GetTeams(ctx context.Context) ([]*domain.Team, error)
	UpdateTeam(ctx context.Context, team *domain.TeamUpdateRequest) error
	RemoveTeamMember(ctx context.Context, teamMember *domain.TeamMemberRemoveRequest) error
	DeleteTeam(ctx context.Context, id string) error
	HardDeleteTeam(ctx context.Context, id string) error
}

type teamService struct {
	repo repository.TeamRepository
}

func NewTeamService(repo repository.TeamRepository) TeamService {
	return &teamService{repo: repo}
}

func (s *teamService) CreateTeam(ctx context.Context, team *domain.TeamCreateRequest) (*domain.Team, error) {
	teamUuid, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to create team id: %w", err)
	}

	presentation := &domain.Team{
		Id:          teamUuid.String(),
		Name:        team.Name,
		Description: team.Description,
	}
	if err = s.repo.CreateTeam(ctx, presentation); err != nil {
		return nil, fmt.Errorf("failed to create team: %w", err)
	}

	return presentation, nil
}

func (s *teamService) AddTeamMember(ctx context.Context, teamMember *domain.TeamMemberAddRequest) error {
	teamMemberData := &domain.TeamMember{
		TeamId: teamMember.TeamId,
		UserId: teamMember.UserId,
		Role:   teamMember.Role,
	}

	if err := s.repo.AddTeamMember(ctx, teamMemberData); err != nil {
		return fmt.Errorf("failed to add %s to %s: %w", teamMember.UserId, teamMember.TeamId, err)
	}

	return nil
}

func (s *teamService) GetTeam(ctx context.Context, id string) (*domain.Team, error) {
	return s.repo.GetTeam(ctx, id)
}

func (s *teamService) GetTeams(ctx context.Context) ([]*domain.Team, error) {
	return s.repo.GetTeams(ctx)
}

func (s *teamService) UpdateTeam(ctx context.Context, team *domain.TeamUpdateRequest) error {
	teamData := &domain.Team{
		Id:          team.Id,
		Name:        team.Name,
		Description: team.Description,
	}

	if err := s.repo.UpdateTeam(ctx, teamData); err != nil {
		return fmt.Errorf("failed to update team: %w", err)
	}

	return nil
}

func (s *teamService) RemoveTeamMember(ctx context.Context, teamMember *domain.TeamMemberRemoveRequest) error {
	teamMemberData := &domain.TeamMember{
		TeamId: teamMember.TeamId,
		UserId: teamMember.UserId,
	}

	if err := s.repo.RemoveTeamMember(ctx, teamMemberData); err != nil {
		return fmt.Errorf("failed to remove team member %s from %s: %w", teamMember.UserId, teamMember.TeamId, err)
	}

	return nil
}

func (s *teamService) DeleteTeam(ctx context.Context, id string) error {
	return s.repo.DeleteTeam(ctx, id)
}

func (s *teamService) HardDeleteTeam(ctx context.Context, id string) error {
	return s.repo.HardDeleteTeam(ctx, id)
}
