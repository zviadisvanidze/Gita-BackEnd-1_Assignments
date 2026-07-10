

class Rectangle {
  constructor(public width: number, public height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Circle {
  constructor(public radius: number) {}

  calculateArea(): number {
    return Math.PI * Math.pow(this.radius, 2);
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}


function addNumbers(a: number, b: number): number {
  return a + b;
}

function multiplyNumbers(a: number, b: number): number {
  return a * b;
}

function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function filterEvenNumbers(numbers: number[]): number[] {
  return numbers.filter((num) => num % 2 === 0);
}

function findMax(numbers: number[]): number {
  return Math.max(...numbers);
}

function isPalindrome(str: string): boolean {
  const cleanStr = str.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  const reversedStr = cleanStr.split("").reverse().join("");
  return cleanStr === reversedStr;
}

function calculateFactorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * calculateFactorial(n - 1);
  }
}



const rectangle = new Rectangle(5, 8);
const circle = new Circle(3);

const rectangleArea = rectangle.calculateArea();
const rectanglePerimeter = rectangle.calculatePerimeter();

const circleArea = circle.calculateArea();
const circlePerimeter = circle.calculatePerimeter();

console.log(
  `Rectangle Area: ${rectangleArea}, Perimeter: ${rectanglePerimeter}`
);
console.log(`Circle Area: ${circleArea}, Perimeter: ${circlePerimeter}`);

const sumResult = addNumbers(5, 3);
const multiplicationResult = multiplyNumbers(4, 7);
const capitalizedString = capitalizeString("javascript is fun");
const evenNumbers = filterEvenNumbers([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(`Sum: ${sumResult}`);
console.log(`Multiplication: ${multiplicationResult}`);
console.log(`Capitalized String: ${capitalizedString}`);
console.log(`Even Numbers: ${evenNumbers}`);

const maxNumber = findMax([23, 56, 12, 89, 43]);
const isPalindromeResult = isPalindrome("A man, a plan, a canal, Panama");
const factorialResult = calculateFactorial(5);

console.log(`Max Number: ${maxNumber}`);
console.log(`Is Palindrome: ${isPalindromeResult}`);
console.log(`Factorial: ${factorialResult}`);


interface Transaction {
  type: string;
  amount: number;
  balanceAfter: number;
  date: Date;
}

interface AccountInfo {
  accountNumber: string;
  balance: number;
}

class BankAccount {
  private readonly accountNumber: string;
  private balance: number;
  private readonly transactionHistory: Transaction[] = [];

  constructor(accountNumber: string, initialBalance: number = 0) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.recordTransaction("Initial Balance", initialBalance);
  }

  getAccountInfo(): AccountInfo {
    return { accountNumber: this.accountNumber, balance: this.balance };
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
    this.recordTransaction("Deposit", amount);
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdraw amount must be positive");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    this.recordTransaction("Withdraw", -amount);
  }

  transferFunds(amount: number, targetAccount: BankAccount): void {
    if (amount <= 0) {
      throw new Error("Transfer amount must be positive");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds for transfer");
    }

    this.balance -= amount;
    this.recordTransaction(`Transfer to ${targetAccount.accountNumber}`, -amount);

    targetAccount.balance += amount;
    targetAccount.recordTransaction(`Transfer from ${this.accountNumber}`, amount);
  }

  getTransactionHistory(): Transaction[] {
    return [...this.transactionHistory];
  }

  private recordTransaction(type: string, amount: number): void {
    this.transactionHistory.push({
      type,
      amount,
      balanceAfter: this.balance,
      date: new Date(),
    });
  }
}



const account1 = new BankAccount("GE0001", 1000);
const account2 = new BankAccount("GE0002", 500);

account1.deposit(200);
account1.withdraw(150);
account2.deposit(300);
account1.transferFunds(400, account2);

console.log("Account 1 Info:", account1.getAccountInfo());
console.log("Account 2 Info:", account2.getAccountInfo());

console.log("Account 1 Transaction History:", account1.getTransactionHistory());
console.log("Account 2 Transaction History:", account2.getTransactionHistory());
