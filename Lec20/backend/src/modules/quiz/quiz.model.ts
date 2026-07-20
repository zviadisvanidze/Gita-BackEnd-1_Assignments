import { Schema, model, Document } from "mongoose";

export interface IQuiz extends Document {
  question: string;
  options: string[];
  correctOptionIndex: number;
  category: string;
  points: number;
}

const quizSchema = new Schema<IQuiz>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options: string[]) => options.length >= 2,
        message: "ვარიანტები მინიმუმ 2 უნდა იყოს",
      },
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = model<IQuiz>("Quiz", quizSchema);

export default Quiz;
