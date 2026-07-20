import User from "../user/user.model";

export async function getLeaderboard(limit = 10) {
  const users = await User.find().select("username score").sort({ score: -1 }).limit(limit);

  return users.map((user) => ({
    userId: user.id,
    username: user.username,
    score: user.score,
  }));
}
