package mysql

import "database/sql"

type PresentationRepository struct {
	db *sql.DB
}
