import express from 'express'
import { Login, Logout, Register, bookmark, getFollow, getMyProfile, getOtherUsers, getUnfollow, updateProfile, upload } from '../controllers/userController.js';
import isAuthenticated from '../utils/auth.js';

const router = express.Router();

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/bookmark/:id').put(isAuthenticated, bookmark);
router.route('/profile/:id').get(isAuthenticated, getMyProfile)
router.route('/otherusers/:id').get(isAuthenticated, getOtherUsers)
router.route('/follow/:id').post(isAuthenticated, getFollow)
router.route('/unfollow/:id').post(isAuthenticated, getUnfollow)



// extra 
router.route('/update-profile').put(isAuthenticated, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]), updateProfile);

// extra 

export default router;  