package server

import (
	"fmt"
	"log"
	"magic-buttles/game-service/internal/api/handler"
	"magic-buttles/game-service/internal/config"

	"github.com/gin-gonic/gin"
)

type APIServer struct {
	Port    string
	EnvConf *config.Config
	Handler *handler.Handler
}

func (s *APIServer) Run() {
	if s.EnvConf.Application.ProductionType == "prod" {
		gin.SetMode(gin.ReleaseMode)
		if err := s.Handler.InitRoutes().Run(fmt.Sprintf(":%v", s.Port)); err != nil {
			log.Fatal(fmt.Errorf("server run error: %w", err))
		}
	}

	if err := s.Handler.InitRoutes().Run(fmt.Sprintf(":%v", s.Port)); err != nil {
		log.Fatal(fmt.Errorf("server run error: %w", err))
	}
}
