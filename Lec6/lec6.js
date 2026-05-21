// 1) რა თანმიმდევრობით დაილოგება შემდეგი ინსტრუქციები: 
// console.log("1");
// setTimeout(() => console.log("2"), 100);
// setTimeout(() => console.log("3"), 0);
// Promise.resolve().then(() => console.log("4"));
// console.log("5");

console.log("--- დავალება 1 ---");
console.log("1");
setTimeout(() => console.log("2"), 100);
setTimeout(() => console.log("3"), 0);
Promise.resolve().then(() => console.log("4"));
console.log("5");
// 1,5,4,3,2

// 2) რა თანმიმდევრობით დაილოგება შემდეგი ინსტრუქციები: 
// console.log("1");
// setTimeout(() => console.log("2"), 0);
// Promise.resolve().then(() => {
//   console.log("3");
//   setTimeout(() => console.log("4"), 0);
// });
// console.log("5");

setTimeout(() => {
  console.log("\n--- დავალება 2 ---");
  console.log("1");
  setTimeout(() => console.log("2"), 0);
  Promise.resolve().then(() => {
    console.log("3");
    setTimeout(() => console.log("4"), 0);  //??????????
  });
  console.log("5");
}, 200);
//1, 5, 3, 2, 4

// 3) დაწერეთ სლიფ ფუნქცია რომელიც პარამეტრად მიიღებს მილიწამს და დაიძინებს, ანუ სისტემა გაჩერდება პარამეტრის მიხედვით.
//  await sleep(1000) სადაც ამ ფუნცქიას გამოიყენებთ 1 წამი უნდა გაჩერდეს ხოლმე სისტემა, 
// გაითვალისწინეთ await ით უნდა გააჩეროთ ანუ პრომისი უნდა დააბრუნოს ფუნქციამ

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runSleep() {
  console.log("\n--- დავალება 3 ---");
  console.log("სისტემა ჩერდება 1 წამით...");
  await sleep(1000); 
  console.log("1 წამი გავიდა! კოდი გაგრძელდა.");
}
setTimeout(runSleep, 400);


//4) დაწერეთ ფუნცქია რომელიც პარამეტრად მიიღებს რიცხვს 1-დან 20-მდე თქვენი მიზანია ფუნცქიის შიგნით ფუნქციამ 
// ყოველ 1 წამში რენდომ რიცხვი დააგენერიროს მანამ სანამ რენდომ დაგენერირებული რიცხვი არ დამეთხვევა პარამეტს, 
// როგორც კი ისინი ერთმანეთს დაემთხვევა გააჩერეთ რენდომ რიცხვის დალოგვა.

function guessNumber(targetNumber) {
  console.log(`\n--- დავალება 4 (სამიზნე რიცხვი: ${targetNumber}) ---`);
  if (targetNumber < 1 || targetNumber > 20) {
    console.log("გთხოვთ შეიყვანოთ რიცხვი 1-დან 20-მდე.");
    return;
  }
  const intervalId = setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 20) + 1;
    console.log(`დაგენერირდა: ${randomNumber}`);
    if (randomNumber === targetNumber) {
      console.log(`რიცხვები დაემთხვა (${randomNumber})! პროცესი შეწყდა.`);
      clearInterval(intervalId);
    }
  }, 1000);
}
setTimeout(() => guessNumber(7), 1500);

//5) დაწერეთ ფუნცქია რომელსაც გადაეცემა 2 პარამეტრი 1 - ნებისმიერი რიცხვი 2 - დროის ერთეული მილიწამებში,
//  თქვენი მიზანია დალოგოთ რიცხვები ამ რიცხვიდან 0 მდე იმ დროის ინტერვალში რაც არის მეორე პარამეტრი და 0 ზე გააჩეროთ.

function countdown(startNumber, delay) {
  setTimeout(() => {
    console.log(`\n--- დავალება 5 (Countdown: ${startNumber}-დან 0-მდე, ინტერვალი: ${delay}მს) ---`);  
    let current = startNumber;
    const intervalId = setInterval(() => {
      console.log(current);
      if (current === 0) {
        console.log("ითვლის დასასრული!");
        clearInterval(intervalId);
      }
      current--; 
    }, delay);
    
  }, 10000); 
}
countdown(5, 500);