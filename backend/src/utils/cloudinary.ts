import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadResult = UploadApiResponse | UploadApiErrorResponse;

const uploadOnCloudinary = async (
    fileBuffer: Buffer,
    filename: string
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                { resource_type: "auto", public_id: filename },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading file:", error);
                        reject(error);
                    } else if (result) {
                        console.log("File uploaded successfully:", result);
                        resolve(result);
                    }
                }
            )
            .end(fileBuffer);
    });
};

const deleteFromCloudinary = async (
    public_id: string
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return new Promise((resolve, reject) => {
        console.log("delete for cloudinary called");
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error("Error deleting image:", error);
                reject(error);
            } else {
                console.log("Image deleted successfully:", result);
                resolve(result);
            }
        });
    });
};

export { uploadOnCloudinary, deleteFromCloudinary };
