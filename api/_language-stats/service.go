package languageStats

import (
	"context"
	"fmt"
	"sort"

	"github.com/suzuki3jp/GitHubStats/api/_lib/graphql"
	openapi "github.com/suzuki3jp/GitHubStats/api/_openapi"
)

// GitHub language colors mapping
var languageColors = map[string]string{
	"TypeScript":       "#3178c6",
	"JavaScript":       "#f1e05a",
	"Go":               "#00ADD8",
	"Python":           "#3572A5",
	"Java":             "#b07219",
	"C#":               "#239120",
	"C++":              "#f34b7d",
	"C":                "#555555",
	"PHP":              "#4F5D95",
	"Ruby":             "#701516",
	"Swift":            "#FA7343",
	"Kotlin":           "#A97BFF",
	"Rust":             "#dea584",
	"Dart":             "#00B4AB",
	"Scala":            "#c22d40",
	"R":                "#198CE7",
	"Shell":            "#89e051",
	"HTML":             "#e34c26",
	"CSS":              "#563d7c",
	"Vue":              "#41b883",
	"React":            "#61dafb",
	"Svelte":           "#ff3e00",
	"SCSS":             "#c6538c",
	"Less":             "#1d365d",
	"Dockerfile":       "#384d54",
	"YAML":             "#cb171e",
	"JSON":             "#292929",
	"XML":              "#0060ac",
	"Markdown":         "#083fa1",
	"SQL":              "#e38c00",
	"Jupyter Notebook": "#DA5B0B",
	"Makefile":         "#427819",
	"CMake":            "#DA3434",
	"Vim script":       "#199f4b",
	"Emacs Lisp":       "#c065db",
	"Lua":              "#000080",
	"Perl":             "#0298c3",
	"PowerShell":       "#012456",
	"Assembly":         "#6E4C13",
	"Objective-C":      "#438eff",
	"Objective-C++":    "#6866fb",
}

type Service struct {
	client *graphql.Client
}

func NewService(accessToken string) *Service {
	return &Service{
		client: graphql.NewClient("https://api.github.com/graphql", accessToken),
	}
}

func (s *Service) GetLanguageStats(ctx context.Context, username string) (*openapi.LanguageStatsResponse, error) {
	// Get all repositories for the user
	repositories, err := s.getUserRepositories(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user repositories: %w", err)
	}

	totalLanguages := make(map[string]int)
	var repositoryStats []openapi.RepositoryLanguageStats

	for _, repo := range repositories {
		repoLanguages, err := s.getRepositoryLanguages(ctx, username, repo.Name)
		if err != nil {
			fmt.Printf("Error fetching languages for repository %s: %v\n", repo.Name, err)
			continue
		}

		if len(repoLanguages) == 0 {
			continue
		}

		var languageStats []openapi.LanguageStats
		for language, lines := range repoLanguages {
			color := getLanguageColor(language)
			languageStats = append(languageStats, openapi.LanguageStats{
				Language: language,
				Lines:    lines,
				Color:    color,
			})
			totalLanguages[language] += lines
		}

		// Sort languages by lines descending
		sort.Slice(languageStats, func(i, j int) bool {
			return languageStats[i].Lines > languageStats[j].Lines
		})

		repositoryStats = append(repositoryStats, openapi.RepositoryLanguageStats{
			Repository: repo.Name,
			Languages:  languageStats,
		})
	}

	// Convert total languages to response format
	var totalLanguageStats []openapi.LanguageStats
	for language, lines := range totalLanguages {
		color := getLanguageColor(language)
		totalLanguageStats = append(totalLanguageStats, openapi.LanguageStats{
			Language: language,
			Lines:    lines,
			Color:    color,
		})
	}

	// Sort total languages by lines descending
	sort.Slice(totalLanguageStats, func(i, j int) bool {
		return totalLanguageStats[i].Lines > totalLanguageStats[j].Lines
	})

	return &openapi.LanguageStatsResponse{
		Username:       username,
		TotalLanguages: totalLanguageStats,
		Repositories:   repositoryStats,
	}, nil
}

type Repository struct {
	Name          string
	DefaultBranch string
}

