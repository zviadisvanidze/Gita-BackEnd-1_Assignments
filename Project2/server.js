const express = require('express');
const path = require('path');

const expensesApiRouter = require('./features/expenses/expenses.routes');
const expensesPagesRouter = require('./features/expenses/expenses.pages.routes');

const app = express();
const PORT = 3030;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/expenses', expensesApiRouter);
app.use('/', expensesPagesRouter);

app.listen(PORT, () => {
    console.log(`სერვერი ჩაირთო პორტზე: http://localhost:${PORT}`);
});
