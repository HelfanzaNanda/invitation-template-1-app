import useSWR, { KeyedMutator } from 'swr';
import camelcaseKeys from "camelcase-keys";
import { message, notification } from 'antd';
import { ApiClient } from '@/clients/ApiClient';
import { Gift } from '@/types/gift.type';
import { ParamsPaginate } from '@/types/api.type';
import { GlobalResponse } from '@/types/response.type copy';
import qs from "qs";
import { handleMessaeApiValidation } from '@/helpers/messageError.helper';
import { camelCaseKeysToUnderscore } from '@/helpers/queryParams.helper';

interface Props {
    swr?: boolean;
    callback?: Function;
    page?: number;
    perPage?: number;
    filter?: Object;
    sort?: {
        column : string;
        dir : string;
    };
}

export const useGift = (props: Props) => {

    const { swr, callback, page, perPage, filter, sort } = props;
    const path = `gifts`;
    const object: ParamsPaginate = {
        page,
        perPage,
    };
    if (filter !== undefined) {
        object.filter = filter;
    }
    if (sort !== undefined) {
        object.sort = sort;
    }
    let error: any = null;
    let mutate: KeyedMutator<GlobalResponse<Gift[]>>;
    const params = qs.stringify(camelCaseKeysToUnderscore(object));
    console.log('params :', params);
    
    let response: GlobalResponse<Gift[]> = {
        message: "",
        data: [],
        meta : {}
    }
    if (swr) {
        const { data: resp, error: err, mutate: mtt } = useSWR<GlobalResponse<Gift[]>>(`${path}?${params}`, ApiClient.fetcher, {
            onSuccess: (data, key) => {
                if (!data?.status) {
                    message.error(data?.message);
                }
                if (callback) callback();
            },
        });
        
        response = resp!!;
        error = err;
        mutate = mtt;
    }

    const data = camelcaseKeys(response?.data!!);
    const meta = camelcaseKeys(response?.meta!!);


    const create = async (params: Gift) => {
        const result = await ApiClient.request<Gift>(`${path}`, ApiClient.METHOD_POST, camelCaseKeysToUnderscore(params));
        if (!result.status) {
            handleMessaeApiValidation(result.validations);
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        mutate.apply(`${path}`);
    };

    const find = async (id: Number) => {
        const result = await ApiClient.request<Gift>(`${path}/${id}`, ApiClient.METHOD_GET);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        return camelcaseKeys(result.data!!);
    };

    const update = async (id: Number, params: Gift) => {
        const result = await ApiClient.request<Gift>(`${path}/${id}`, ApiClient.METHOD_PUT, camelCaseKeysToUnderscore(params));
        if (!result.status) {
            handleMessaeApiValidation(result.validations);
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        mutate.apply(`${path}`);

    };

    const remove = async (id: number) => {
        const result = await ApiClient.request<Gift>(`${path}/${id}`, ApiClient.METHOD_DELETE);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        mutate.apply(`${path}`);
    };

    return { data, meta, error, create, find, update, remove };
};