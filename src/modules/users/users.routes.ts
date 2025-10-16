import { Router } from 'express';
import { container } from 'tsyringe';
import { UsersController } from '@/modules/users/users.controller';
import { asyncHandler } from '@/core/middleware/asyncHandler';
const usersRouter = Router();
const controller = container.resolve(UsersController);
usersRouter.get('/', asyncHandler(controller.get.bind(controller)));
export default usersRouter;