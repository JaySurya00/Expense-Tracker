
class RequestValidationError{
  statusCode = 400;

  constructor( errors ) {
    this.errors=errors;
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}

module.exports= RequestValidationError;