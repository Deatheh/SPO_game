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
	SetStruct(ctx context.Context, key string, structure interface{}, expiration time.Duration) error
	GetStruct(ctx context.Context, key string) ([]byte, error)
	GetAllKeys(ctx context.Context) ([]string, error)
	ClearCache() error
}

type AI interface {
	Send(info string) (string, error)
}

type Service struct {
	Cache
	AI
}

func NewService(repository *db.Repository, envConf *config.Config) *Service {
	return &Service{
		Cache: CacheService{repository: repository.Cache},
		AI:    AiService{repository: repository.AI},
	}
}
