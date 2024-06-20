import jwt from "jsonwebtoken"
import { createError, defineEventHandler, sendError } from "h3"

export default defineEventHandler((event) => {
  if ((/^\/api(\/(?!login|register|forgotPassword|mailVerify|fetch\?type=mailIsVerified).*)?$/).test(event.node.req.url)) {
    const authHeader = event.node.req.headers.authorization

    if (!authHeader) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized"
      }))
    }

    const token = authHeader.split(" ")[1]

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)

      event.context.auth = { userId: payload.id }
    } catch {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized"
      }))
    }
  }
})
