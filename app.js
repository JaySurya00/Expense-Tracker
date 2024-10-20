const express= require('express');
const userRouter= require('./routes/user-routes.js');
const expenseRouter= require('./routes/expense-routes.js');
const NotFoundError= require('./errors/not-found-error.js');
const errorHandler= require('./middlewares/error-handler.js');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.json());
app.use(
    cookieSession({
      signed: false,
    })
  );

app.use('/', userRouter);
app.use('/', expenseRouter);
app.use('*', (req, res)=>{
    throw new NotFoundError();
})

app.use(errorHandler);

module.exports=app;