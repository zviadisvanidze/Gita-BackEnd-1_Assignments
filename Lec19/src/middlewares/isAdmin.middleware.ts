import { Request, Response, NextFunction } from "express";

// მიდლვეარი, რომელიც ამოწმებს ჰედერში როლი ადმინია თუ არა
// გამოიყენება პროდუქტის წაშლისა და განახლების დროს
function isAdmin(req: Request, res: Response, next: NextFunction) {
  const role = req.headers["role"];

  if (role !== "admin") {
    return res.status(403).json({ error: "მხოლოდ ადმინს შეუძლია ამ მოქმედების შესრულება" });
  }

  next();
}

export default isAdmin;
