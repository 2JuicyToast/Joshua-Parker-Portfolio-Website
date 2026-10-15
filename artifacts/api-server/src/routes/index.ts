import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioPublisherRouter from "./portfolio-publisher";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portfolioPublisherRouter);

export default router;
