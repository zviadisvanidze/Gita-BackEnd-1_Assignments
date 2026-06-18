const express = require('express');
const session = require('express-session');
const { default: MongoStore } = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'Front')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/pots', require('./routes/pots'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/overview', require('./routes/overview'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`სერვერი გაშვებულია პორტზე ${PORT}`);
});
