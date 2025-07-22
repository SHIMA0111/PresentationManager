package main

import (
	"context"
	"github.com/SHIMA0111/PresentationManager/backend/internal/middleware/auth"
	"log"

	"github.com/gin-gonic/gin"

	"github.com/SHIMA0111/PresentationManager/backend/internal/handler"
	"github.com/SHIMA0111/PresentationManager/backend/internal/infra"
	"github.com/SHIMA0111/PresentationManager/backend/internal/repository/mysql"
	"github.com/SHIMA0111/PresentationManager/backend/internal/service"
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

func setupPresentationRoutes(api *gin.RouterGroup, handler *handler.PresentationHandler) {
	presentations := api.Group("/presentations")
	{
		presentations.POST("", handler.CreatePresentation)
		presentations.GET("", handler.GetPresentations)
		presentations.GET("/teams/:teamId", handler.GetTeamPresentations)
		presentations.GET("/users/:userId", handler.GetUserPresentations)
		presentations.PUT("/team", handler.UpdatePresentationTeam)
		presentations.PUT("/assignee", handler.UpdatePresentationAssign)
		presentations.PUT("/contents", handler.UpdatePresentationContent)
		presentations.PUT("", handler.UpdatePresentation)
		presentations.DELETE("/:id", handler.DeletePresentation)
		presentations.DELETE("/hard/:id", handler.HardDeletePresentation)
	}
}

func setupTeamRoutes(api *gin.RouterGroup, handler *handler.TeamHandler) {
	teams := api.Group("/teams")
	{
		teams.POST("", handler.CreateTeam)
		teams.POST("/members", handler.AddTeamMember)
		teams.GET("", handler.GetTeams)
		teams.GET("/:id", handler.GetTeam)
		teams.PUT("", handler.UpdateTeam)
		teams.DELETE("/members/:id", handler.RemoveTeamMember)
		teams.DELETE("/:id", handler.DeleteTeam)
		teams.DELETE("/hard/:id", handler.HardDeleteTeam)
	}
}

func main() {
	r := gin.Default()

	// Middlewares
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	oidc, err := infra.SetupOIDC(ctx)
	if err != nil {
		log.Fatalf("failed to setup oidc: %v", err)
	}
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(auth.JWTAuthMiddleware(oidc))

	apiRoot := r.Group("/api/v1")

	db, err := infra.SetupDatabase()
	if err != nil {
		log.Fatalf("failed to setup database: %v", err)
	}
	defer db.Close()

	userRepo := mysql.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)
	setupUserRoutes(apiRoot, userHandler)

	presentationRepo := mysql.NewPresentationRepository(db)
	presentationService := service.NewPresentationService(presentationRepo)
	presentationHandler := handler.NewPresentationHandler(presentationService)
	setupPresentationRoutes(apiRoot, presentationHandler)

	teamRepo := mysql.NewTeamRepository(db)
	teamService := service.NewTeamService(teamRepo)
	teamHandler := handler.NewTeamHandler(teamService)
	setupTeamRoutes(apiRoot, teamHandler)

	log.Println("server is running on port 8080")
	if err = r.Run(":8080"); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
