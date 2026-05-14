// 1) წაშალეთ მასივის თითოეულ ელემენტს წაუშლის ბოლო სიმბოლოს 
// მაგ: ["one","two","three"] => ["on","tw","thre"]
const arr1 = ["one", "two", "three"];
const result1 = arr1.map(word => word.slice(0, -1));
console.log("დავალება 1:", result1); 


// 2) იპოვეთ მასივში 2 ყველაზე პატარა ელემენტის ჯამი, მაგ: [19,5,42,2,77] => 7 
const arr2 = [19, 5, 42, 2, 77];
const sorted = [...arr2].sort((a, b) => a - b); 
const sumOfTwoSmallest = sorted[0] + sorted[1];
console.log("დავალება 2:", sumOfTwoSmallest); 


// 3) გამოთვალეთ მასივის რიცხვების ჯამი ForEach ის გამოყენებით მაგ: [10, 12, 4, 2] => 28
const arr3 = [10, 12, 4, 2];
let totalSum = 0;
arr3.forEach(num => totalSum += num);
console.log("დავალება 3:", totalSum); 


// 4) დაამუშავეთ მასივი რომ დააბრუნოს სტინგი მხოლოდ იმ ელემენტებით რომლის სიგრძე 
// არის 5-ზე მეტი და შეაწებეთ #-ით მაგ: ["cat","parrot","dog","elephant"] => "PARROT#ELEPHANT"
const arr4 = ["cat", "parrot", "dog", "elephant"];
const result4 = arr4
    .filter(word => word.length > 5)
    .map(word => word.toUpperCase())
    .join("#");
console.log("დავალება 4:", result4); 


//5) დააჯგუფეთ მასივი კლასის მიხედვით და გამოითვალეთ საშუალო ქულა, მაგ: 

const students = [
    { name: "Ann",  cls: "A", grade: 90 },
    { name: "Ben",  cls: "B", grade: 75 },
    { name: "Cara", cls: "A", grade: 80 }
];

const intermediate = students.reduce((acc, student) => {
    if (!acc[student.cls]) {
        acc[student.cls] = { sum: 0, count: 0 };
    }
    acc[student.cls].sum += student.grade;
    acc[student.cls].count += 1;
    return acc;
}, {});

const result5 = {};
for (const cls in intermediate) {
    result5[cls] = intermediate[cls].sum / intermediate[cls].count;
}
console.log("დავალება 5:", result5); // {"A": 85, "B": 75}