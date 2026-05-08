// 1) დაწერეთ ფუნცქია რომელიც პარამეტრად მიიღებს სტრინგს და დააბრუნებს ამ სტირნგის აბრივიატურას მაგალითად getAbbr('John Doe') => "J.D"
function getAbbr(str) {
  let words = str.split(" ");
  let result = "";

  for (let i = 0; i < words.length; i++) {
    result += words[i][0].toUpperCase();

    if (i !== words.length - 1) {
      result += ".";
    }
  }

  return result;
}

//2) დაწერეთ ფუნცქია რომელიც არგუმენტად მიიღებს რიცხვს და დააბრუნებს ამ რიცხვების ჯამს მაგ: getSumOfDigit(123) => 6 ახსნა 1 + 2 + 3
function getSumOfDigit(num) {
  let digits = num.toString();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]);
  }

  return sum;
}

// 3) დაწერეთ ფუნქცია რომელიც პარამეტრად მიიღებს სტრინგს და წაშლის ამ სტრინგიდან ყველა გამეორებად ასოს. მაგ: removeDuplicates('banana') => 'ban'
function removeDuplicates(str) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    if (!result.includes(str[i])) {
      result += str[i];
    }
  }

  return result;
}

// 4) დაწერეთ ფუნქცია რომელიც წაშლის ყველა სფეისს სტრინგინდან მაგ: removeSpaces('1 2 aab') => '12aab' უნდა გამოიტენოთ for ლუპი
function removeSpaces(str) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] !== " ") {
      result += str[i];
    }
  }

  return result;
}

// 5) დაწერეთ ფუნცქია რომელიც მიიღებს წინადადებას და შემოაბრუნებს თითოეულ სიტყვას მაგ: reverseEachWord('Hello World') =>  "olleH dlroW"
function reverseEachWord(sentence) {
  let words = sentence.split(" ");
  let result = [];

  for (let i = 0; i < words.length; i++) {
    let reversed = "";

    for (let j = words[i].length - 1; j >= 0; j--) {
      reversed += words[i][j];
    }

    result.push(reversed);
  }

  return result.join(" ");
}

console.log(reverseEachWord("Hello World")); // olleH dlroW


function Allfunctions(){
   console.log ("1. სტრინგის აბრევიატურა: " + getAbbr("John Doe"))
   console.log ("2. რიცხვის ციფრების ჯამი: " + getSumOfDigit(123))  
   console.log ("3. გამეორებადი ასოების წაშლა: " + removeDuplicates("banana"))  
   console.log ("4. ყველა space-ის წაშლა: " + removeSpaces("1 2 aab"))  
   console.log ("5. თითოეული სიტყვის შემობრუნება:  " + reverseEachWord("Hello World"))  
}

Allfunctions();