import { Router } from 'express';
import login_router from './login.js';
import register_router from './register.js';
import logout_router from './logout.js';
import delete_user_router from './delete-user.js';

const auth_router = Router();

// Combine all auth routes
auth_router.use(login_router);
auth_router.use(register_router);
auth_router.use(logout_router);
auth_router.use(delete_user_router);

export default auth_router;
