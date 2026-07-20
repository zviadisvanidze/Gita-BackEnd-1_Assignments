import Quiz from "./quiz.model";

const PUBLIC_FIELDS = "-correctOptionIndex";


export async function getAllQuizzes() {
  return Quiz.find().select(PUBLIC_FIELDS).sort({ createdAt: 1 });
}


export async function getQuizPublicById(id: string) {
  return Quiz.findById(id).select(PUBLIC_FIELDS);
}


export async function getQuizWithAnswer(id: string) {
  return Quiz.findById(id);
}
