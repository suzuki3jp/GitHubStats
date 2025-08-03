package languageStats

import (
	"encoding/json"
	"net/http"

	languageStats "github.com/suzuki3jp/GitHubStats/api/_language-stats"
	lib "github.com/suzuki3jp/GitHubStats/api/_lib"
)

// GetLanguageStats handles the language statistics endpoint
func GetLanguageStats(w http.ResponseWriter, r *http.Request) {
	println("Received request for language statistics")
	lib.SetHeaderAsJSON(w)

	// Get query parameters
	username := r.URL.Query().Get("username")
	accessToken := r.URL.Query().Get("access_token")

	// Validate required parameters
	if username == "" {
		http.Error(w, `{"code": "missing_parameter", "message": "username parameter is required"}`, http.StatusBadRequest)
		return
	}

	if accessToken == "" {
		http.Error(w, `{"code": "missing_parameter", "message": "access_token parameter is required"}`, http.StatusBadRequest)
		return
	}

	// Create service and get language statistics
	service := languageStats.NewService(accessToken)
	stats, err := service.GetLanguageStats(r.Context(), username)
	if err != nil {
		http.Error(w, `{"code": "internal_error", "message": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	// Marshal and return JSON response
	jsonData, err := json.Marshal(stats)
	if err != nil {
		http.Error(w, `{"code": "internal_error", "message": "Failed to marshal response"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
