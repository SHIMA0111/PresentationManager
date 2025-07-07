package domain

type StatusEnum int

const (
	Draft StatusEnum = iota
	Unassigned
	Assigned
	ContentInputted
	Completed
)

func (s StatusEnum) String() string {
	switch s {
	case Draft:
		return "draft"
	case Unassigned:
		return "unassigned"
	case Assigned:
		return "assigned"
	case ContentInputted:
		return "content_inputted"
	case Completed:
		return "completed"
	default:
		return ""
	}
}

type Presentation struct {
	Id               string     `json:"id"`
	PresentationDate string     `json:"presentation_date"`
	Team             string     `json:"team"`
	Assignee         string     `json:"assignee"`
	Title            string     `json:"title"`
	Description      string     `json:"description"`
	Status           StatusEnum `json:"status"`
}

type PresentationCreateRequest struct {
	PresentationDate string `json:"presentation_date" binding:"required"`
	Team             string `json:"team" binding:"required"`
}

type PresentationUpdateTeamRequest struct {
	Id   string `json:"id" binding:"required"`
	Team string `json:"team" binding:"required"`
}

type PresentationUpdateAssigneeRequest struct {
	Id       string `json:"id" binding:"required"`
	Assignee string `json:"assignee" binding:"required"`
}

type PresentationUpdateContentsRequest struct {
	Id          string `json:"id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"omitempty"`
}
