const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount must be a positive number']
  },
  splitType: { 
    type: String, 
    enum: ['equal', 'exact', 'percentage'], 
    required: true 
  },
  participants: [{
    email: { 
      type: String, 
      ref: 'User', 
      required: true 
    },
    amountOwed: { 
      type: Number, 
      min: [0, 'Amount owed must be a positive number']
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Expense= mongoose.model('Expense', expenseSchema);


module.exports = Expense;
