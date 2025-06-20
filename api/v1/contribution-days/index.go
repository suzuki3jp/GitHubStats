package contributionDays

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"

	openapi_types "github.com/oapi-codegen/runtime/types"
	lib "github.com/suzuki3jp/GitHubStats/api/_lib"
	"github.com/suzuki3jp/GitHubStats/api/_lib/graphql"
	openapi "github.com/suzuki3jp/GitHubStats/api/_openapi"
)

// Handler handles the request for getting contribution days
func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request for contribution days")
	access_token := r.URL.Query().Get("access_token")
	username := r.URL.Query().Get("username")

	lib.SetHeaderAsJSON(w)

	// Validate required parameters
	if access_token == "" || username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Message: "access_token and username are required",
		})
		return
	}

	params := openapi.GetContributionDaysParams{
		AccessToken: access_token,
		Username:    username,
	}

	client := graphql.NewClient("https://api.github.com/graphql", params.AccessToken)

	// Fetch user created at date using client.Query
	var userCreatedAtResp struct {
		User struct {
			CreatedAt string `json:"createdAt"`
		} `json:"user"`
	}
	userCreatedAtQuery := `
        query($login: String!) {
            user(login: $login) {
                createdAt
            }
        }
    `
	err := client.Query(
		r.Context(),
		userCreatedAtQuery,
		map[string]interface{}{
			"login": params.Username,
		},
		&userCreatedAtResp,
	)
	if err != nil {
		fmt.Println("Error fetching user created at:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Message: "Failed to fetch user creation date",
		})
		return
	}
	userCreatedAt, err := time.Parse(time.RFC3339, userCreatedAtResp.User.CreatedAt)
	if err != nil {
		fmt.Println("Error parsing user created at:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(openapi.ErrorResponse{
			Message: "Failed to parse user creation date",
		})
		return
	}

	// Fetch user contribution collection of all time using client.Query
	contributionDays := make(map[string]int)
	currentYear := userCreatedAt.Year()
	thisYear := time.Now().Year()

	for year := currentYear; year <= thisYear; year++ {
		from := fmt.Sprintf("%d-01-01T00:00:00Z", year)
		to := fmt.Sprintf("%d-12-31T23:59:59Z", year)

		var contribResp struct {
			User struct {
				ContributionsCollection struct {
					ContributionCalendar struct {
						Weeks []struct {
							ContributionDays []struct {
								Date  string `json:"date"`
								Count int    `json:"contributionCount"`
							} `json:"contributionDays"`
						} `json:"weeks"`
					} `json:"contributionCalendar"`
				} `json:"contributionsCollection"`
			} `json:"user"`
		}
		contribQuery := `
            query($login: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $login) {
                    contributionsCollection(from: $from, to: $to) {
                        contributionCalendar {
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                }
                            }
                        }
                    }
                }
            }
        `
		err := client.Query(
			r.Context(),
			contribQuery,
			map[string]interface{}{
				"login": params.Username,
				"from":  from,
				"to":    to,
			},
			&contribResp,
		)
		if err != nil {
			fmt.Printf("Error fetching contributions for %d: %v\n", year, err)
			continue
		}
		for _, week := range contribResp.User.ContributionsCollection.ContributionCalendar.Weeks {
			for _, day := range week.ContributionDays {
				if day.Count > 0 {
					contributionDays[day.Date] = day.Count
				}
			}
		}
	}

	// Calculate total contributions and prepare dates for sorting
	var totalContributions int
	var dates []string
	for date, count := range contributionDays {
		totalContributions += count
		dates = append(dates, date)
	}

	// Sort dates
	sort.Strings(dates)

	// Convert sorted dates to []openapi.ContributionDay
	contributionDayObjs := make([]openapi.ContributionDay, 0, len(contributionDays))
	for _, date := range dates {
		parsedDate, err := time.Parse("2006-01-02", date)
		if err != nil {
			fmt.Printf("Error parsing date %s: %v\n", date, err)
			continue
		}
		dateVal := openapi_types.Date{Time: parsedDate}
		countCopy := contributionDays[date]
		contributionDayObjs = append(contributionDayObjs, openapi.ContributionDay{
			Date:  dateVal,
			Count: countCopy,
		})
	}

	respData := openapi.ContributionDaysResponse{
		Days:     contributionDayObjs,
		Username: params.Username,
		Total:    totalContributions,
	}

	// Send response
	// For example:
	json.NewEncoder(w).Encode(respData)
}
