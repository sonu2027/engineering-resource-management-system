"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = (fileBuffer, filename) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({ resource_type: "auto", public_id: filename }, (error, result) => {
            if (error) {
                console.error("Error uploading file:", error);
                reject(error);
            }
            else if (result) {
                console.log("File uploaded successfully:", result);
                resolve(result);
            }
        })
            .end(fileBuffer);
    });
});
exports.uploadOnCloudinary = uploadOnCloudinary;
const deleteFromCloudinary = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        console.log("delete for cloudinary called");
        cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error("Error deleting image:", error);
                reject(error);
            }
            else {
                console.log("Image deleted successfully:", result);
                resolve(result);
            }
        });
    });
});
exports.deleteFromCloudinary = deleteFromCloudinary;
