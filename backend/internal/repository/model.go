package repository

import (
	"context"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *domain.User) error
	GetUser(ctx context.Context, id string) (*domain.User, error)
	GetTeamUsers(ctx context.Context, teamId string) ([]*domain.User, error)
	GetUsers(ctx context.Context) ([]*domain.User, error)
	UpdateUser(ctx context.Context, user *domain.User) error
	DeleteUser(ctx context.Context, id string) error
	HardDeleteUser(ctx context.Context, id string) error
}

type TeamRepository interface {
	CreateTeam(ctx context.Context, team *domain.Team) error
	AddTeamMember(ctx context.Context, teamMember *domain.TeamMember) error
	GetTeam(ctx context.Context, id string) (*domain.Team, error)
	GetTeams(ctx context.Context) ([]*domain.Team, error)
	UpdateTeam(ctx context.Context, team *domain.Team) error
	RemoveTeamMember(ctx context.Context, teamMember *domain.TeamMember) error
	DeleteTeam(ctx context.Context, id string) error
	HardDeleteTeam(ctx context.Context, id string) error
}

type PresentationRepository interface {
	CreatePresentation(ctx context.Context, presentation *domain.Presentation) error
	GetPresentation(ctx context.Context, id string) (*domain.Presentation, error)
	GetPresentations(ctx context.Context) ([]*domain.Presentation, error)
	GetTeamPresentations(ctx context.Context, teamId string) ([]*domain.Presentation, error)
	GetUserPresentations(ctx context.Context, userId string) ([]*domain.Presentation, error)
	UpdatePresentation(ctx context.Context, presentation *domain.Presentation) error
	DeletePresentation(ctx context.Context, id string) error
	HardDeletePresentation(ctx context.Context, id string) error
}
