import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";



export const createTweet = async(req, res) => {

        try {

            const {description, imgSrc, id} = req.body;

            if(!description || !id) {
                return res.status(401).json({
                    message: 'Fields cannot be Empty!',
                    status: false
                })
            }

            const user = await User.findById(id).select('-password')
            await Tweet.create({
                description,
                // imgSrc,
                userId: id,
                userDetails: user
            })

            return res.status(201).json({
                message: "Tweet created successfully.",
                status: true
            });
            
        } catch (error) {
            console.log(error);        
        }
}

export const deleteTweet = async(req, res) => {


    try {
        const { id } = req.params;
        
        await Tweet.findByIdAndDelete(id);
        
        return res.status(200).json({
            message: "Tweet Deleted Successfully!",
            status: true
        })
        
    } catch (error) {
        console.log(error);
    }
}

export const likeOrDislike = async(req, res) => {

    try {

        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);

        if(tweet.like.includes(loggedInUserId))  {
            // The user has already liked it.
            // So DISLIKE it.

            await Tweet.findByIdAndUpdate(tweetId, {$pull:{like:loggedInUserId}});

            return res.status(200).json({
                message: "User removed his like.",
                // message: `${User.name} removed his like.`
            })            
        }

        else {
            // Like the Tweet

            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});

            return res.status(200).json({
                message: "User liked your Tweet.",
                // message: `${User} liked your Tweet.`
            })

        }
        
    } catch (error) {
        console.log(error);
    }

}


export const getAllTweets = async(req, res) => {

    try {

        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId) => {

            return Tweet.find({userId: otherUsersId})

        }))

        return res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweet)
        })
        
    } catch (error) {
        console.log(error);
    }

}


export const getFollowingTweets = async(req, res) => {
    try {

        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId) => {

                return Tweet.find({userId: otherUsersId})

        }))

        return res.status(200).json({
            tweets: [].concat(...followingUserTweet)
        })
        
    } catch (error) {
        console.log(error);
    }
}

