const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');
const expensesRouter = require('./features/expenses/expenses.routes');
const randomFactRouter = require('./features/random-fact/randomFact.routes');

const app = express();
const PORT = 3030;

app.use(express.json());

app.use('/expenses', expensesRouter);
app.use('/random-fact', randomFactRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`სერვერი ჩაირთო პორტზე: http://localhost:${PORT}`);
    });
});
