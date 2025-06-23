package status

import (
	"encoding/json"
	"net/http"

	openapi "github.com/suzuki3jp/GitHubStats/api/_openapi"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	res := openapi.StatusResponse{
		Message: "API is running",
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
