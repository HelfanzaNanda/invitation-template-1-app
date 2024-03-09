import useSWR, { KeyedMutator } from 'swr';
import camelcaseKeys from "camelcase-keys";
import { message, notification } from 'antd';
import { ApiClient } from '@/clients/ApiClient';
import { ParamsPaginate } from '@/types/api.type';
import { GlobalResponse } from '@/types/response.type copy';
import qs from "qs";
import { Galleris, Gallery } from '@/types/gallery.type';
import { camelCaseKeysToUnderscore } from '@/helpers/queryParams.helper';
import { handleMessaeApiValidation } from '@/helpers/messageError.helper';

export const all = "all";

declare const PageTypes :readonly [
    number, 
    typeof all, 
];

interface Props {
    swr?: boolean;
    callback?: Function;
    page?: typeof PageTypes[number]
    perPage?: number;
    filter?: Object;
    sort?: {
        column : string;
        dir : string;
    };
}

export const useGallery = (props: Props) => {

    const { swr, callback, page, perPage, filter, sort } = props;
    const path = `galleries`;
    const object: ParamsPaginate = {
        page : page,
        perPage,
    };
    if (filter !== undefined) {
        object.filter = filter;
    }
    if (sort !== undefined) {
        object.sort = sort;
    }
    let error: any = null;
    let mutate: KeyedMutator<GlobalResponse<Array<Galleris[]>>>;
    const params = qs.stringify(object);
    let response: GlobalResponse<Array<Galleris[]>> = {
        message: "",
        data: [],
        meta : {}
    }
    if (swr) {
        const { data: resp, error: err, mutate: mtt } = useSWR<GlobalResponse<Array<Galleris[]>>>(`${path}?${params}`, ApiClient.fetcher, {
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

    // const data = camelcaseKeys(, { deep : true });
    const data = response?.data;



    const create = async (params: Gallery) => {
        const result = await ApiClient.request<Gallery>(`${path}`, ApiClient.METHOD_POST, camelCaseKeysToUnderscore(params));
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
        const result = await ApiClient.request<Gallery>(`${path}/${id}`, ApiClient.METHOD_GET);
        if (!result.status) {
            handleMessaeApiValidation(result.validations);
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        return result.data;
    };

    const update = async (id: Number, params: Gallery) => {
        const result = await ApiClient.request<Gallery>(`${path}/${id}`, ApiClient.METHOD_PUT, camelCaseKeysToUnderscore(params));
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

    const remove = async (id: number) => {
        const result = await ApiClient.request<Gallery>(`${path}/${id}`, ApiClient.METHOD_DELETE);
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

    return { data, error, create, find, update, remove };
};