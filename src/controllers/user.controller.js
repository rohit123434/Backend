import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
   
    // get user detail form frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and referesh token field from response
    // check for user creation 
    // return res

    const {fullName, email, username, password } = req.body
    console.log("email: ", email);
    
    // if (fullName === "") {
    //     throw new ApiError(400, "fullName is required")
    // }

    if (
        [fullName, email, username, password].some((field) => 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    
    if (existedUser) {
        throw new ApiError(409, "user already exist")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath =  req.files?.coverImage[0]?.path;
    
    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file is required")
    }
   
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password, 
        username: username.tolowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something wnet wrong while registering the user")
    }

    return res.Status(201).json(
        new ApiResponse(200, createdUser, "User registerd successfully")
    )

}) 

export { registerUser }