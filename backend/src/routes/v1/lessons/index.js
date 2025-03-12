import { Router } from "express";
import studentRouter from "./student.js";
import teacherRouter from "./teacher.js";

const lessonsRouter = Router();

lessonsRouter.use("/student", studentRouter);
lessonsRouter.use("/teacher", teacherRouter);

export default lessonsRouter;