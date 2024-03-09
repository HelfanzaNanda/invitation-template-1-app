import { notification } from 'antd';
import { ApiClient } from '@/clients/ApiClient';
import { Media, MediaInput } from '@/types/media.type';
import { handleMessaeApiValidation } from '@/helpers/messageError.helper';

export const useMedia = () => {

    const path = `media`;
    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const result = await ApiClient.requestFile<Media>(`${path}/upload`, ApiClient.METHOD_POST, formData);
        if (!result.status) {
            handleMessaeApiValidation(result.validations);
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        return result.data;
    };
    const download = async (uuid : string, filename : string) => {
        const file = await ApiClient.downloadFile(`${path}/${uuid}`, filename);
        return file;
        // console.log('result : ', result);
        
        // if (!result.status) {
        //     handleMessaeApiValidation(result.validations);
        //     const message = result.message;
        //     notification.error({ message })
        //     throw new Error(message);
        // }
        // notification.info({
        //     message: result.message
        // });
        // return result.data;
    };


    return { upload, download };
};