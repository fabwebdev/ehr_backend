class Handler {
  constructor() {
    /**
     * A list of the exception types that are not reported.
     *
     * @var {Array}
     */
    this.dontReport = [
      //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var {Array}
     */
    this.dontFlash = [
      'current_password',
      'password',
      'password_confirmation',
    ];
  }

  /**
   * Report or log an exception.
   * @param {Error} error
   */
  report(error) {
    // Log the error with full details
    console.error("🔴 Exception Handler - Error Report:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    // In a production environment, you might want to send this to a logging service
    // For example: Sentry, Loggly, etc.
  }

  /**
   * Render an exception into an HTTP response.
   * @param {Object} request
   * @param {Object} reply
   * @param {Error} error
   */
  render(request, reply, error) {
    // Default error response
    const status = error.status || error.statusCode || error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    // Report the error with full details
    console.error("🔴 Global Error Handler - Full error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      status: status,
      path: request.url,
      method: request.method,
    });

    // Report the error
    this.report(error);

    // Send JSON response with more details
    const response = {
      status: status,
      message: message,
    };

    // Always include error details if available (even in production for debugging)
    if (error.code) response.code = error.code;
    if (error.detail) response.detail = error.detail;
    if (error.hint) response.hint = error.hint;
    
    // Include stack trace in development or if explicitly requested
    if (process.env.NODE_ENV === "development" || process.env.SHOW_ERROR_STACK === "true") {
      response.stack = error.stack;
    }

    return reply.code(status).send(response);
  }

  /**
   * Register the exception handling callbacks for the application.
   * @param {Function} callback
   */
  reportable(callback) {
    // Register a callback for reporting exceptions
    this.reportCallback = callback;
  }

  /**
   * Render an exception for console command errors.
   * @param {Error} error
   */
  renderForConsole(error) {
    console.error("Console command error:", error.message);
  }
}

export default new Handler();
