#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();
const FILE_PATH = path.join(process.cwd(), 'todos.json');

const readTodos = () => {
    try {
        if (!fs.existsSync(FILE_PATH)) return [];
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeTodos = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

program
  .name('todo-cli')
  .description('Todo მენეჯერი');

program
  .command('show')
  .description('ყველას ჩვენება')
  .action(() => {
    const todos = readTodos();
    if (todos.length === 0) {
        console.log(chalk.yellow('თუდუს სია ცარიელია.'));
        return;
    }
    console.log(chalk.blue.bold('\n--- ჩემი თუდუს სია ---'));
    console.log(todos);
  });


program
  .command('add')
  .argument('<todoName>', 'თუდუს სათაური')
  .description('ახალის დამატება')
  .action((todoName) => {
    const todos = readTodos();
    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        title: todoName,
        isDone: false
    };
    todos.push(newTodo);
    writeTodos(todos);
    console.log(chalk.green('წარმატებით შეიქმნა:'));
    console.log(newTodo);
  });

program
  .command('delete')
  .argument('<todoId>', 'თუდუს ID')
  .description('წაშლა ID-ით')
  .action((todoId) => {
    const id = parseInt(todoId);
    let todos = readTodos();
    const todoToDelete = todos.find(t => t.id === id);

    if (!todoToDelete) {
        console.log(chalk.red(`ID-ით ${id} ვერ მოიძებნა.`));
        return;
    }

    todos = todos.filter(t => t.id !== id);
    writeTodos(todos);
    console.log(chalk.red('წარმატებით წაიშალა:'));
    console.log(todoToDelete);
  });

program
  .command('update')
  .argument('<todoId>', 'თუდუს ID')
  .option('-n, --name <todoName>', 'ახალი სათაური')
  .option('-d, --done', 'მონიშნოს როგორც შესრულებული')
  .description(' განახლება სათაურით ან სტატუსით')
  .action((todoId, options) => {
    const id = parseInt(todoId);
    let todos = readTodos();
    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        console.log(chalk.red(`ID-ით ${id} ვერ მოიძებნა.`));
        return;
    }

    if (!options.name && !options.done) {
        console.log(chalk.yellow('ოფცია დასააფდეითებლად: --name ან --done'));
        return;
    }

    if (options.name) todos[todoIndex].title = options.name;
    if (options.done) todos[todoIndex].isDone = true;

    writeTodos(todos);
    console.log(chalk.cyan('წარმატებით განახლდა:'));
    console.log(todos[todoIndex]);
  });

program.parse(process.argv);