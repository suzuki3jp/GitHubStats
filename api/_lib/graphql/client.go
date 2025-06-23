package graphql

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

type Client struct {
	endpoint   string
	httpClient *http.Client
	token      string
}

// Create a new GraphQL client
func NewClient(endpoint, token string) *Client {
	return &Client{
		endpoint:   endpoint,
		httpClient: http.DefaultClient,
		token:      token,
	}
}

// Query executes a GraphQL query with the provided variables and decodes the result into the provided interface.
func (c *Client) Query(ctx context.Context, query string, variables map[string]interface{}, result interface{}) error {
	body := map[string]interface{}{
		"query":     query,
		"variables": variables,
	}
	b, err := json.Marshal(body)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.endpoint, bytes.NewBuffer(b))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	if c.token != "" {
		req.Header.Set("Authorization", "Bearer "+c.token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var respBody struct {
		Data   interface{}              `json:"data"`
		Errors []map[string]interface{} `json:"errors"`
	}
	respBody.Data = result

	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return err
	}

	if len(respBody.Errors) > 0 {
		fmt.Printf("GraphQL errors: %v\n", respBody.Errors)
		return errors.New("graphql: error response")
	}
	return nil
}