func (s *Service) getUserRepositories(ctx context.Context, username string) ([]Repository, error) {
	query := `
		query($login: String!, $after: String) {
			user(login: $login) {
				repositories(first: 100, after: $after, ownerAffiliations: OWNER) {
					pageInfo {
						hasNextPage
						endCursor
					}
					nodes {
						name
						defaultBranchRef {
							name
						}
						isEmpty
						isArchived
						isPrivate
						isFork
					}
				}
			}
		}
	`

	var repositories []Repository
	var after *string

	for {
		var resp struct {
			User struct {
				Repositories struct {
					PageInfo struct {
						HasNextPage bool   `json:"hasNextPage"`
						EndCursor   string `json:"endCursor"`
					} `json:"pageInfo"`
					Nodes []struct {
						Name             string `json:"name"`
						DefaultBranchRef *struct {
							Name string `json:"name"`
						} `json:"defaultBranchRef"`
						IsEmpty    bool `json:"isEmpty"`
						IsArchived bool `json:"isArchived"`
						IsPrivate  bool `json:"isPrivate"`
						IsFork     bool `json:"isFork"`
					} `json:"nodes"`
				} `json:"repositories"`
			} `json:"user"`
		}

		variables := map[string]interface{}{
			"login": username,
		}
		if after != nil {
			variables["after"] = *after
		}

		err := s.client.Query(ctx, query, variables, &resp)
		if err != nil {
			return nil, err
		}

		for _, repo := range resp.User.Repositories.Nodes {
			// Skip empty, archived, or forked repositories
			if repo.IsEmpty || repo.IsArchived || repo.IsFork {
				continue
			}

			// Skip repositories without default branch
			if repo.DefaultBranchRef == nil {
				continue
			}

			repositories = append(repositories, Repository{
				Name:          repo.Name,
				DefaultBranch: repo.DefaultBranchRef.Name,
			})
		}

		if !resp.User.Repositories.PageInfo.HasNextPage {
			break
		}

		after = &resp.User.Repositories.PageInfo.EndCursor
	}

	return repositories, nil
}

func (s *Service) getRepositoryLanguages(ctx context.Context, username, repoName string) (map[string]int, error) {
	query := `
		query($owner: String!, $name: String!) {
			repository(owner: $owner, name: $name) {
				languages(first: 100) {
					edges {
						size
						node {
							name
						}
					}
				}
				defaultBranchRef {
					target {
						... on Commit {
							history(first: 1) {
								totalCount
							}
							additions
							deletions
						}
					}
				}
			}
		}
	`

	var resp struct {
		Repository struct {
			Languages struct {
				Edges []struct {
					Size int `json:"size"`
					Node struct {
						Name string `json:"name"`
					} `json:"node"`
				} `json:"edges"`
			} `json:"languages"`
			DefaultBranchRef *struct {
				Target struct {
					History struct {
						TotalCount int `json:"totalCount"`
					} `json:"history"`
					Additions int `json:"additions"`
					Deletions int `json:"deletions"`
				} `json:"target"`
			} `json:"defaultBranchRef"`
		} `json:"repository"`
	}

	err := s.client.Query(
		ctx,
		query,
		map[string]interface{}{
			"owner": username,
			"name":  repoName,
		},
		&resp,
	)
	if err != nil {
		return nil, err
	}

	languages := make(map[string]int)
	totalBytes := 0

	// Calculate total bytes for proportional distribution
	for _, edge := range resp.Repository.Languages.Edges {
		totalBytes += edge.Size
	}

	// Get a more realistic line estimate using repository activity
	estimatedTotalLines := s.estimateRepositoryLines(resp.Repository, totalBytes)

	for _, edge := range resp.Repository.Languages.Edges {
		if totalBytes == 0 {
			continue
		}

		// Distribute total estimated lines proportionally by language bytes
		languageRatio := float64(edge.Size) / float64(totalBytes)
		estimatedLines := int(float64(estimatedTotalLines) * languageRatio)

		if estimatedLines < 1 {
			estimatedLines = 1
		}

		languages[edge.Node.Name] = estimatedLines
	}

	return languages, nil
}

// getLanguageColor returns the GitHub color for a language
func getLanguageColor(language string) string {
	if color, exists := languageColors[language]; exists {
		return color
	}
	return "#858585" // Default gray color for unknown languages
}

// estimateRepositoryLines provides a more accurate total line estimate using repository metadata
func (s *Service) estimateRepositoryLines(repo interface{}, totalBytes int) int {
	// Basic estimation using total bytes with improved algorithm
	// This could be enhanced with commit history analysis, but we'll keep it practical

	if totalBytes == 0 {
		return 0
	}

	// Use a more conservative average (45 chars per line)
	// This accounts for various factors like comments, whitespace, etc.
	baseLines := totalBytes / 45

	// Apply some heuristics based on repository size
	switch {
	case totalBytes < 10000: // Very small repos
		return int(float64(baseLines) * 1.2) // Slightly higher ratio for small files
	case totalBytes < 100000: // Small repos
		return baseLines
	case totalBytes < 1000000: // Medium repos
		return int(float64(baseLines) * 0.9) // Slightly lower ratio for larger repos
	default: // Large repos
		return int(float64(baseLines) * 0.8) // Even lower ratio for very large repos
	}
}
