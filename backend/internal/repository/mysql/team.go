package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository"

	_ "github.com/go-sql-driver/mysql"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
)

type teamRepository struct {
	db *sql.DB
}

func NewTeamRepository(db *sql.DB) repository.TeamRepository {
	return &teamRepository{db: db}
}

func (r *teamRepository) CreateTeam(ctx context.Context, team *domain.Team) error {
	query := "INSERT INTO teams (id, name, description) VALUES (?, ?, ?)"
	_, err := r.db.ExecContext(ctx, query, team.Id, team.Name, team.Description)
	if err != nil {
		return fmt.Errorf("failed to insert team: %w", err)
	}

	return nil
}

func (r *teamRepository) AddTeamMember(ctx context.Context, teamMember *domain.TeamMember) error {
	query := "INSERT INTO team_members (team_id, user_id, Role) VALUES (?, ?, ?)"
	_, err := r.db.ExecContext(ctx, query, teamMember.TeamId, teamMember.UserId, teamMember.Role)
	if err != nil {
		return fmt.Errorf("failed to insert team member: %w", err)
	}

	return nil
}

func (r *teamRepository) GetTeam(ctx context.Context, id string) (*domain.Team, error) {
	query := "SELECT id, name, description FROM teams WHERE id = ? AND deleted_at IS NULL"

	var team domain.Team
	if err := r.db.QueryRowContext(ctx, query, id).Scan(&team.Id, &team.Name, &team.Description); err != nil {
		return nil, fmt.Errorf("failed to get team: %w", err)
	}

	return &team, nil
}

func (r *teamRepository) GetTeams(ctx context.Context) ([]*domain.Team, error) {
	query := "SELECT id, name, description FROM teams WHERE deleted_at IS NULL"

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

func (r *teamRepository) UpdateTeam(ctx context.Context, team *domain.Team) error {
	query := "UPDATE teams SET name = ?, description = ? WHERE id = ? AND deleted_at IS NULL"

	_, err := r.db.ExecContext(ctx, query, team.Name, team.Description, team.Id)
	if err != nil {
		return fmt.Errorf("failed to update team: %w", err)
	}

	return nil
}

func (r *teamRepository) RemoveTeamMember(ctx context.Context, teamMember *domain.TeamMember) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	presentationUpdateUserQuery := "UPDATE presentations SET user_id = NULL WHERE user_id = ? AND status != 3 AND deleted_at IS NULL"
	if _, err = tx.ExecContext(ctx, presentationUpdateUserQuery, teamMember.UserId); err != nil {
		return fmt.Errorf("failed to remove team member: %w", err)
	}

	teamMemberDeleteQuery := "DELETE FROM team_members WHERE team_id = ? AND user_id = ? AND deleted_at IS NULL"
	if _, err = tx.ExecContext(ctx, teamMemberDeleteQuery, teamMember.TeamId, teamMember.UserId); err != nil {
		return fmt.Errorf("failed to remove team member: %w", err)
	}

	return nil
}

func (r *teamRepository) DeleteTeam(ctx context.Context, id string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	teamMemberDeleteQuery := "UPDATE team_members SET deleted_at = NOW() WHERE team_id = ? AND deleted_at IS NULL"
	if _, err = tx.ExecContext(ctx, teamMemberDeleteQuery, id); err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	presentationUpdateUserQuery := "UPDATE presentations SET user_id = NULL, title = NULL, description = NULL WHERE user_id = ? AND status != 3 AND deleted_at IS NULL"
	if _, err = tx.ExecContext(ctx, presentationUpdateUserQuery, id); err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	teamDeleteQuery := "UPDATE teams SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL"
	if _, err = tx.ExecContext(ctx, teamDeleteQuery, id); err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *teamRepository) HardDeleteTeam(ctx context.Context, id string) error {
	query := "DELETE FROM team_members WHERE team_id = ?"

	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to hard delete team: %w", err)
	}

	return nil
}
