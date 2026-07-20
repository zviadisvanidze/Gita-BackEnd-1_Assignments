import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db";
import Quiz from "../modules/quiz/quiz.model";

dotenv.config();

const quizzes = [
  {
    question: "რომელი პლანეტაა მზის სისტემაში ყველაზე დიდი?",
    options: ["დედამიწა", "მარსი", "იუპიტერი", "სატურნი"],
    correctOptionIndex: 2,
    category: "ასტრონომია",
    points: 10,
  },
  {
    question: "რომელ წელს დაიწყო მეორე მსოფლიო ომი?",
    options: ["1935", "1939", "1941", "1945"],
    correctOptionIndex: 1,
    category: "ისტორია",
    points: 10,
  },
  {
    question: "საქართველოს დედაქალაქია?",
    options: ["ბათუმი", "ქუთაისი", "თბილისი", "რუსთავი"],
    correctOptionIndex: 2,
    category: "გეოგრაფია",
    points: 10,
  },
  {
    question: "რომელი ორგანოა ადამიანის სხეულში ყველაზე დიდი?",
    options: ["გული", "ღვიძლი", "კანი", "ფილტვები"],
    correctOptionIndex: 2,
    category: "მეცნიერება",
    points: 10,
  },
  {
    question: "რომელ სპორტში გამოიყენება ტერმინი 'checkmate' (მატი)?",
    options: ["ჭადრაკი", "ჭადრაკ-დამა", "ბილიარდი", "დომინო"],
    correctOptionIndex: 0,
    category: "სპორტი",
    points: 10,
  },
  {
    question: "ვინ დახატა 'მონა ლიზა'?",
    options: ["პაბლო პიკასო", "ვინსენტ ვან გოგი", "ლეონარდო და ვინჩი", "მიქელანჯელო"],
    correctOptionIndex: 2,
    category: "ხელოვნება",
    points: 10,
  },
  {
    question: "რას უდრის 7 x 8?",
    options: ["54", "56", "64", "48"],
    correctOptionIndex: 1,
    category: "მათემატიკა",
    points: 10,
  },
  {
    question: "JavaScript-ში რომელი ოპერატორი ამოწმებს ტიპსაც და მნიშვნელობასაც?",
    options: ["==", "===", "=", "!="],
    correctOptionIndex: 1,
    category: "პროგრამირება",
    points: 10,
  },
  {
    question: "რომელი წიგნის ავტორია შოთა რუსთაველი?",
    options: ["ვეფხისტყაოსანი", "ვისრამიანი", "ამირანდარეჯანიანი", "დავითიანი"],
    correctOptionIndex: 0,
    category: "ლიტერატურა",
    points: 10,
  },
  {
    question: "რომელი ინსტრუმენტია სიმებიანი?",
    options: ["დოლი", "გიტარა", "საკვირაო", "ფლეიტა"],
    correctOptionIndex: 1,
    category: "მუსიკა",
    points: 10,
  },
];

async function seed() {
  await connectDB();

  await Quiz.deleteMany({});
  await Quiz.insertMany(quizzes);

  console.log(`დაემატა ${quizzes.length} ქუიზი`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("შეცდომა ქუიზების დამატებისას:", error);
  process.exit(1);
});
