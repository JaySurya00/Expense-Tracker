const express = require('express');
const router = express.Router();
const validateRequest = require('../middlewares/validate-request.js');
const { body, check } = require('express-validator');
const { authUser }= require('../middlewares/validate-auth.js');
const User = require('../models/user-model.js');
const Expense = require('../models/expense-model.js');
const BadRequestError = require('../errors/bad-request-error.js')

router.post('/api/expenses',
    [
        body('amount')
            .isFloat({ min: 0 })
            .withMessage('Amount must be a positive number'),

        body('splitType')
            .isIn(['equal', 'exact', 'percentage'])
            .withMessage('Split type must be either equal, exact, or percentage'),

        body('participants')
            .isArray({ min: 1 })
            .withMessage('Participants should be a non-empty array'),

        body('participants.*.email')
            .isEmail()
            .withMessage('Each participant must have a valid email'),

        // Validate amount for 'exact' split type
        check('participants.*.amount')
            .custom((value, { req }) => {
                if (req.body.splitType === 'exact' && (value == null || parseFloat(value) < 0)) {
                    throw new Error('Amount should be positive and must be provided for exact split');
                }
                return true;
            }),

        // Validate percentage for 'percentage' split type
        check('participants.*.percentage')
            .custom((value, { req }) => {
                if (req.body.splitType === 'percentage' && value == null) {
                    throw new Error('Percentage must be provided for percentage split');
                }
                return true;
            }),

        // Check if total percentage equals 100 for 'percentage' split type
        check('participants')
            .custom((participants, { req }) => {
                if (req.body.splitType === 'percentage') {
                    const totalPercentage = participants.reduce((sum, participant) => sum + (parseFloat(participant.percentage) || 0), 0);
                    if (totalPercentage !== 100) {
                        throw new Error('The total percentage for all participants must equal 100');
                    }
                }
                return true;
            }),

        // Check if total amount equals the expense amount for 'exact' split type
        check('participants')
            .custom((participants, { req }) => {
                if (req.body.splitType === 'exact') {
                    const expenseAmount = parseFloat(req.body.amount);
                    const totalAmount = participants.reduce((sum, participant) => sum + (parseFloat(participant.amount) || 0), 0);
                    if (totalAmount !== expenseAmount) {
                        throw new Error('The total amount for all participants must equal the expense amount');
                    }
                }
                return true;
            })
    ],
    authUser, validateRequest, async (req, res, next) => {
        try {
            const { amount, splitType, participants } = req.body;

            for (const participant of participants) {
                const userExists = await User.findOne({ email: participant.email });
                if (!userExists) {
                    return next(new BadRequestError(`${participant.email} cannot be found in database`));
                }
            }

            const expenseData = {
                amount,
                splitType,
                participants: []
            };

            // Handle different split types
            if (splitType === 'equal') {
                const equalAmount = (amount / participants.length).toFixed(2);
                participants.forEach(participant => {
                    expenseData.participants.push({
                        email: participant.email,
                        amountOwed: parseFloat(equalAmount)
                    });
                });
            }

            else if (splitType === 'exact') {
                participants.forEach(participant => {
                    expenseData.participants.push({
                        amountOwed: participant.amount,
                        email: participant.email
                    });
                });
            }

            else if (splitType === 'percentage') {
                participants.forEach(participant => {
                    const amountOwed = (amount * (participant.percentage / 100)).toFixed(2);
                    expenseData.participants.push({
                        amountOwed: parseFloat(amountOwed),
                        email: participant.email
                    });
                });
            }

            // Create a new expense
            const newExpense = new Expense(expenseData);
            await newExpense.save();

            res.status(201).send(newExpense);
        } catch (error) {
            console.error(error);
            res.status(500).send('Something went wrong :(');
        }
    }
);



// Retrieve expenses for a specific user
router.get('/api/expenses',authUser, async (req, res) => {
    try {
        const id= req.userId

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Retrieve all expenses where this user is a participant
        const expenses = await Expense.find({ 'participants.email': user.email });

        // If no expenses are found for the user
        if (expenses.length === 0) {
            return res.status(404).send('No expenses found for this user');
        }
        const results = expenses.map(expense => {
            const participant = expense.participants.find(p => p.email === user.email);
            return {
                user: user.name,
                amountOwed: participant ? participant.amountOwed : null,
                createdAt: expense.createdAt
            };
        });


        res.status(200).send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



// Retrieve all expenses (overall expenses)
router.get('/api/expenses', async (req, res) => {
    try {
        // Retrieve all expenses from the database
        const expenses = await Expense.find();

        // If no expenses are found
        if (expenses.length === 0) {
            return res.status(404).send('No expenses found');
        }

        // Send the expenses back to the client
        res.status(200).send(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});




const { generateBalanceSheetCSV } = require('../utils/balance-sheet.js');

// Download balance sheet as CSV
router.get('/api/expenses/download/balance-sheet', async (req, res) => {
    try {
        // Fetch all expenses from the database
        const expenses = await Expense.find();

        // If no expenses found
        if (!expenses || expenses.length === 0) {
            return res.status(404).send('No expenses found to generate a balance sheet');
        }

        // Generate the balance sheet in CSV format
        const csvContent = generateBalanceSheetCSV(expenses);

        // Set headers to trigger file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=balance_sheet.csv');

        // Send the CSV content as response
        res.status(200).send(csvContent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating balance sheet');
    }
});



module.exports = router;
