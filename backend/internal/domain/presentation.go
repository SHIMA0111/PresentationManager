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

type PresentationCreate struct {
	PresentationDate string `json:"presentation_date"`
	Team             string `json:"team"`
}

type PresentationUpdateTeam struct {
	Id   string `json:"id"`
	Team string `json:"team"`
}

type PresentationUpdateAssignee struct {
	Id       string `json:"id"`
	Assignee string `json:"assignee"`
}

type PresentationUpdateContents struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
