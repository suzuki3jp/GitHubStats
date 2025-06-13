package handler

import "testing"

func Sum(a, b int) int {
	return a + b
}

func TestSum(t *testing.T) {
	tests := []struct {
		name string
		a, b int
		want int
	}{
		{"Add positive numbers", 1, 2, 3},
		{"Add negative numbers", -1, -2, -3},
		{"Add mixed numbers", -1, 1, 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Sum(tt.a, tt.b); got != tt.want {
				t.Errorf("Sum(%d, %d) = %d; want %d", tt.a, tt.b, got, tt.want)
			}
		})
	}
}
