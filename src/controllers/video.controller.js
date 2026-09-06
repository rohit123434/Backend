import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const publishAVideo = asyncHandler(async (req, res) => {
    const {title, description } = req.body;

    if (
        [ title, description ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let videoFileLocalpath;
    if (
        req.files &&
        Array.isArray(req.files.videoFile) &&
        req.files.videoFile.length > 0
    ) {
        videoFileLocalpath = req.files.videoFile[0].path;
    }

    let thumbnailLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.thumbnail) &&
        req.files.thumbnail.length > 0
    ) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalpath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "VideoFile is required")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const video = await Video.create({
        videoFile: videoFile?.url || "",
        thumbnail : thumbnail?.url || "",
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id
    })

    console.log("Video :::::: ", video);
    

    if (!video) {
        throw new ApiError(500, " Something went wrong while publishing video ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, " Video Published successfully")
    )

    
})

export {
    publishAVideo
}