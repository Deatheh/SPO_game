package handler

import (
	"encoding/json"
	"fmt"
	"magic-buttles/game-service/internal/entities"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) SendMessage(c *gin.Context) {
	var message entities.InputAiMessage
	err := c.BindJSON(&message)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error getting info: %s", err.Error())})
		return
	}
	if message.BossHP == 0 || message.MaxBossHP == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error getting info"})
		return
	}
	for _, pl := range message.Players {
		if pl.Class == "" || pl.Message == "" || pl.Name == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "error getting info"})
			return
		}
	}
	jsonData, err := json.Marshal(message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error making json"})
		return
	}
	jsonString := string(jsonData)
	str, err := h.services.AI.Send(jsonString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error with working of GigaChat"})
		return
	}
	var outputMessage entities.OutputAIMessage
	err = json.Unmarshal([]byte(str), &outputMessage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error getting GigaChat info"})
		return
	}

	c.JSON(http.StatusOK, outputMessage)
}
