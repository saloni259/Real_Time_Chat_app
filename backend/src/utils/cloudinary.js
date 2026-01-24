import {v2 as cloudinary} from "cloudinary"
import fs from "fs/promises"
import dotenv from "dotenv"
dotenv.config({path:"./.env"})


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

//function for upload files and profiles on cloudinary
const uploadOnCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null;
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto"
        })
        console.log("file is upload on cloudinary",response.url);
        await fs.unlink(localfilepath);
        return response;
    } catch (error) {
        console.log("Error is upload image in cloudinary",error?.message);
        await fs.unlink(localfilepath);
        return null;
    }
}

//function for delete files and profiles from cloudinary
const deleteFromCloudinary = async (localId) => {
    try {
        if(!localId){
            return null;
        }
        const response = await cloudinary.uploader.destroy(localId);
        return response;
    } catch (error) {
        console.log("Error in deleting..",error?.message);
        return null;
    }
}


export {deleteFromCloudinary,uploadOnCloudinary}