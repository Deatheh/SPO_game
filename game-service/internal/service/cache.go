package service

import (
	"context"
	redis2 "magic-buttles/game-service/internal/db/redis"
	"time"
)

type CacheService struct {
	repository *redis2.CacheRepository
}

func (cs CacheService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	err := cs.repository.Set(ctx, key, value, expiration)
	if err != nil {
		return err
	}

	return nil
}

func (cs CacheService) Get(ctx context.Context, key string) (string, error) {
	value, err := cs.repository.Get(ctx, key)
	if err != nil {
		return "", err
	}

	return value, nil
}

func (cs CacheService) SetStruct(ctx context.Context, key string, structure interface{}, expiration time.Duration) error {
	err := cs.repository.SetStruct(ctx, key, structure, expiration)

	return err
}

func (cs CacheService) GetStruct(ctx context.Context, key string) (interface{}, error) {
	structure, err := cs.repository.GetStruct(ctx, key)

	return structure, err
}

func (cs CacheService) GetAllKeys(ctx context.Context) ([]string, error) {
	keys, err := cs.repository.GetAllKeys(ctx)
	if err != nil {
		return nil, err
	}
	return keys, nil
}

func (cs CacheService) ClearCache() error {
	err := cs.repository.ClearCache()
	return err
}
