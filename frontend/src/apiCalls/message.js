import { axiosInstance } from './index'

export const createNewMessage = async ( message ) => {
    try {
        const response = await axiosInstance.post('/messages/new-message', message)
        return response.data
    } catch (error) {
        return error;
    }
}

export const fetchAllMessages = async ( chatId ) => {
    try {
        const response = await axiosInstance.get(`/messages/all-messages/${chatId}`)
        return response.data
    } catch (error) {
        return error;
    }
}