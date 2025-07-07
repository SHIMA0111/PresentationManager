package repository

import "github.com/SHIMA0111/PresentationManager/backend/internal/domain"

type UserRepository interface {
	CreateUser(user *domain.UserCreate) error
	GetUser(id string) (*domain.User, error)
	GetTeamUsers(teamId string) ([]*domain.User, error)
	GetUsers() ([]*domain.User, error)
	UpdateUser(user *domain.User) error
	DeleteUser(id string) error
	HardDeleteUser(id string) error
}
