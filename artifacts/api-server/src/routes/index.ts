import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import dashboardRouter from "./dashboard";
import rightsRouter from "./rights";
import complaintsRouter from "./complaints";
import documentsRouter from "./documents";
import journeysRouter from "./journeys";
import schemesRouter from "./schemes";
import learningRouter from "./learning";
import legalaidRouter from "./legalaid";
import chatRouter from "./chat";
import notificationsRouter from "./notifications";
import searchRouter from "./search";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(dashboardRouter);
router.use(rightsRouter);
router.use(complaintsRouter);
router.use(documentsRouter);
router.use(journeysRouter);
router.use(schemesRouter);
router.use(learningRouter);
router.use(legalaidRouter);
router.use(chatRouter);
router.use(notificationsRouter);
router.use(searchRouter);
router.use(adminRouter);

export default router;
