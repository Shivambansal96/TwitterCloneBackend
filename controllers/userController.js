
import bcryptjs from 'bcryptjs'
import { User } from '../models/userSchema.js';
import jsonWebToken from 'jsonwebtoken'
import imageModel from '../models/imageSchema.js';

// extra 



// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const dir = './uploads/';
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }
//         cb(null, dir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });


// export const upload = multer({ storage: storage });

// Profile update controller
// export const updateProfile = async (req, res) => {
//     try {
//         const { bio } = req.body;
//         const profileImage = req.files.profileImage ? req.files.profileImage[0].path : null;
//         const backgroundImage = req.files.backgroundImage ? req.files.backgroundImage[0].path : null;

//         const userId = req.user.userId; // Assuming userId is stored in req.user after authentication

//         const updateData = {
//             bio: bio || "",
//         };

//         if (profileImage) updateData.profileImage = profileImage;
//         if (backgroundImage) updateData.backgroundImage = backgroundImage;

//         const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

//         res.status(200).json({
//             message: 'Profile updated successfully',
//             user: updatedUser
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: 'Internal Server Error',
//         });
//     }
// };


// extra 



export const Register = async(req, res) => {

    try {

        const { name, username, email, password } = req.body;
        if(!name || !username || !email || !password) {
            return res.status(401).json({
                message: 'All details need to be filled.',
                success: false
            })
        }

        const user = await User.findOne({email})

        if(user) {
            return res.status(401).json({
                message: 'User already exists.',
                success: false
            })
        }

        const hiddenPass = await bcryptjs.hash(password, 12)

        await User.create({
            name, 
            username, 
            email, 
            password:hiddenPass
        })

        return res.status(201).json({
            message:'Account created Successfully.',
            success: true
        })

        
    } catch (error) {
        console.log(error);
    }
}


export const Login = async(req, res) => {

    try {

        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message: 'Field cannot be empty!',
                status: false
            })
        }


        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message: "User doesnot exist!",
                status: false
            })
        }

        const isSame = await bcryptjs.compare(password, user.password)

        // console.log(user.password, password);
        if(!isSame) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                status: false
            })
        }

        const tokenData = {
            userId: user._id
        }

        const jsonToken = await jsonWebToken.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn:'2d'})

        console.log('JSON TOKEN = ', jsonToken);


        return res.status(201).cookie('jsonToken', jsonToken, {expiresIn:'2d', httpOnly: true}).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
        
    } catch (error) {
        console.log(error);
    }

}


export const Logout = (req, res) => {
     return res.cookie("jsonToken", "", {expiresIn: new Date(Date.now())}).json({
        message: "Logout Successful!",
        status: true
     })
}

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            });
        } else {

            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



export const getMyProfile = async(req, res) => {

    try {

        const id = req.params.id;  
        // console.log(id);
        const user = await User.findById(id).select("-password");

        return res.status(200).json({
            user,
        })

        
    } catch (error) {
        console.log(error);
    }

}


export const getOtherUsers = async(req, res) => {

    try {
        
    const { id } = req.params;
    const otherUsers = await User.find({_id:{$ne:id}}).select('-password')

    if(!otherUsers) {
        return res.status(401).json({
            message: 'NO User exists in DB.'
        })
    }

    return res.status(200).json({
        otherUsers
    })

    } catch (error) {
        console.log(error);       
    }
}

export const getFollow = async(req, res) => {

    try {

        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)

        if(!user.followers.includes(loggedInUserId)) {
            await user.updateOne({$push:{followers:loggedInUserId}})
            await loggedInUser.updateOne({$push:{following:userId}})
        }
        else {
            return res.status(400).json({
                message: `${loggedInUser.name} already followed ${user.name}`
            })
        }

        return res.status(200).json({
            // message: `${loggedInUser.name} just followed you`,
            message: `${loggedInUser.name} just followed ${user.name}`,
            status: true
        })

        
    } catch (error) {
        console.log(error);
    }

}

export const getUnfollow = async(req, res) => {

    try {

        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)

        if(loggedInUser.following.includes(userId)) {
            await user.updateOne({$pull:{followers:loggedInUserId}})
            await loggedInUser.updateOne({$pull: {following:userId}})
        }
        else {

            return res.status(400).json({
                message: `${user.name} has not followed you yet`,
                // message: 'User has not followed yet'

            })
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just unfollowed ${user.name}`,
            // message: `${loggedInUser.name} just unfollowed you`
        })

        
    } catch (error) {
        console.log(error);
        
    }

}



export const updateProfile = async (req, res) => {
    const userId = req.params.id;

    console.log('USER_ID', userId);

    let profileImage = req.file ? req.file.filename : null;

    try {
        const updatedData = {};
        if (profileImage) {
            updatedData.profileImageSrc = profileImage;
        }
        // Add more fields if needed
        if (req.body.backgroundImageSrc) {
            updatedData.backgroundImageSrc = req.body.backgroundImageSrc;
        }
        if (req.body.bio) {
            updatedData.bio = req.body.bio;
        }

        const user = await imageModel.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user,
            success: true,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        });
    }
};
