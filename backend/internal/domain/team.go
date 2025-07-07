package domain

type Team struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type TeamCreateRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type TeamUpdateRequest struct {
	Id          string `json:"id" binding:"required,uuid"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
}
