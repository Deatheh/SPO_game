package entities

type PlayerInfo struct {
	Name    string `json:"name"`
	Message string `json:"message"`
	Class   string `json:"class"`
	HP      int    `json:"hp"`
}

type OutputPlayerInfo struct {
	Name string `json:"name"`
	HP   int    `json:"hp"`
}

type InputAiMessage struct {
	Players   []PlayerInfo `json:"users"`
	BossHP    int          `json:"boss_hp"`
	MaxBossHP int          `json:"max_boss_hp"`
}

type OutputAIMessage struct {
	Players []OutputPlayerInfo `json:"users"`
	BossHP  int                `json:"boss_hp"`
	Message string             `json:"message"`
}
