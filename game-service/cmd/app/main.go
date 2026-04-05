package main

import (
	"log"
	"magic-buttles/game-service/internal/api/handler"
	"magic-buttles/game-service/internal/api/server"
	"magic-buttles/game-service/internal/config"
	"magic-buttles/game-service/internal/db"
	"magic-buttles/game-service/internal/db/ai"
	"magic-buttles/game-service/internal/db/redis"
	"magic-buttles/game-service/internal/service"
	"strconv"

	"github.com/joho/godotenv"
)

// @title IQJ API
// @version 1.0
// @BasePath /
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found")
	}
	envConf := config.NewEnvConfig()
	config.PrintConfigWithHiddenSecrets(envConf)

	cache := redis.InitRedis(envConf)
	ai := ai.InitAiServer(envConf)
	repository := &db.Repository{Cache: cache, AI: ai}
	services := service.NewService(repository, envConf)
	handlers := handler.NewHandler(services, envConf)

	apiServer := server.APIServer{Port: strconv.Itoa(envConf.Application.Port), EnvConf: envConf, Handler: handlers}
	apiServer.Run()
}
