// DRY - Centralized error handling
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'UNKNOWN_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message);
    }

    return new AppError('An unknown error occurred');
  }

  static logError(error: AppError, context?: string): void {
    console.error(`[${context || 'ERROR'}] ${error.code}: ${error.message}`);
  }
}
