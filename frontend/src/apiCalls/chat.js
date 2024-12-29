import { axiosInstance } from './index'

export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get('/chats/all-chats')
        return response.data
    } catch (error) {
        return error;
    }
}

export const startNewChat = async ( members ) => {
    try {
        const response = await axiosInstance.post('/chats/create-new-chat', { members })
        return response.data
    } catch (error) {
        return error;
    }
}

export const clearUnreadMessages = async (chatId) => {
    try {
        const response = await axiosInstance.post('/chats/clear-unread', { chatId: chatId })
        return response.data
    } catch (error) {
        return error
    }
}