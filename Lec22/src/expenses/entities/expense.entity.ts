export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  UTILITIES = 'utilities',
  HEALTH = 'health',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  OTHER = 'other',
}

export class Expense {
  id: number;
  category: ExpenseCategory;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}
