const { Parser } = require('json2csv');

exports.generateBalanceSheetCSV = (expenses) => {
    const fields = [
        { label: 'Expense Amount', value: 'amount' },
        { label: 'Split Type', value: 'splitType' },
        { label: 'Participants', value: 'participants' }
    ];


    const data = expenses.map(expense => ({
        amount: expense.amount,
        splitType: expense.splitType,
        participants: expense.participants.map(participant => 
            `${participant.email} owes ${participant.amountOwed}`).join('; ')
    }));

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    return csv;
};
