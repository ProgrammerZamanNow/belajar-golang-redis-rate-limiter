package util

import (
	"context"
	"fmt"
	"golang-clean-architecture/internal/model"
	"time"

	"github.com/redis/go-redis/v9"
)

type RateLimiterUtil struct {
	Redis      *redis.Client
	MaxRequest int64
	Duration   time.Duration
}

func NewRateLimiterUtil(redis *redis.Client) *RateLimiterUtil {
	return &RateLimiterUtil{
		Redis:      redis,
		MaxRequest: 1,
		Duration:   time.Second * 1,
	}
}

func (u RateLimiterUtil) IsAllowed(ctx context.Context, auth *model.Auth) bool {
	key := auth.ID

	increment, err := u.Redis.Incr(ctx, key).Result()
	if err != nil {
		fmt.Println("Error incrementing:", err)
		return false
	}

	if increment == 1 {
		err := u.Redis.Expire(ctx, key, u.Duration).Err()
		if err != nil {
			fmt.Println("Error setting expiration:", err)
			return false
		}
	}

	return increment <= u.MaxRequest
}
