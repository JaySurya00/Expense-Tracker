# Daily Expenses Sharing Application

This application helps users to manage shared expenses efficiently. It allows users to split expenses using various methods and manage balances between friends.

## Tech Stack
- **Backend**: Express.js
- **Database**: MongoDB

## Key Features
1. **User Management**:
   - User Signup and Signin
   - Authentication and Authorization

2. **Expense Management**:
   - Add expenses and split them with friends
   - Supported split types: `equal`, `exact`, and `percentage`
   - Detailed expense tracking

3. **Input Validation**: 
   - All endpoints validate input data for consistency and correctness

4. **Robust Error Handling**: 
   - The API handles errors gracefully, providing useful feedback

## API Endpoints

### User Endpoints:
- **POST /api/signup**
  - Registers a new user.
  - **Request Body (JSON)**:
    ```json
    {
      "name": "your name",
      "mobileNumber": "your mobile number",
      "email": "your email address",
      "password": "your password"
    }
    ```

- **POST /api/signin**
  - Logs in a user and returns authentication credentials.
  - **Request Body (JSON)**:
    ```json
    {
      "email": "your email address",
      "password": "your password"
    }
    ```

- **GET /api/users**
  - Retrieves the currently signed-in user's information.

### Expense Endpoints:
- **POST /api/expenses**
  - Adds an expense and splits it among participants.
  - **Request Body (JSON)**:
    ```json
    {
      "amount": "amount value",
      "splitType": "exact/equal/percentage",
      "participants": [
        {
          "email": "participant's email",
          "amount": amount owed (only for exact split type),
          "percentage": percentage owed (only for percentage split type)
        }
      ]
    }
    ```

- **GET /api/expenses**
  - Retrieves individual user expenses.

- **GET /api/expenses/overall**
  - Retrieves overall expenses for all users.

- **GET /api/expenses/balance-sheet**
  - Downloads the balance sheet.

## Project Setup

1. Clone the repository from GitHub:
   - [GitHub Repository](https://github.com/JaySurya00/Expense-Tracker)

2. Install the required dependencies:
   - Navigate to the project directory and run:
     ```bash
     npm install
     ```

3. Set up the `.env` file with the appropriate environment variables.

4. Start the application:
   - Run the following command:
     ```bash
     npm start
     ```

## Contact
For any issues or inquiries, please reach out to the project maintainer: Jay Surya.
