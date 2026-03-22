package entities

type MessageArr struct {
	Arr []MessageInfo `json:"arr"`
}

type MessageInfo struct {
	Author  string `json:"author"`
	Message string `json:"message"`
}
