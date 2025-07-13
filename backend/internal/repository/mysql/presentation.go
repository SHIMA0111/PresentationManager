package mysql

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"

	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository"
)

type mysqlPresentationRepository struct {
	db *sql.DB
}

func NewPresentationRepository(db *sql.DB) repository.PresentationRepository {
	return &mysqlPresentationRepository{db: db}
}

func (r *mysqlPresentationRepository) CreatePresentation(ctx context.Context, presentation *domain.PresentationRaw) error {
	query := "INSERT INTO presentations (id, presentation_datetime,title, description, team_id) VALUES (?, ?, ?, ?, ?)"

	_, err := r.db.ExecContext(ctx, query, presentation.Id, presentation.PresentationDate, presentation.Title, presentation.Description, presentation.TeamId)
	if err != nil {
		return fmt.Errorf("failed to insert user: %w", err)
	}

	return nil
}

func (r *mysqlPresentationRepository) GetPresentationRawData(ctx context.Context, id string) (*domain.PresentationRaw, error) {
	query := `
		SELECT id, presentation_datetime, team_id, user_id, title, description, status
		FROM presentations 
		WHERE id = ? AND deleted_at IS NULL`
	var presentation domain.PresentationRaw
	if err := r.db.QueryRowContext(ctx, query, id).Scan(
		&presentation.Id,
		&presentation.PresentationDate,
		&presentation.TeamId,
		&presentation.AssigneeId,
		&presentation.Title,
		&presentation.Description,
		&presentation.Status); err != nil {

		return nil, fmt.Errorf("failed to get presentation: %w", err)
	}
	return &presentation, nil
}

func (r *mysqlPresentationRepository) GetPresentation(ctx context.Context, id string) (*domain.Presentation, error) {
	query := `
		SELECT id, presentation_datetime, t.name, u.name, title, description, status
		FROM presentations as p 
		INNER JOIN users as u ON p.user_id = u.id
		INNER JOIN teams as t ON p.team_id = t.id
		WHERE id = ? AND deleted_at IS NULL`
	var presentation domain.Presentation
	if err := r.db.QueryRowContext(ctx, query, id).Scan(
		&presentation.Id,
		&presentation.PresentationDate,
		&presentation.Team,
		&presentation.Assignee,
		&presentation.Title,
		&presentation.Description,
		&presentation.Status); err != nil {

		return nil, fmt.Errorf("failed to get presentation: %w", err)
	}
	return &presentation, nil
}

func (r *mysqlPresentationRepository) GetPresentations(ctx context.Context) ([]*domain.Presentation, error) {
	query := `
		SELECT p.id, presentation_datetime, t.name, u.name, title, p.description, status
		FROM presentations as p 
		INNER JOIN users as u ON p.user_id = u.id 
		INNER JOIN teams as t ON p.team_id = t.id
		WHERE p.deleted_at IS NULL`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get presentations: %w", err)
	}

	defer rows.Close()

	var presentations []*domain.Presentation
	for rows.Next() {
		var presentation domain.Presentation
		if err := rows.Scan(
			&presentation.Id,
			&presentation.PresentationDate,
			&presentation.Team,
			&presentation.Assignee,
			&presentation.Title,
			&presentation.Description,
			&presentation.Status); err != nil {

			return nil, fmt.Errorf("failed to scan presentation: %w", err)
		}
		presentations = append(presentations, &presentation)
	}

	return presentations, nil
}

func (r *mysqlPresentationRepository) GetTeamPresentations(ctx context.Context, teamId string) ([]*domain.Presentation, error) {
	query := `
		SELECT p.id, presentation_datetime, t.name, u.name, title, p.description, status 
		FROM presentations as p 
		INNER JOIN users as u ON p.user_id = u.id 
		INNER JOIN teams as t ON p.team_id = t.id
		WHERE team_id = ? AND p.deleted_at IS NULL`

	rows, err := r.db.QueryContext(ctx, query, teamId)
	if err != nil {
		return nil, fmt.Errorf("failed to get presentations: %w", err)
	}
	defer rows.Close()

	var presentations []*domain.Presentation
	for rows.Next() {
		var presentation domain.Presentation
		if err = rows.Scan(
			&presentation.Id,
			&presentation.PresentationDate,
			&presentation.Team,
			&presentation.Assignee,
			&presentation.Title,
			&presentation.Description,
			&presentation.Status); err != nil {
			return nil, fmt.Errorf("failed to scan presentation: %w", err)
		}
		presentations = append(presentations, &presentation)
	}

	return presentations, nil
}

func (r *mysqlPresentationRepository) GetUserPresentations(ctx context.Context, userId string) ([]*domain.Presentation, error) {
	query := `
		SELECT p.id, presentation_datetime, t.name, u.name, title, p.description, status 
		FROM presentations as p 
		INNER JOIN users as u ON p.user_id = u.id 
		INNER JOIN teams as t ON p.team_id = t.id
		WHERE team_id = ? AND deleted_at IS NULL`

	rows, err := r.db.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to get user's presentation: %w", err)
	}
	defer rows.Close()

	var presentations []*domain.Presentation
	for rows.Next() {
		var presentation domain.Presentation
		if err = rows.Scan(
			&presentation.Id,
			&presentation.PresentationDate,
			&presentation.Team,
			&presentation.Assignee,
			&presentation.Title,
			&presentation.Description,
			&presentation.Status); err != nil {
			return nil, fmt.Errorf("failed to scan presentation: %w", err)
		}
		presentations = append(presentations, &presentation)
	}

	return presentations, nil
}

func (r *mysqlPresentationRepository) UpdatePresentation(ctx context.Context, presentation *domain.PresentationRaw) error {
	query := `
		UPDATE presentations 
		SET presentations.presentation_datetime = ?, team_id = ? , user_id = ?, title = ?, description = ?, status = ?
		WHERE id = ? AND deleted_at IS NULL`

	_, err := r.db.ExecContext(
		ctx,
		query,
		presentation.PresentationDate,
		presentation.TeamId,
		presentation.AssigneeId,
		presentation.Title,
		presentation.Description,
		presentation.Status,
		presentation.Id)

	if err != nil {
		return fmt.Errorf("failed to update presentation: %w", err)
	}

	return nil
}

func (r *mysqlPresentationRepository) DeletePresentation(ctx context.Context, id string) error {
	query := "UPDATE presentations SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL"

	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete presentation: %w", err)
	}

	return nil
}

func (r *mysqlPresentationRepository) HardDeletePresentation(ctx context.Context, id string) error {
	query := "DELETE FROM presentations WHERE id = ?"

	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to hard delete presentation: %w", err)
	}

	return nil
}
