import { Router } from "express";

import { messageController } from "./messageController";
import { accountController } from "./accountController";
import { pageController } from "./pageController";

export const controller = Router();

controller.use(messageController);
controller.use(accountController);
controller.use(pageController);