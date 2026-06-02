class Todo {
    constructor(id, title, isDone) {
        this.id = id;
        this.title = title;
        this.isDone = isDone || false;
        this.createdAt = new Date();
    }
}

class TodoList {
    constructor() {
        this.todos = [];
    }
    AllTodos() {       
     return this.todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(id) {
        let index = -1;
        for (let i = 0; i < this.todos.length; i++) {
            if (this.todos[i].id === id) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }

    checkActiveTodo(id) {
        for (let i = 0; i < this.todos.length; i++) {
            if (this.todos[i].id === id) {
                this.todos[i].isDone = !this.todos[i].isDone;
                break;
            }
        }
    }
    
    getAllTodos(options) {
        if (!options) {
            return this.todos;
        }

        let result = [];
        for (let i = 0; i < this.todos.length; i++) {
            if (options.active === true && !this.todos[i].isDone) {
                result.push(this.todos[i]);
            }
            else if (options.active === false && this.todos[i].isDone) {
                result.push(this.todos[i]);
            }
        }
        return result;
    }
  
}
console.log('Todo.js loaded');

const todoList = new TodoList();

const todo1 = new Todo(1, 'Todo 1', false);
const todo2 = new Todo(2, 'Todo 2', false);
const todo3 = new Todo(3, 'Todo 3', false);
const todo4 = new Todo(4, 'Todo 4', false);
const todo5 = new Todo(5, 'Todo 5', false);
  todoList.addTodo(todo1);
  todoList.addTodo(todo2);
  todoList.addTodo(todo3);
  todoList.addTodo(todo4);
  todoList.addTodo(todo5);

console.log(todoList.AllTodos());


  todoList.deleteTodo(5);

  todoList.checkActiveTodo(2);
  todoList.checkActiveTodo(4);

  console.log('ყველა დავალება ********************************');
  console.log(todoList.getAllTodos({active: 'all'}));
  console.log('აქტიური დავალებები ********************************');
  console.log(todoList.getAllTodos({active: true}));
  console.log('დასრულებული დავალებები ********************************');
  console.log(todoList.getAllTodos({active: false}));



