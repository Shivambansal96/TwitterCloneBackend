import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
    },
    imgSrc:{
        type: String,                                                                       
    },
    like:{
        type: Array,
        default:[],
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userDetails: {
        type: Array,
        default: []
    }
}, {timestamps: true})

export const Tweet = mongoose.model('Tweet', tweetSchema)