class NotFoundError {
    statusCode = 404;
    message= 'Route not found.';
    serializeErrors() {
      return [{ message: this.message }];
    }
  }

module.exports= NotFoundError;