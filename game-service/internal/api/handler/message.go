package handler

import (
	"encoding/json"
	"fmt"
	"magic-buttles/game-service/internal/entities"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetCacheMessages(c *gin.Context) {
	info, err := h.services.Cache.GetAllKeys(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error getting cache info: %s", err.Error())})
		return
	}

	var mes entities.MessageArr
	mes.Arr = make([]entities.MessageInfo, 0)

	for _, k := range info {
		m, err := h.services.GetStruct(c, k)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error getting cache info: %s", err.Error())})
			return
		}
		fmt.Println(m)
		var infoMes entities.MessageInfo
		err = json.Unmarshal([]byte(m), &infoMes)
		mes.Arr = append(mes.Arr, infoMes)
	}

	c.JSON(http.StatusOK, mes)
}

func (h *Handler) ClearCacheMessages(c *gin.Context) {
	err := h.services.Cache.ClearCache()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error clear cache info: %s", err.Error())})
		return
	}

	c.JSON(http.StatusOK, entities.Message{Message: "ok"})
}
