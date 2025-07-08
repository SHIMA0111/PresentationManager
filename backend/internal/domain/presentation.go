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

type PresentationUpdateRequest interface {
	GetPresentationData() (bool, *Presentation)
}

type PresentationUpdateTeamRequest struct {
	Id   string `json:"id" binding:"required,uuid"`
	Team string `json:"team" binding:"required,uuid"`
}

type PresentationUpdateAssigneeRequest struct {
	Id       string `json:"id" binding:"required,uuid"`
	Assignee string `json:"assignee" binding:"required,uuid"`
}

type PresentationUpdateContentsRequest struct {
	Id          string `json:"id" binding:"required,uuid"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"omitempty"`
}

type PresentationUpdateAllRequest struct {
	Id               string     `json:"id" binding:"required,uuid"`
	PresentationDate string     `json:"presentation_date" binding:"required"`
	Team             string     `json:"team" binding:"required,uuid"`
	Assignee         string     `json:"assignee" binding:"required,uuid"`
	Title            string     `json:"title" binding:"required"`
	Description      string     `json:"description" binding:"omitempty"`
	Status           StatusEnum `json:"status" binding:"required"`
}

func (r *PresentationUpdateTeamRequest) GetPresentationData() (bool, *Presentation) {
	return false, &Presentation{
		Id:     r.Id,
		Team:   r.Team,
		Status: Unassigned,
	}
}

func (r *PresentationUpdateAssigneeRequest) GetPresentationData() (bool, *Presentation) {
	return false, &Presentation{
		Id:       r.Id,
		Assignee: r.Assignee,
		Status:   Assigned,
	}
}

func (r *PresentationUpdateContentsRequest) GetPresentationData() (bool, *Presentation) {
	return false, &Presentation{
		Id:          r.Id,
		Title:       r.Title,
		Description: r.Description,
		Status:      ContentInputted,
	}
}

func (r *PresentationUpdateAllRequest) GetPresentationData() (bool, *Presentation) {
	return true, &Presentation{
		Id:               r.Id,
		PresentationDate: r.PresentationDate,
		Team:             r.Team,
		Assignee:         r.Assignee,
		Title:            r.Title,
		Description:      r.Description,
		Status:           r.Status,
	}
}
