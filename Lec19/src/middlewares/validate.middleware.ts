import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

// მიდლვეარი Joi სქემით request-ის body-ის შესამოწმებლად
function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((item) => item.message);
      return res.status(400).json({ error: "არასწორი მონაცემები", details });
    }

    req.body = value;
    next();
  };
}

export default validate;
