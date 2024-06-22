import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    profileImageSrc:{
        type: String,
    }, 
    backgroundImageSrc:{
        type: String,                                                                       
    },
    bio:{
        type: String,                                                                       
    },
})

// export const Image = mongoose.model('Image', imageSchema)

const imageModel = mongoose.model.image || mongoose.model('image', imageSchema)

export default imageModel;
