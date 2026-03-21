package redis

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"magic-buttles/game-service/internal/config"
	"time"

	"github.com/redis/go-redis/v9"
)

type CacheRepository struct {
	repository *redis.Client
}

func InitRedis(envConf *config.Config) *CacheRepository {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", envConf.Redis.Host, envConf.Redis.Port),
		Password: envConf.Redis.Password,
		DB:       0,
	})

	err := client.Ping(context.Background()).Err()
	if err != nil {
		if envConf.Application.ProductionType == "prod" {
			log.Fatal("redis: ", err.Error())
		} else {
			fmt.Println("redis: ", err.Error())
		}
	}

	return &CacheRepository{repository: client}
}

func (cr *CacheRepository) ClearCache() error {
	err := cr.repository.FlushAll(context.Background()).Err()
	if err != nil {
		fmt.Println(fmt.Errorf("redis clear cache error: %w", err))
	}
	return err
}

func (cr *CacheRepository) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	err := cr.repository.Set(ctx, key, value, expiration).Err()
	switch {
	case errors.Is(err, context.DeadlineExceeded):
		return errors.New("request timeout")
	case err != nil:
		return fmt.Errorf("redis set error: %v", err.Error())
	}

	return nil
}

func (cr *CacheRepository) Get(ctx context.Context, key string) (string, error) {
	value, err := cr.repository.Get(ctx, key).Result()
	switch {
	case errors.Is(err, redis.Nil):
		return "", errors.New("key does not exist")
	case errors.Is(err, context.DeadlineExceeded):
		return "", errors.New("request timeout")
	case err != nil:
		return "", fmt.Errorf("redis get error: %v", err.Error())
	case value == "":
		return "", errors.New("empty value")
	}

	return value, nil
}

func (cr *CacheRepository) GetAllKeys(ctx context.Context) ([]string, error) {
	var cursor uint64
	keys, cursor, err := cr.repository.Scan(ctx, cursor, "*", 10000).Result()
	if err != nil {
		return nil, fmt.Errorf("redis scan error: %v", err.Error())
	}
	return keys, nil
}

func (cr *CacheRepository) GetStructArray(ctx context.Context, scheduleKey interface{}) (interface{}, error) {
	key, _ := json.Marshal(scheduleKey)
	value, err := cr.Get(ctx, string(key))
	if err != nil {
		return nil, err
	}
	var mas []interface{}
	_ = json.Unmarshal([]byte(value), &mas)

	return mas, nil
}

func (cr *CacheRepository) SetStructArray(ctx context.Context, scheduleKey, mas interface{}, expiration time.Duration) error {
	key, _ := json.Marshal(scheduleKey)
	value, _ := json.Marshal(mas)

	err := cr.Set(ctx, string(key), string(value), expiration)
	if err != nil {
		return err
	}

	return nil
}
