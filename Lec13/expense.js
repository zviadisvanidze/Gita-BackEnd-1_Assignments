#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readExpenses, writeExpenses } from './util/db.js';

const program = new Command();

program
  .name('expense-cli')
  .description('ხარჯების აღრიცხვის CLI სისტემა');

// 1. დამატება + ვალიდაცია
program
  .command('add')
  .argument('<category>', 'ხარჯის კატეგორია')
  .argument('<price>', 'ხარჯის თანხა')
  .option('-d, --description <text>', 'ხარჯის მოკლე აღწერა')
  .description('ახალი ხარჯის დამატება')
  .action((category, price, options) => {
    const amount = parseFloat(price);

    if (amount < 10) {
        console.log(chalk.red('error: ხარჯის თანხა უნდა იყოს რიცხვი და არ უნდა იყოს 10-ზე ნაკლები!'));
        return;
    }

    const expenses = readExpenses();
    const newExpense = {
        id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
        category: category.toLowerCase(),
        price: amount,
        description: options.description || '',
        createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    writeExpenses(expenses);

    console.log(chalk.green('ხარჯი წარმატებით დაემატა:'));
    console.log(newExpense);
  });

// 2. ყველა ხარჯის ნახვა + სორტირება + ფილტრაცია + ფეჯინეიშენი
program
  .command('show')
  .description('ხარჯების სიის ნახვა ფილტრებით')
  .option('--asc', 'სორტირება თარიღით: ძველიდან ახლისკენ')
  .option('--desc', 'სორტირება თარიღით: ახლიდან ძველისკენ')
  .option('-c, --category <type>', 'ფილტრაცია კატეგორიის მიხედვით')
  .option('-p, --page <number>', 'გვერდის ნომერი ფეჯინეიშენისთვის', '1')
  .option('-l, --limit <number>', 'ხარჯების რაოდენობა გვერდზე', '5')
  .action((options) => {
    let expenses = readExpenses();

    if (expenses.length === 0) {
        console.log(chalk.yellow('ხარჯების სია ცარიელია.'));
        return;
    }

    if (options.category) {
        expenses = expenses.filter(e => e.category === options.category.toLowerCase());
    }

    if (options.asc) {
        expenses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (options.desc) {
        expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const page = parseInt(options.page);
    const limit = parseInt(options.limit);
    const totalItems = expenses.length;
    const totalPages = Math.ceil(totalItems / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    expenses = expenses.slice(startIndex, endIndex);

    console.log(chalk.blue.bold(`\n--- ხარჯების სია (გვერდი ${page}/${totalPages || 1}) ---`));
    console.log(expenses);
    console.log(chalk.gray(`სულ ნაპოვნია ${totalItems} ჩანაწერი.`));
  });

// 3. GET BY ID
program
  .command('getById')
  .argument('<id>', 'ხარჯის ID')
  .description('კონკრეტული ხარჯის ნახვა ID-ით')
  .action((id) => {
    const expenseId = parseInt(id);
    const expenses = readExpenses();
    const expense = expenses.find(e => e.id === expenseId);

    if (!expense) {
        console.log(chalk.red(`ხარჯი ID-ით ${expenseId} ვერ მოიძებნა.`));
        return;
    }

    console.log(chalk.cyan(`ნაპოვნია ხარჯი:`));
    console.log(expense);
  });

// 4. განახლება
program
  .command('update')
  .argument('<id>', 'ხარჯის ID')
  .option('-c, --category <type>', 'ახალი კატეგორია')
  .option('-p, --price <amount>', 'ახალი თანხა')
  .option('-d, --description <text>', 'ახალი აღწერა')
  .description('ხარჯის განახლება ID-ით')
  .action((id, options) => {
    const expenseId = parseInt(id);
    let expenses = readExpenses();
    const index = expenses.findIndex(e => e.id === expenseId);

    if (index === -1) {
        console.log(chalk.red(`ხარჯი ID-ით ${expenseId} ვერ მოიძებნა.`));
        return;
    }

    if (!options.category && !options.price && !options.description) {
        console.log(chalk.yellow('მიუთითეთ მინიმუმ ერთი ოფცია განასახლებლად: --category, --price ან --description'));
        return;
    }

    if (options.price) {
        const amount = parseFloat(options.price);
        if (amount < 10) {
            console.log(chalk.red('შეცდომა: განახლებული თანხა არ უნდა იყოს 10-ზე ნაკლები!'));
            return;
        }
        expenses[index].price = amount;
    }

    if (options.category) expenses[index].category = options.category.toLowerCase();
    if (options.description) expenses[index].description = options.description;

    writeExpenses(expenses);
    console.log(chalk.green('ხარჯი წარმატებით განახლდა:'));
    console.log(expenses[index]);
  });

// 5. წაშლა
program
  .command('delete')
  .argument('<id>', 'ხარჯის ID')
  .description('ხარჯის წაშლა ID-ით')
  .action((id) => {
    const expenseId = parseInt(id);
    let expenses = readExpenses();
    const expenseToDelete = expenses.find(e => e.id === expenseId);

    if (!expenseToDelete) {
        console.log(chalk.red(`ხარჯი ID-ით ${expenseId} ვერ მოიძებნა.`));
        return;
    }

    expenses = expenses.filter(e => e.id !== expenseId);
    writeExpenses(expenses);

    console.log(chalk.red('ხარჯი წარმატებით წაიშალა:'));
    console.log(expenseToDelete);
  });

// 6. ძებნა თარიღით
program
  .command('search')
  .argument('<date>', 'თარიღი YYYY-MM-DD')
  .description('ხარჯების ძებნა კონკრეტული დღის მიხედვით')
  .action((dateString) => {
    const expenses = readExpenses();
    const filteredExpenses = expenses.filter(e => e.createdAt.startsWith(dateString));

    if (filteredExpenses.length === 0) {
        console.log(chalk.yellow(`თარიღით [${dateString}] ხარჯები ვერ მოიძებნა.`));
        return;
    }

    console.log(chalk.magenta.bold(`\n ხარჯები თარიღისთვის: ${dateString}`));
    console.log(filteredExpenses);
  });

program.parse(process.argv);