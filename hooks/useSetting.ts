import { notification } from 'antd';
import { ApiClient } from '@/clients/ApiClient';
import { Setting } from '@/types/setting.type';
import { handleMessaeApiValidation } from '@/helpers/messageError.helper';
import { camelCaseKeysToUnderscore } from '@/helpers/queryParams.helper';
import camelcaseKeys from 'camelcase-keys';


export const useSetting = () => {

    const path = `setting`;

    const set = async (params: Setting) => {
        const result = await ApiClient.request<Setting>(`${path}`, ApiClient.METHOD_POST, camelCaseKeysToUnderscore(params));
        if (!result.status) {
            handleMessaeApiValidation(result.validations);
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
    };

    const get = async () => {
        const result = await ApiClient.request<Setting>(`${path}`, ApiClient.METHOD_GET);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        return camelcaseKeys(result.data!!, { deep : true });
    };


    return { get, set };
};