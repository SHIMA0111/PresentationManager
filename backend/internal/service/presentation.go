package service

import (
	"context"
	"fmt"
	"github.com/SHIMA0111/PresentationManager/backend/internal/domain"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository"
	"github.com/google/uuid"
)

type PresentationService interface {
	CreatePresentation(ctx context.Context, presentationData domain.PresentationCreateRequest) (*domain.Presentation, error)
	GetPresentations(ctx context.Context) ([]*domain.Presentation, error)
	GetPresentationsByTeam(ctx context.Context, teamId string) ([]*domain.Presentation, error)
	GetPresentationsByUser(ctx context.Context, userId string) ([]*domain.Presentation, error)
	UpdatePresentation(ctx context.Context, presentationData domain.PresentationUpdateRequest) error
	DeletePresentation(ctx context.Context, id string) error
	HardDeletePresentation(ctx context.Context, id string) error
}

type presentationService struct {
	repo repository.PresentationRepository
}

func NewPresentationService(repo repository.PresentationRepository) PresentationService {
	return &presentationService{repo: repo}
}

func (s *presentationService) CreatePresentation(ctx context.Context, presentationData domain.PresentationCreateRequest) (*domain.Presentation, error) {
	presentationUuid, err := uuid.NewRandom()
	if err != nil {
		return nil, fmt.Errorf("failed to create user id: %w", err)
	}
	presentation := &domain.Presentation{
		Id:               presentationUuid.String(),
		PresentationDate: presentationData.PresentationDate,
		Team:             presentationData.Team,
		Assignee:         "",
		Title:            "",
		Description:      "",
		Status:           domain.Unassigned,
	}

	if err = s.repo.CreatePresentation(ctx, presentation); err != nil {
		return nil, err
	}

	return presentation, nil
}

func (s *presentationService) GetPresentations(ctx context.Context) ([]*domain.Presentation, error) {
	return s.repo.GetPresentations(ctx)
}

func (s *presentationService) GetPresentationsByTeam(ctx context.Context, teamId string) ([]*domain.Presentation, error) {
	return s.repo.GetTeamPresentations(ctx, teamId)
}

func (s *presentationService) GetPresentationsByUser(ctx context.Context, userId string) ([]*domain.Presentation, error) {
	return s.repo.GetUserPresentations(ctx, userId)
}

func (s *presentationService) UpdatePresentation(ctx context.Context, presentationData domain.PresentationUpdateRequest) error {
	isAllUpdate, newPresentation := presentationData.GetPresentationData()

	if isAllUpdate {
		if newPresentation.Status == domain.Completed {
			return fmt.Errorf("cannot update presentation status to completed")
		}
	} else {
		originalPresentation, err := s.repo.GetPresentation(ctx, newPresentation.Id)
		if err != nil {
			return err
		}

		switch newPresentation.Status {
		case domain.Unassigned:
			newPresentation.Assignee = ""
			newPresentation.PresentationDate = originalPresentation.PresentationDate
			newPresentation.Title = ""
			newPresentation.Description = ""
		case domain.Assigned:
			newPresentation.PresentationDate = originalPresentation.PresentationDate
			newPresentation.Team = originalPresentation.Team
			newPresentation.Title = ""
			newPresentation.Description = ""
		case domain.ContentInputted:
			newPresentation.PresentationDate = originalPresentation.PresentationDate
			newPresentation.Team = originalPresentation.Team
			newPresentation.Assignee = originalPresentation.Assignee
		// In normal operation, the default branch is unreachable.
		default:
			return fmt.Errorf("invalid status: %s", newPresentation.Status)
		}
	}

	return s.repo.UpdatePresentation(ctx, newPresentation)
}

func (s *presentationService) DeletePresentation(ctx context.Context, id string) error {
	return s.repo.DeletePresentation(ctx, id)
}

func (s *presentationService) HardDeletePresentation(ctx context.Context, id string) error {
	return s.repo.HardDeletePresentation(ctx, id)
}
