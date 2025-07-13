package domain

type StatusEnum int

const (
	Unassigned StatusEnum = iota
	Assigned
	ContentInputted
	Completed
)

func (s StatusEnum) String() string {
	switch s {
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

type PresentationUpdateRequestInterface interface {
	GetPresentationData() (bool, *PresentationRaw)
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

type PresentationRaw struct {
	Id               string
	PresentationDate string
	TeamId           string
	AssigneeId       string
	Title            string
	Description      string
	Status           StatusEnum
}

type PresentationCreateRequest struct {
	PresentationDate string `json:"presentation_date" binding:"required"`
	Team             string `json:"team" binding:"required"`
}

type PresentationUpdateTeamRequest struct {
	Id     string `json:"id" binding:"required,uuid"`
	TeamId string `json:"team_id" binding:"required,uuid"`
}

type PresentationUpdateAssigneeRequest struct {
	Id         string `json:"id" binding:"required,uuid"`
	AssigneeId string `json:"assignee_id" binding:"required,uuid"`
}

type PresentationUpdateContentsRequest struct {
	Id          string `json:"id" binding:"required,uuid"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"omitempty"`
}

type PresentationUpdateRequest struct {
	Id               string     `json:"id" binding:"required,uuid"`
	PresentationDate string     `json:"presentation_date" binding:"required"`
	TeamId           string     `json:"team_id" binding:"required,uuid"`
	AssigneeId       string     `json:"assignee_id" binding:"required,uuid"`
	Title            string     `json:"title" binding:"required"`
	Description      string     `json:"description" binding:"omitempty"`
	Status           StatusEnum `json:"status" binding:"required"`
}

func (r *PresentationUpdateTeamRequest) GetPresentationData() (bool, *PresentationRaw) {
	return false, &PresentationRaw{
		Id:     r.Id,
		TeamId: r.TeamId,
		Status: Unassigned,
	}
}

func (r *PresentationUpdateAssigneeRequest) GetPresentationData() (bool, *PresentationRaw) {
	return false, &PresentationRaw{
		Id:         r.Id,
		AssigneeId: r.AssigneeId,
		Status:     Assigned,
	}
}

func (r *PresentationUpdateContentsRequest) GetPresentationData() (bool, *PresentationRaw) {
	return false, &PresentationRaw{
		Id:          r.Id,
		Title:       r.Title,
		Description: r.Description,
		Status:      ContentInputted,
	}
}

func (r *PresentationUpdateRequest) GetPresentationData() (bool, *PresentationRaw) {
	return true, &PresentationRaw{
		Id:               r.Id,
		PresentationDate: r.PresentationDate,
		TeamId:           r.TeamId,
		AssigneeId:       r.AssigneeId,
		Title:            r.Title,
		Description:      r.Description,
		Status:           r.Status,
	}
}
