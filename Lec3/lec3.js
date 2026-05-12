//1) დაწერეთ ფუნცქცია რომელიც მიიღებს მასივს არგუმენტად და დააბრუნებს ამ მასივის საშუალო არითმეტიკულს.
const numbers = [10, 20, 30, 40, 50];
function getAverageWithLoop(arr) {

  if (arr.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]; 
  }
  return sum / arr.length;
}

console.log(getAverageWithLoop(numbers)); 

//2) დაწერეთ ფუნცქია რომელიც პარამეტრად მიიღებს რიცხვს და დააბრუნებს ამ რიცხვის შებრუნებულ მასივს თითოეული წევრით. მაგ: 35231 → [1,3,2,5,3]. 0 => [0]

function reverseNumberWithFor(num) {
  let numStr = String(num);
  let result = [];
  for (let i = numStr.length - 1; i >= 0; i--) {
    result.push(Number(numStr[i]));
  }

  return result;
}
console.log(reverseNumberWithFor(35231)); 
console.log(reverseNumberWithFor(0));     


//3) დაწერეთ ფუნქცია რომელიც მიიღებს 2 მასივს არგუმენტად და დააბრუნებს მასივის მხოლოდ იმ 
// წევრებს რომელსაც მეორე მასივი არ შეიცავს მაგ: a = [1, 2] და b = [1] დააბრუნეთ [2]. a = [1, 2, 2, 2, 3] და b = [2] დააბრუნეთ [1, 3].
function getDifference(a, b) {
  let result = [];

  for (let i = 0; i < a.length; i++) {
    if (!b.includes(a[i])) {
      result.push(a[i]);
    }
  }

  return result;
}
console.log(getDifference([1, 2, 2, 2, 3], [2])); // [1, 3]
console.log(getDifference([1, 2], [1]));          // [2]

//4) დაწერეთ ფუნცქცია რომელსაც გადმოეცემა მასივი და იპოვე მასივში მეორე ყველაზე დიდი რიცხვი. მაგ: [10, 40, 20, 5, 30] => 30

function findSecondLargestShort(arr) {

  const uniqueSorted = [...new Set(arr)].sort((a, b) => b - a);
  
  return uniqueSorted.length >= 2 ? uniqueSorted[1] : null;
}
let res=findSecondLargestShort([10, 40, 20, 5, 30]);
console.log(res); 

//5) დაწერეთ ფუნცქია რომელიც მიიღებს სტირნგების მასივს და უნდა დააბრუნოტ მხოლოდ იმ სიტყვების მასივი რომლებიც არის პალინდორმი: 
//* პალინდორმი ეწოდება სიტყვას რომელიც შემობრუნების შემდეგ იგივე მნიშვნელობას ინარჩუნებს. 
//მაგ: ["mom", "car", "level", "dog"] => ["mom", "level"]

const data = ["mom", "car", "level", "dog", "radar"];
function getPalindromes(words) {
  let result = [];

  for (let i = 0; i < words.length; i++) {
    let currentWord = words[i];
    let reversedWord = "";

    for (let j = currentWord.length - 1; j >= 0; j--) {
      reversedWord += currentWord[j];
    }

    if (currentWord === reversedWord) {
      result.push(currentWord);
    }
  }

  return result;
}

console.log(getPalindromes(data)); 

//6)დაწერეთ ფუნცქია რომელიც მიიღებს რიცხვების მასივს და დააბრუნებთ რომელია ყველაზე ხშირად გამეორებადი რიცხვი მაგ: [4, 5, 6, 5, 4, 5] => 5

const nums = [4, 5, 6, 5, 4, 5];
function findMostFrequent(arr) {

  if (arr.length === 0) return null;

  let counts = {}; 
  let maxCount = 0; 
  let mostFrequent = arr[0]; 

  for (let i = 0; i < arr.length; i++) {
    let num = arr[i];

    if (counts[num] === undefined) {
      counts[num] = 1;
    } else {
      counts[num]++;
    }

    if (counts[num] > maxCount) {
      maxCount = counts[num];
      mostFrequent = num;
    }
  }

  return mostFrequent;
}

console.log(findMostFrequent(nums)); 
