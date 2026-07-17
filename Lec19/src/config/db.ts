import mongoose from "mongoose";

// მონაცემთა ბაზასთან დაკავშირების ფუნქცია
async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI as string;
    await mongoose.connect(mongoUri);
    console.log("MongoDB დაკავშირებულია");
  } catch (error) {
    console.error("MongoDB დაკავშირების შეცდომა:", error);
    process.exit(1);
  }
}

export default connectDB;
