package domain

type Team struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type TeamMember struct {
	TeamId string `json:"team_id"`
	UserId string `json:"user_id"`
	Role   int    `json:"role"`
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

type TeamMemberAddRequest struct {
	TeamId string `json:"team_id" binding:"required,uuid"`
	UserId string `json:"user_id" binding:"required,uuid"`
	Role   int    `json:"role" binding:"required"`
}

type TeamMemberRemoveRequest struct {
	TeamId string `json:"team_id" binding:"required,uuid"`
	UserId string `json:"user_id" binding:"required,uuid"`
}
