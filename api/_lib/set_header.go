package lib

import (
	"net/http"
)

// Sets the response headers to indicate that the response is JSON and should not be cached.
func SetHeaderAsJSON(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
}
