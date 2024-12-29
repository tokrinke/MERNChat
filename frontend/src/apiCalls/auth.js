import { axiosInstance } from "./index";

export const signUpUser = async (user) => {
    try {
        const response = await axiosInstance.post('/signup', user)
        return response.data;
    } catch (error) {
        return error;
    }
}

export const logUserIn = async (user) => {
    try {
        const response = await axiosInstance.post('/login', user)
        console.log(response.data)
        return response.data;
    } catch (error) {
        return error;
    }
}