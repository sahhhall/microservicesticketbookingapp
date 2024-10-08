import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@sahhhalltickets/common";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    // body("password").notEmpty().withMessage("Password should be filled"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Inavlid credentials");
    }
    const passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid password");
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    //storeing in session object

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
