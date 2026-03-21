package service

import (
	"context"
	"magic-buttles/game-service/internal/config"
	"magic-buttles/game-service/internal/db"
	"time"
)

type Cache interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	SetStructArray(ctx context.Context, key, mas interface{}, expiration time.Duration) error
	GetStructArray(ctx context.Context, key interface{}) (interface{}, error)
	GetAllKeys(ctx context.Context) ([]string, error)
	ClearCache() error
}

type Service struct {
	Cache
}

func NewService(repository *db.Repository, envConf *config.Config) *Service {
	return &Service{
		Cache: CacheService{repository: repository.Cache},
	}
}
