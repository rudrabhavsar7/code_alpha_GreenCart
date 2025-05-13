import {v2 as cloudinary} from "cloudinary";

const connectCloudinary = async()=>{
    cloudinary.config({
        cloud_name : process.env.CLOUDNARY_CLOUD_NAME,
        api_key: process.env.CLOUDNARY_API_NAME,
        api_secret: process.env.CLOUDNARY_API_SECRET
    })
}

export default connectCloudinary;