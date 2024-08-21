import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);


app.all("*", async () => {
   throw new NotFoundError()
});

app.use(errorHandler);

let port: number = 3000;

app.listen(port, () => {
  console.log("server connected on port 3000!!!!!!!!");
});
