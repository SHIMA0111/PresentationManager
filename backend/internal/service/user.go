package service

import (
	"context"
	"fmt"
	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository"
	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(ctx context.Context, req *domain.UserCreateRequest) (*domain.User, error)
	GetUser(ctx context.Context, id string) (*domain.User, error)
	GetUsersByTeam(ctx context.Context, teamId string) ([]*domain.User, error)
	GetAllUsers(ctx context.Context) ([]*domain.User, error)
	UpdateUser(ctx context.Context, req *domain.UserUpdateRequest) (*domain.User, error)
	DeleteUser(ctx context.Context, id string) error
	HardDeleteUser(ctx context.Context, id string) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) CreateUser(ctx context.Context, req *domain.UserCreateRequest) (*domain.User, error) {
	userUuidV7, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to create user id: %w", err)
	}
	user := &domain.User{
		Id:    userUuidV7.String(),
		Name:  req.Name,
		Email: req.Email,
		Role:  req.Role,
	}

	if err = s.repo.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) GetUser(ctx context.Context, id string) (*domain.User, error) {
	return s.repo.GetUser(ctx, id)
}

func (s *userService) GetUsersByTeam(ctx context.Context, teamId string) ([]*domain.User, error) {
	return s.repo.GetTeamUsers(ctx, teamId)
}

func (s *userService) GetAllUsers(ctx context.Context) ([]*domain.User, error) {
	return s.repo.GetUsers(ctx)
}

func (s *userService) UpdateUser(ctx context.Context, req *domain.UserUpdateRequest) (*domain.User, error) {
	user := &domain.User{
		Id:    req.Id,
		Name:  req.Name,
		Email: req.Email,
		Role:  req.Role,
	}

	if err := s.repo.UpdateUser(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) DeleteUser(ctx context.Context, id string) error {
	return s.repo.DeleteUser(ctx, id)
}

func (s *userService) HardDeleteUser(ctx context.Context, id string) error {
	return s.repo.HardDeleteUser(ctx, id)
}
