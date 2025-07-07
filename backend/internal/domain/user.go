package domain

type RoleEnum int

const (
	UserRole RoleEnum = iota
	AdminRole
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

type UserCreateRequest struct {
	Name  string   `json:"name" binding:"required"`
	Email string   `json:"email" binding:"required, email"`
	Role  RoleEnum `json:"role" binding:"required"`
}

type UserUpdateRequest struct {
	Id    string   `json:"id" binding:"required, uuid"`
	Name  string   `json:"name" binding:"required"`
	Email string   `json:"email" binding:"required, email"`
	Role  RoleEnum `json:"role" binding:"required"`
}
