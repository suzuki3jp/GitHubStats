package handler

import (
	"encoding/json"
	"net/http"

	// oapi-codegenで生成された型のパス。go.modのmodule名に合わせて修正してください
	"github.com/suzuki3jp/GitHubStats/api/openapi"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// クエリパラメータ取得
	content := r.URL.Query().Get("content")

	// 必須チェック
	if content == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Code:    "MissingParameter",
			Message: "The 'content' query parameter is required.",
		})
		return
	}

	// 正常レスポンス
	resp := openapi.HelloResponse{
		Message: "Hello from Go, " + content,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}