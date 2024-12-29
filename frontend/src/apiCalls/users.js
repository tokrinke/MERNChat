import { axiosInstance } from ".";

export const getLoggedInUser = async () => {
    try {
        const response = await axiosInstance.get('/users/current')
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/users/all')
        return response.data;
    } catch (error) {
        return error;
    }
}

export const uploadPfp = async (image) => {
    try {
        const response = await axiosInstance.post('/users/upload-pfp', {image})
        return response.data;
    } catch (error) {
        return error;
    }
}