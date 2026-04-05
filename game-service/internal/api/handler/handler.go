package handler

import (
	"magic-buttles/game-service/internal/config"
	"magic-buttles/game-service/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services *service.Service
	envConf  *config.Config
}

func NewHandler(services *service.Service, envConf *config.Config) *Handler {
	return &Handler{services: services, envConf: envConf}
}

func (h *Handler) InitRoutes() *gin.Engine {
	r := gin.Default()
	hub := newHub()
	go hub.run()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173", "http://localhost:8000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Upgrade", "Connection"},
		AllowCredentials: true,
		AllowWebSockets:  true,
	}))

	r.GET("/", func(c *gin.Context) { c.File("./web/home.html") })
	cm := r.Group("")
	{
		cm.GET("/cache_message", h.GetCacheMessages)
		cm.POST("/cache_message/clear", h.ClearCacheMessages)
	}

	r.GET("/ws", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		h.serveWs(c, hub)
	})

	r.POST("/ai_message", h.SendMessage)
	return r
}
