package user

import (
	"encoding/json"
	"fmt"
	"net/http"

	lib "github.com/suzuki3jp/GitHubStats/api/_lib"
	"github.com/suzuki3jp/GitHubStats/api/_lib/graphql"
	openapi "github.com/suzuki3jp/GitHubStats/api/_openapi"
)

// Handler handles the request for getting user information
func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request for user information")
	accessToken := r.URL.Query().Get("access_token")

	lib.SetHeaderAsJSON(w)

	// Validate required parameters
	if accessToken == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Code:    "MISSING_TOKEN",
			Message: "access_token is required",
		})
		return
	}

	client := graphql.NewClient("https://api.github.com/graphql", accessToken)

	// Fetch user information using GraphQL
	var userResp struct {
		Viewer struct {
			Login     string `json:"login"`
			Name      string `json:"name"`
			AvatarUrl string `json:"avatarUrl"`
		} `json:"viewer"`
	}

	userQuery := `
        query {
            viewer {
                login
                name
                avatarUrl
            }
        }
    `

	err := client.Query(
		r.Context(),
		userQuery,
		map[string]interface{}{},
		&userResp,
	)
	if err != nil {
		fmt.Printf("Error fetching user information: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Code:    "GRAPHQL_ERROR",
			Message: "Failed to fetch user information. Please check your access token.",
		})
		return
	}

	// Check if user exists
	if userResp.Viewer.Login == "" {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Code:    "USER_NOT_FOUND",
			Message: "User not found or access token is invalid",
		})
		return
	}

	// Prepare response data
	var username *string
	var name *string
	var avatarUrl *string

	if userResp.Viewer.Login != "" {
		username = &userResp.Viewer.Login
	}

	if userResp.Viewer.Name != "" {
		name = &userResp.Viewer.Name
	}

	if userResp.Viewer.AvatarUrl != "" {
		avatarUrl = &userResp.Viewer.AvatarUrl
	}

	respData := openapi.UserResponse{
		Username:  username,
		Name:      name,
		AvatarUrl: avatarUrl,
	}

	// Send response
	json.NewEncoder(w).Encode(respData)
}
