package middleware

import (
	"golang-clean-architecture/internal/model"
	"golang-clean-architecture/internal/usecase"
	"golang-clean-architecture/internal/util"

	"github.com/gofiber/fiber/v2"
)

func NewAuth(userUserCase *usecase.UserUseCase, rateLimiterUtil *util.RateLimiterUtil) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		request := &model.VerifyUserRequest{Token: ctx.Get("Authorization", "NOT_FOUND")}
		userUserCase.Log.Debugf("Authorization : %s", request.Token)

		auth, err := userUserCase.Verify(ctx.UserContext(), request)
		if err != nil {
			userUserCase.Log.Warnf("Failed find user by token : %+v", err)
			return fiber.ErrUnauthorized
		}

		if !rateLimiterUtil.IsAllowed(ctx.UserContext(), auth) {
			userUserCase.Log.Warnf("User is not allowed because too many request : %+v", err)
			return fiber.ErrTooManyRequests
		}

		userUserCase.Log.Debugf("User : %+v", auth.ID)
		ctx.Locals("auth", auth)
		return ctx.Next()
	}
}

func GetUser(ctx *fiber.Ctx) *model.Auth {
	return ctx.Locals("auth").(*model.Auth)
}
