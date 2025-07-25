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
	username := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")

	if username == "" || password == "" {
		return nil, fmt.Errorf("DB_USER or DB_PASSWORD or the both are empty. please check your environment variables")
	}

	port := os.Getenv("DB_PORT")
	// If the port is not set, use the default port of the MySQL
	if port == "" {
		port = "3306"
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}

	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "presentation_manager"
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		username, password, host, port, dbname)

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
			slog.Warn("failed to ping mysql. i'm retrying...", "count", i+1, "max", count)
			time.Sleep(time.Second * 1)
			continue
		}
		return nil
	}

	return fmt.Errorf("failed to ping mysql: %w", err)
}
