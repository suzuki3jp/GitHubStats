package contributionDaysHandler

import (
	"encoding/json"
	"fmt"
	"net/http"

	contributionDays "github.com/suzuki3jp/GitHubStats/api/_contribution-days"
	lib "github.com/suzuki3jp/GitHubStats/api/_lib"
	openapi "github.com/suzuki3jp/GitHubStats/api/_openapi"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request for contribution days")
	lib.SetHeaderAsJSON(w)

	accessToken := r.URL.Query().Get("access_token")
	username := r.URL.Query().Get("username")

	if accessToken == "" || username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Message: "access_token and username are required",
		})
		return
	}

	service := contributionDays.NewService(accessToken)
	response, err := service.GetContributions(r.Context(), username)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(response)
}
