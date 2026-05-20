// 1) დაწერეთ ფუნცქია რომელსაც გადაეცემა 2 პარამეტრი, 1 - ობიექტი,
//    2- ფროფერთი რომელიც გინდათ რომ წაშალოს, ეს ფუნქცია დააბრუნებს 
//    ობიექტს რომელშიც წაშლილი იქნება ის ფროფერთი რასაც გადასცემთ.
const userObj = { 
    id: 1, 
    name: "Ana", 
    age: 25, 
    role: "Admin" 
};
function removeProperty(obj, ToRemove) {
    const { [ToRemove]: deleted, ...rest } = obj;
    return rest;
}
console.log(removeProperty(userObj, "age")); 

// 2) მოცემული გაქვთ მასივი  [
//   { name: "Ana", score: 50 },
//   { name: "Nika", score: 80 },
//   { name: "Luka", score: 70 }
// ] თქვენი მიზანია დაწეროთ ფუნცქია რომელიც არგუმენტად მიიღებს ამ მასივს და დააბრუნებს ლიდერბორდს ქულების მიხედვით. შედეგი: [
//   { name: 'Nika', score: 80, rank: 1 },
//   { name: 'Luka', score: 70, rank: 2 },
//   { name: 'Ana',  score: 50, rank: 3 }
// ]
const students = [
    { name: "Ana", score: 50 },
    { name: "Nika", score: 80 },
    { name: "Luka", score: 70 }
];

function createLeaderboard(users) {
    return users
        .sort((a, b) => b.score - a.score)
        .map((student, index) => ({
            ...student,
            rank: index + 1
        }));
}
console.log(createLeaderboard(students));

// 3) დაწერეთ ფუნცქია რომელიც დააბრუნებს მხოლოდ იმ ობიექტს რომლის სათაურიც ყველაზე გრძელია. მაგ: [
//   { title: "Up", year: 2009 }, { title: "The Lord of the Rings", year: 2001 }
// ] =>   { title: "The Lord of the Rings", year: 2001 }
const titles = [ { title: "Up", year: 2009 }, { title: "The Lord of the Rings", year: 2001 }] 

function getLongestTitle(items) {
    return items.reduce((longest, current) => 
        current.title.length > longest.title.length ? current : longest
    );
}
console.log(getLongestTitle(titles));

// 4) დაწერეთ ფუნქცია რომელიც გამოითვლის საშუალო ასაკს თითოეულ დეპარტამენტის და დააბრუნებს შესაბამის ობიექტს. მაგ: [
//   { name: "Ana", dept: "HR", age: 25 },
//   { name: "Nika", dept: "IT", age: 30 },
//   { name: "Luka", dept: "IT", age: 22 }
// ]. => { HR: 25, IT: 26 }

const employees = [
    { name: "Ana", dept: "HR", age: 25 },
    { name: "Nika", dept: "IT", age: 30 },
    { name: "Luka", dept: "IT", age: 22 }
];

function getAverageAgeByDept(employees) {
    const deptData = employees.reduce((acc, { dept, age }) => {
        if (!acc[dept]) acc[dept] = { totalAge: 0, count: 0 };
        acc[dept].totalAge += age;
        acc[dept].count += 1;
        return acc;
    }, {});

    const result = {};
    for (const dept in deptData) {
        result[dept] = deptData[dept].totalAge / deptData[dept].count;
    }
    return result;
}
console.log(getAverageAgeByDept(employees));

// 5) დაწერეთ ფუნქცია რომელიც პარამეტრად მიიღებს კომენტარების მასივს და დააბრუნებს სიტყვების რაოდენობას მაგ: [
//   { id:1, comment:"Hello world" }, 
//   { id:2, comment:"This is great!" },
//   { id:3, comment:"" }
// ] => 5 ანუ შეკრიბა ყველა კომენტარის სიტყვების რაოდენობა

const comments = [
    { id: 1, comment: "Hello world" },
    { id: 2, comment: "This is great!" },
    { id: 3, comment: "" }
];

function countTotalWords(comments) {
    return comments.reduce((total, c) => {
        const words = c.comment.trim() ? c.comment.trim().split(/\s+/).length : 0;
        return total + words;
    }, 0);  
}
console.log(countTotalWords(comments));

// 6) დაწერეთ ფუნქცია, რომელიც users-ს დააჯგუფებს department-ის მიხედვით. თითოეულ ჯგუფში users უნდა დალაგდეს salary-ის კლებადობით.
// [
//   { name: "Ana", department: "HR", salary: 2000 },
//   { name: "Nika", department: "IT", salary: 5000 },
//   { name: "Luka", department: "IT", salary: 3500 },
//   { name: "Mariam", department: "HR", salary: 3000 }
// ] შედეგი {
//   HR: [
//     { name: "Mariam", department: "HR", salary: 3000 },
//     { name: "Ana", department: "HR", salary: 2000 }
//   ],
//   IT: [
//     { name: "Nika", department: "IT", salary: 5000 },
//     { name: "Luka", department: "IT", salary: 3500 }
//   ]
// }
const departments =  [
  { name: "Ana", department: "HR", salary: 2000 },
  { name: "Nika", department: "IT", salary: 5000 },
  { name: "Luka", department: "IT", salary: 3500 },
  { name: "Mariam", department: "HR", salary: 3000 }
]

function groupAndSortUsers(users) {
    const grouped = users.reduce((acc, user) => {
        if (!acc[user.department]) acc[user.department] = [];
        acc[user.department].push(user);
        return acc;
    }, {});

    for (const dept in grouped) {
        grouped[dept].sort((a, b) => b.salary - a.salary);
    }
    return grouped;
}

console.log(groupAndSortUsers(departments));

// 7) დაწერეთ ფუნქცია, რომელიც მიიღებს cart მასივს და დააბრუნებს საბოლოო ფასს.
// [
//   { title: "Laptop", price: 2000, quantity: 1, discountPercent: 10 },
//   { title: "Mouse", price: 50, quantity: 2, discountPercent: 0 },
//   { title: "Keyboard", price: 100, quantity: 1, discountPercent: 20 }
// ] შედეგი: 1980

const cart = [  
    { title: "Laptop", price: 2000, quantity: 1, discountPercent: 10 },
    { title: "Mouse", price: 50, quantity: 2, discountPercent: 0 },
    { title: "Keyboard", price: 100, quantity: 1, discountPercent: 20 }
];

function calculateCartTotal(cart) {
    return cart.reduce((total, item) => {
        const itemTotal = item.price * item.quantity;
        const discount = itemTotal * (item.discountPercent / 100);
        return total + (itemTotal - discount);
    }, 0);
}

console.log(calculateCartTotal(cart));

// 8) დაწერეთ ფუნქცია, რომელიც users მასივს გადააქცევს ობიექტად.
// [
//   { id: 1, name: "Ana", age: 25 },
//   { id: 2, name: "Nika", age: 30 },
//   { id: 3, name: "Luka", age: 22 }
// ]
// შედეგი: 
// {
//   1: { id: 1, name: "Ana", age: 25 },
//   2: { id: 2, name: "Nika", age: 30 },
//   3: { id: 3, name: "Luka", age: 22 }
// }

const allusers = [
    { id: 1, name: "Ana", age: 25 },
    { id: 2, name: "Nika", age: 30 },
    { id: 3, name: "Luka", age: 22 }
];  
function massToObject(users) {
    return users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});
}

console.log(massToObject(allusers));