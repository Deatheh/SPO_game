package ai

import (
	"context"
	"fmt"
	"magic-buttles/game-service/internal/config"

	gigago "github.com/AlexandrVIvanov/gigago"
)

// AiRepository - репозиторий для работы с AI
type AiRepository struct {
	client *gigago.Client
}

var promt1 = `Ты — ИИ-ассистент в пошаговой RPG-игре. Твоя задача — обработать ход игроков и вернуть результат в строгом формате JSON без комментариев.

Входные данные (ты получишь их отдельно):
- users: массив игроков с полями:
  - name: имя игрока
  - message: описание действия игрока в этом ходу (что он делает, как атакует)
  - class: класс персонажа (например, Изобретатель, Алхимик и т.д.)
  - hp: текущее здоровье игрока
- boss_hp: текущее здоровье босса
- max_boss_hp: максимальное здоровье босса

Вот входные данные:
`

var promt2 = `

Как работать:
1. Проанализируй message каждого игрока. Опирайся на его class и описание удара, чтобы определить урон.
2. Каждый игрок наносит урон боссу. Урон должен быть разумным (обычно от 1 до 50, но может быть выше в зависимости от эпичности действия).
3. Вычти суммарный урон из boss_hp. Босс не может иметь здоровье меньше 0.
4. Игроки могут получать ответный урон от босса или от своих действий (если message подразумевает риск). Уменьшай hp игроков при необходимости. Здоровье игрока не может быть меньше 0.
5. В поле message напиши краткое описание того, что произошло за ход: кто сколько нанёс урона, получил ли кто-то урон, как изменилось состояние босса.

Правила форматирования ответа:
- Ответ должен быть ТОЛЬКО чистым JSON-объектом.
- ЗАПРЕЩЕНЫ любые комментарии (ни //, ни /* */).
- ЗАПРЕЩЕНЫ пояснения до или после JSON.
- ЗАПРЕЩЕНА Markdown-разметка (например, ` + "```json" + `).
- Все строки должны быть в двойных кавычках.

Ожидаемая структура ответа:
{
  "users": [
    {"name": "<имя>", "hp": <новое здоровье>},
    ...
  ],
  "boss_hp": <новое здоровье босса>,
  "message": "<описание хода>"
}

Пример (чистый JSON, без комментариев):
{
  "users": [
    {"name": "1", "hp": 40},
    {"name": "2", "hp": 55}
  ],
  "boss_hp": 970,
  "message": "Изобретатель нанёс 12 урона магическим ключом. Алхимик нанёс 18 урона кислотой, но обжёг себе руку и потерял 5 HP. У босса осталось 970 HP."
}
`

// InitAiServer - инициализация AI сервера
func InitAiServer(envConf *config.Config) *AiRepository {
	ctx := context.Background()
	authKey := envConf.GigaChat.AuthKey

	client, err := gigago.NewClient(
		ctx,
		authKey,
		gigago.WithCustomInsecureSkipVerify(true),
	)
	if err != nil {
		panic("Ошибка создания клиента GigaChat: " + err.Error())
	}

	return &AiRepository{client: client}
}

func buildPrompt(input string) string {
	return promt1 + string(input) + promt2
}

// SendMessage - отправляет сообщение в GigaChat и возвращает сырой ответ
func (air *AiRepository) SendMessage(input string) (string, error) {
	model := air.client.GenerativeModel("GigaChat")

	prompt := buildPrompt(input)

	messages := []gigago.Message{
		{Role: gigago.RoleUser, Content: prompt},
	}

	resp, err := model.Generate(context.Background(), messages)
	if err != nil {
		return "", fmt.Errorf("ошибка генерации: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("пустой ответ от GigaChat")
	}

	fmt.Println(resp.Choices[0].Message.Content)

	return resp.Choices[0].Message.Content, nil
}
