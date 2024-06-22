import express from 'express'
import { Login, Logout, Register, bookmark, getFollow, getMyProfile, getOtherUsers, getUnfollow } from '../controllers/userController.js';
// import { updateProfile } from '../controllers/userController.js';
import isAuthenticated from '../utils/auth.js';
// import multer from 'multer';

// const storage=multer.diskStorage({
//     destination:"uploads",
//     filename:(req,file,cb)=>{
//         return cb(null,`${Date.now()}${file.originalname}`)
//     }
// })

// const upload=multer({storage:storage})


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
// router.route('/updateprofile/:id').put(upload.fields([
//     { name: 'profileImageSrc', maxCount: 1 },
//     { name: 'backgroundImageSrc', maxCount: 1  }
// ]), updateProfile);

// router.route('/updateprofile/:id').put(upload.single('image'),updateProfile);
// router.post('/updateprofile/:id', upload.single('image', isAuthenticated, updateProfile));

// extra 

export default router;  