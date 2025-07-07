package main

import (
	"github.com/SHIMA0111/PresentationManager/backend/internal/handler"
	"github.com/SHIMA0111/PresentationManager/backend/internal/infra"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository/mysql"
	"github.com/SHIMA0111/PresentationManager/backend/internal/service"
	"github.com/gin-gonic/gin"
	"log"
)

func setupUserRoutes(api *gin.RouterGroup, handler *handler.UserHandler) {
	users := api.Group("/users")
	{
		users.POST("", handler.CreateUser)
		users.GET("", handler.GetAllUsers)
		users.GET("/:id", handler.GetUser)
		users.GET("/teams/:teamId", handler.GetUsersByTeam)
		users.PUT("", handler.UpdateUser)
		users.DELETE("/:id", handler.DeleteUser)
		users.DELETE("/hard/:id", handler.HardDeleteUser)
	}
}

func main() {
	r := gin.Default()
	apiRoot := r.Group("/api/v1")

	db, err := infra.SetupDatabase()
	if err != nil {
		log.Fatal("failed to setup database: ", err)
	}
	defer db.Close()

	userRepo := mysql.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)
	setupUserRoutes(apiRoot, userHandler)

	log.Println("server is running on port 8080")
	if err = r.Run(":8080"); err != nil {
		log.Fatal("failed to run server: ", err)
	}
}
