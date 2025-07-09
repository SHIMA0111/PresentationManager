package mysql

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
)

type TeamRepository struct {
	db *sql.DB
}

func NewTeamRepository(db *sql.DB) *TeamRepository {
	return &TeamRepository{db: db}
}

func (r *TeamRepository) CreateTeam(ctx context.Context, team *domain.Team) error {
	query := `
		INSERT INTO teams (id, name, description)
		VALUES (?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query, team.Id, team.Name, team.Description)
	if err != nil {
		return fmt.Errorf("failed to insert team: %w", err)
	}

	return nil
}

func (r *TeamRepository) AddTeamMember(ctx context.Context, teamMember *domain.TeamMember) error {
	query := `
		INSERT INTO team_members (team_id, user_id, Role)
		VALUES (?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query, teamMember.TeamId, teamMember.UserId, teamMember.Role)
	if err != nil {
		return fmt.Errorf("failed to insert team member: %w", err)
	}

	return nil
}

func (r *TeamRepository) GetTeam(ctx context.Context, id string) (*domain.Team, error) {
	query := `
		SELECT id, name, description
		FROM teams
		WHERE id = ? AND deleted_at IS NULL
	`
	var team domain.Team
	if err := r.db.QueryRowContext(ctx, query, id).Scan(&team.Id, &team.Name, &team.Description); err != nil {
		return nil, fmt.Errorf("failed to get team: %w", err)
	}

	return &team, nil
}

func (r *TeamRepository) GetTeams(ctx context.Context) ([]*domain.Team, error) {
	query := `
		SELECT id, name, description
		FROM teams
		WHERE deleted_at IS NULL
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get teams: %w", err)
	}
	defer rows.Close()

	var teams []*domain.Team
	for rows.Next() {
		var team domain.Team
		if err := rows.Scan(&team.Id, &team.Name, &team.Description); err != nil {
			return nil, fmt.Errorf("failed to scan team: %w", err)
		}
		teams = append(teams, &team)
	}

	return teams, nil
}

func (r *TeamRepository) UpdateTeam(ctx context.Context, team *domain.Team) error {
	query := `
		UPDATE teams
		SET name = ?, description = ?
		WHERE id = ? AND deleted_at IS NULL
	`
	_, err := r.db.ExecContext(ctx, query, team.Name, team.Description, team.Id)
	if err != nil {
		return fmt.Errorf("failed to update team: %w", err)
	}

	return nil
}

func (r *TeamRepository) RemoveTeamMember(ctx context.Context, teamMember *domain.TeamMember) error {
	query := `
		DELETE FROM team_members
		WHERE team_id = ? AND user_id = ?
	`
	_, err := r.db.ExecContext(ctx, query, teamMember.TeamId, teamMember.UserId)
	if err != nil {
		return fmt.Errorf("failed to remove team member: %w", err)
	}

	return nil
}

func (r *TeamRepository) DeleteTeam(ctx context.Context, id string) error {
	query := `
		UPDATE teams
		SET deleted_at = NOW()
		WHERE id = ? AND deleted_at IS NULL
	`
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	return nil
}

func (r *TeamRepository) HardDeleteTeam(ctx context.Context, id string) error {
	query := `
		DELETE FROM teams
		WHERE id = ?
	`
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to hard delete team: %w", err)
	}

	return nil
}
