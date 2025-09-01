export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleApiError = (error: unknown): { error: string; statusCode: number } => {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
    }
  }

  return {
    error: "An unexpected error occurred",
    statusCode: 500,
  }
}

export const logError = (error: unknown, context?: string) => {
  const timestamp = new Date().toISOString()
  const contextStr = context ? `[${context}] ` : ""

  if (error instanceof Error) {
    console.error(`${timestamp} ${contextStr}Error: ${error.message}`)
    if (error.stack) {
      console.error(`Stack: ${error.stack}`)
    }
  } else {
    console.error(`${timestamp} ${contextStr}Unknown error:`, error)
  }
}
