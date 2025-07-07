package domain

type RoleEnum int

const (
	AdminRole RoleEnum = iota
	UserRole
)

func (r RoleEnum) String() string {
	switch r {
	case AdminRole:
		return "admin"
	case UserRole:
		return "user"
	default:
		return ""
	}
}

type User struct {
	Id    string   `json:"id"`
	Name  string   `json:"name"`
	Email string   `json:"email"`
	Role  RoleEnum `json:"role"`
}

type UserCreate struct {
	Name  string   `json:"name"`
	Email string   `json:"email"`
	Role  RoleEnum `json:"role"`
}
