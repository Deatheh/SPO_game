package db

import (
	"magic-buttles/game-service/internal/db/ai"
	"magic-buttles/game-service/internal/db/redis"
)

type Repository struct {
	Cache *redis.CacheRepository
	AI    *ai.AiRepository
}
