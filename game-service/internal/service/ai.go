package service

import "magic-buttles/game-service/internal/db/ai"

type AiService struct {
	repository *ai.AiRepository
}

func (ais AiService) Send(info string) (string, error) {
	str, err := ais.repository.SendMessage(info)
	if err != nil {
		return "", err
	}

	return str, nil
}
