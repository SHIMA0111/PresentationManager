package service

import "context"

type Service interface {
	Create(ctx context.Context)
}
