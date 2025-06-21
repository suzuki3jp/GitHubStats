package contributionDays

import (
	"context"
	"fmt"
	"sort"
	"time"

	openapi_types "github.com/oapi-codegen/runtime/types"
	"github.com/suzuki3jp/GitHubStats/api/_lib/graphql"
	openapi "github.com/suzuki3jp/GitHubStats/api/_openapi"
)

type Service struct {
	client *graphql.Client
}

func NewService(accessToken string) *Service {
	return &Service{
		client: graphql.NewClient("https://api.github.com/graphql", accessToken),
	}
}

func (s *Service) GetContributions(ctx context.Context, username string) (*openapi.ContributionDaysResponse, error) {
	// Get user creation date
	createdAt, err := s.getUserCreatedAt(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user creation date: %w", err)
	}

	// Get all contributions
	contributions := make(map[string]int)
	totalCount := 0

	currentYear := createdAt.Year()
	thisYear := time.Now().Year()

	for year := currentYear; year <= thisYear; year++ {
		yearContributions, err := s.getYearContributions(ctx, username, year)
		if err != nil {
			fmt.Printf("Error fetching contributions for %d: %v\n", year, err)
			continue
		}

		for date, count := range yearContributions {
			if count > 0 {
				contributions[date] = count
				totalCount += count
			}
		}
	}

	// Convert to response format
	days := s.convertToResponseDays(contributions)

	return &openapi.ContributionDaysResponse{
		Days:     days,
		Username: username,
		Total:    totalCount,
	}, nil
}

func (s *Service) getUserCreatedAt(ctx context.Context, username string) (time.Time, error) {
	query := `
		query($login: String!) {
			user(login: $login) {
				createdAt
			}
		}
	`

	var resp struct {
		User struct {
			CreatedAt string `json:"createdAt"`
		} `json:"user"`
	}

	err := s.client.Query(
		ctx,
		query,
		map[string]interface{}{
			"login": username,
		},
		&resp,
	)
	if err != nil {
		return time.Time{}, err
	}

	return time.Parse(time.RFC3339, resp.User.CreatedAt)
}

func (s *Service) getYearContributions(ctx context.Context, username string, year int) (map[string]int, error) {
	query := `
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

	from := fmt.Sprintf("%d-01-01T00:00:00Z", year)
	to := fmt.Sprintf("%d-12-31T23:59:59Z", year)

	var resp struct {
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

	err := s.client.Query(
		ctx,
		query,
		map[string]interface{}{
			"login": username,
			"from":  from,
			"to":    to,
		},
		&resp,
	)
	if err != nil {
		return nil, err
	}

	contributions := make(map[string]int)
	for _, week := range resp.User.ContributionsCollection.ContributionCalendar.Weeks {
		for _, day := range week.ContributionDays {
			contributions[day.Date] = day.Count
		}
	}

	return contributions, nil
}

func (s *Service) convertToResponseDays(contributions map[string]int) []openapi.ContributionDay {
	var dates []string
	for date := range contributions {
		dates = append(dates, date)
	}
	sort.Strings(dates)

	days := make([]openapi.ContributionDay, 0, len(contributions))
	for _, date := range dates {
		parsedDate, err := time.Parse("2006-01-02", date)
		if err != nil {
			fmt.Printf("Error parsing date %s: %v\n", date, err)
			continue
		}

		days = append(days, openapi.ContributionDay{
			Date:  openapi_types.Date{Time: parsedDate},
			Count: contributions[date],
		})
	}

	return days
}
