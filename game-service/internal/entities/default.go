package entities

type Message struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type Id struct {
	Id int `json:"id"`
}

type Email struct {
	Email string `json:"email"`
}

type URL struct {
	URL string `json:"url"`
}
