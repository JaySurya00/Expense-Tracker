class NotAuthorizedError {
    statusCode = 401;
    message= 'Not Authorized';
    serializeErrors() {
      return [{ message: this.message }];
    }
  }

module.exports= NotAuthorizedError;