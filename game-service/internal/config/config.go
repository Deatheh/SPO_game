package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Application struct {
	ProductionType string
	Port           int
}

type Redis struct {
	Port     string
	Password string
	Host     string
}

type GigaChat struct {
	AuthKey string
}

type Config struct {
	Application Application
	Redis       Redis
	GigaChat    GigaChat
}

func NewEnvConfig() *Config {
	appPortStr := os.Getenv("APP_PORT")
	appPort, err := strconv.Atoi(appPortStr)
	if err != nil {
		panic(fmt.Errorf("NewEnvConfig: error converting appPortStr: %w", err))
	}
	return &Config{
		Application: Application{
			ProductionType: os.Getenv("PRODUCTION_TYPE"),
			Port:           appPort,
		},
		Redis: Redis{
			Port:     os.Getenv("REDIS_PORT"),
			Password: os.Getenv("REDIS_PASSWORD"),
			Host:     os.Getenv("REDIS_HOST"),
		},
		GigaChat: GigaChat{
			AuthKey: os.Getenv("GIGACHAT_AUTH_KEY"),
		},
	}
}

func PrintConfigWithHiddenSecrets(config *Config) {
	// Функция для маскировки секретов
	mask := func(s string) string {
		if s == "" {
			return ""
		}
		return strings.Repeat("*", len(s))
	}

	fmt.Println("=== Application Config ===")
	fmt.Printf("ProductionType: %s\n", config.Application.ProductionType)
	fmt.Printf("AppPort: %d\n", config.Application.Port)

	fmt.Println("\n=== Redis Config ===")
	fmt.Printf("Host: %s\n", config.Redis.Host)
	fmt.Printf("Port: %s\n", config.Redis.Port)
	fmt.Printf("Password: %s\n", mask(config.Redis.Password))

	fmt.Println("\n=== GigaChat Config ===")
	fmt.Printf("Host: %s\n", mask(config.GigaChat.AuthKey))
}
