class DatabaseConnectionError {
    statusCode = 500;
    message = 'Error connecting to database';
    serializeErrors() {
        return [{ message: this.message }];
    }
}

module.exports = DatabaseConnectionError;