package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository"
	_ "github.com/go-sql-driver/mysql"
)

type mysqlUserRepository struct {
	db *sql.DB
}

// NewUserRepository initializes and returns a new instance of UserRepository with the provided database connection.
func NewUserRepository(db *sql.DB) repository.UserRepository {
	return &mysqlUserRepository{db: db}
}

// CreateUser inserts a new user record into the database with the provided details and generates a unique UUID.
func (r *mysqlUserRepository) CreateUser(ctx context.Context, user *domain.User) error {
	query := "INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)"

	_, err := r.db.ExecContext(ctx, query, user.Id, user.Name, user.Email, user.Role)
	if err != nil {
		return fmt.Errorf("failed to insert user: %w", err)
	}

	return nil
}

// GetUser retrieves a user by their unique ID from the database.
// Returns a User object or an error if retrieval fails.
func (r *mysqlUserRepository) GetUser(ctx context.Context, id string) (*domain.User, error) {
	query := "SELECT id, name, email, role FROM users WHERE id = ? AND deleted_at IS NULL"

	var user domain.User

	if err := r.db.QueryRowContext(ctx, query, id).Scan(&user.Id, &user.Name, &user.Email, &user.Role); err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return &user, nil
}

// GetTeamUsers retrieves a list of users associated with a specific team using the team ID.
// Returns users or an error.
func (r *mysqlUserRepository) GetTeamUsers(ctx context.Context, teamId string) ([]*domain.User, error) {
	query := `
		SELECT u.id, u.name, u.email, u.role 
		FROM users u 
		INNER JOIN team_members tm ON u.id = tm.user_id 
		WHERE tm.team_id = ? AND u.deleted_at IS NULL`

	rows, err := r.db.QueryContext(ctx, query, teamId)
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %w", err)
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		var user domain.User

		if err = rows.Scan(&user.Id, &user.Name, &user.Email, &user.Role); err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}

		users = append(users, &user)
	}

	return users, nil
}

// GetUsers retrieves a list of all users from the database.
// Returns a slice of User objects or an error if retrieval fails.
func (r *mysqlUserRepository) GetUsers(ctx context.Context) ([]*domain.User, error) {
	query := "SELECT id, name, email, role FROM users WHERE deleted_at IS NULL"

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %w", err)
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		var id string
		var name string
		var email string
		var role domain.RoleEnum

		if err := rows.Scan(&id, &name, &email, &role); err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}

		users = append(users, &domain.User{
			Id:    id,
			Name:  name,
			Email: email,
			Role:  role,
		})
	}

	return users, nil
}

// UpdateUser updates an existing user's details in the database using the provided user entity.
// Returns an error if the update operation fails.
func (r *mysqlUserRepository) UpdateUser(ctx context.Context, user *domain.User) error {
	query := "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ? AND deleted_at IS NULL"

	_, err := r.db.ExecContext(ctx, query, user.Name, user.Email, user.Role, user.Id)

	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}

// DeleteUser marks a user as deleted by setting the deleted_at timestamp in the database.
func (r *mysqlUserRepository) DeleteUser(ctx context.Context, id string) error {
	query := "UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL"
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}

// HardDeleteUser permanently removes a user record from the database by their ID.
// Returns an error if the deletion fails.
func (r *mysqlUserRepository) HardDeleteUser(ctx context.Context, id string) error {
	query := "DELETE FROM users WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to hard delete user: %w", err)
	}

	return nil
}
