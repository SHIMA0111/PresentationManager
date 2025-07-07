package infra

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// SetupDatabase initializes and returns a MySQL database connection using environment variables for configuration.
// It verifies provided credentials, assigns defaults as needed, and retries connection checks before finalizing.
// Returns the database instance or an error if the setup or connection process fails.
func SetupDatabase() (*sql.DB, error) {
	username := os.Getenv("MYSQL_USER")
	password := os.Getenv("MYSQL_PASSWORD")

	if username == "" || password == "" {
		return nil, fmt.Errorf("MYSQL_USER or MYSQL_PASSWORD or the both are empty. please check your environment variables")
	}

	port := os.Getenv("MYSQL_PORT")
	// If the port is not set, use the default port of the MySQL
	if port == "" {
		port = "3306"
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}

	dbname := os.Getenv("MYSQL_DBNAME")
	if dbname == "" {
		dbname = "presentation_manager"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, host, port, dbname)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open mysql: %w", err)
	}

	// Checks the connection with retry
	if err = CheckConnection(db, 10); err != nil {
		return nil, err
	}

	return db, nil
}

func CheckConnection(db *sql.DB, count uint) error {
	var err error
	for i := uint(0); i < count; i++ {
		if err = db.Ping(); err != nil {
			slog.Warn("failed to ping mysql. i'm retrying...(%d/%d)", i+1, count)
			time.Sleep(time.Second * 1)
			continue
		}
		return nil
	}

	return fmt.Errorf("failed to ping mysql: %w", err)
}
