import { v2 as cloudinary } from "cloudinary";
import console from "console";
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been loaded successfully
        // console.log("filr is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove locaaly saved temporary file as the upload operation got failed
    }
}

const deleteOnCloudinary = async (publicId) => {
  try {
      if(!publicId) return null;

     
      const cleanedPublicId = publicId.split("/").pop().split(".")[0]
        console.log("cleanedPublicId ::::", cleanedPublicId)

     
    const response = await cloudinary.uploader.destroy(cleanedPublicId,
        {
            resource_type: 'image',
            invalidate: true
        }
        
    )

    console.log("image deleted on cloudinary", response)
    return response
  } catch (error) {
    
    console.log("error while deleting the image on cloudinary", error.message)
  }
}


export {
    uploadOnCloudinary, 
    deleteOnCloudinary
}