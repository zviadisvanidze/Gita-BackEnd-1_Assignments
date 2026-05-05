// 1) დაწერეთ ფუნცქია რომელიც გადააკონვერტირებს ცელსიუს ფარენჰეიტში და დააბრუნებს პასუხს.
function cToF(c) {
  return (c * 9) / 5 + 32;
}

// 2) დაწერე თუნცქია რომელიც მიიღებს სტრინგს არგუმენტად და დააბრუნებს ამ სრინგის შებრუნებულს(reverse).
function reverse(str) {
  return str.split("").reverse().join("");
}

// 3) დაწერეთ ფუნქცია რომელიც პარამეტრად მიიღებს წინადადებას და დათვლის რამდენი სიტყვაა 
//    შიგნით(ეს ლექციაზე არ გაგვიკეთებია მაგრამ შეგიძლია დასერჩოთ)
function count(sentence) {
  return sentence.trim().split(/\s+/).length;
}

// 4) დაწერეთ ფუნცქია რომელიც პარამეტრად მიიღებს სიტყვას და დააბრუნებს რამდენი ხმოვანია ამ სიტყვაში
function Vowels(word) {
  const matches = word.match(/[aeiouAEIOU]/g);
  return matches ? matches.length : 0;
}

//5) დაწერეთ ფუნცქია რომელიც მიიღებს რიცხს პარამეტრად და დაგიბრუნებთ ამ რიცხვის ფაქტორიალს
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// 6) დაწერეთ ფუნცქია რომლეიც მიიღებს რიცხს პარამეტრად და დაგიბრუნებთ 0 დან ამ რიცხვამდე 
//    მხოლოდ ლუწი რიცხვების ჯამს
function sumOfEvens(n) {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0) sum += i;
  }
  return sum;
}

// 7) დაწერეთ ფუნცქია რომელიც მიიღებს სტუდენტის ქულას არგუმენტად და დაგირბუნებთ 
//    სტუდენტის შეფასებას A,B,C,E,F
function getGrade(score) {
  if (score >= 91 && score <= 100) return "A";
  if (score >= 81) return "B";
  if (score >= 71) return "C";
  if (score >= 51) return "E";
  return "F";
}

// 8) დაწერეთ ფუნცქია რომელიც მიიღებს პაროლს პარამეტრად თქვენი მიზანია შეამოწმოთ თუ 
//    არის 8 სიმბოლოზე მეტი შეიცავს რიცხვს და ერთი დიდ ასოს(capital letter). 
//    ეს  დავალებები გამიკეთე ამ ფაილში ყველა ერთად
function validatePassword(password) {
  if (password.length <= 8) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
}

function Allfunctions(){
   console.log ("1. ფუნქცია ცელსიულის გადაყვანა ფარენგეიტში: " + cToF(35))
   console.log ("2. სტრინგის შებრუნება: " + reverse('abcd'))  
   console.log ("3. სიტყვების დათვლა: " + count('I love JavaScript.'))  
   console.log ("4. ხმოვნების დათვლა: " + Vowels('Javascript'))  
   console.log ("5. რიცხვის ფაქტორიალი: " + factorial(5))  
   console.log ("6. ლუწი რიცხვების ჯამი: " + sumOfEvens(100))  
   console.log ("7. სტუდენტის შეფასება: " + getGrade(78)) 
   console.log ("8. პაროლსი შემოწმება: " + validatePassword('Abc2026!@')) 
}

Allfunctions();