import { apiConnector } from "../Connect";
import {toast} from "react-hot-toast";

const DIRECT_MESSAGE_API = {
    UPLOAD_CONTACTS: 'http://localhost:4000/api/v1/direct-message/upload',
    SEND_MESSAGES: 'http://localhost:4000/api/v1/direct-message/send',
    DOWNLOAD_TEMPLATE: 'http://localhost:4000/api/v1/direct-message/template'
};

export const downloadTemplate = async (type) => {
    try {
        const response = await fetch(`${DIRECT_MESSAGE_API.DOWNLOAD_TEMPLATE}/${type}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to download template');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contacts_template.${type}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success(`${type.toUpperCase()} template downloaded successfully`);
    } catch (error) {
        toast.error('Error downloading template: ' + error.message);
        throw error;
    }
};

export const uploadContacts = async (formData) => {
    try {
        const response = await apiConnector(
            'POST',
            DIRECT_MESSAGE_API.UPLOAD_CONTACTS,
            formData,
            {
                'Content-Type': 'multipart/form-data'
            }
        );
        if(response.data.success){
            return response.data;
        }
        else{
            toast.error(response.data.message);
        }
    } catch (error) {
        throw error;
    }
};

export const sendMessages = async (fileId, message) => {
    try {
        const response = await apiConnector(
            'POST',
            DIRECT_MESSAGE_API.SEND_MESSAGES,
            { fileId, message }
        );
        if(response.data.success){
            return response.data;
        }
        else{
            toast.error(response.data.message);
        }
    } catch (error) {
        throw error;
    }
}; 