class Helper {
  static sendError(message, errors = [], code = 401) {
    const response = { success: false, message: message };

    if (errors.length > 0) {
      response.data = errors;
    }

    // Create error object with status code
    const error = new Error(message);
    error.statusCode = code;
    error.response = response;
    
    // Throw the error
    throw error;
  }
}

export default Helper;