import useSWR, { KeyedMutator } from 'swr';
import camelcaseKeys from "camelcase-keys";
import { message, notification } from 'antd';
import { ApiClient } from '@/clients/ApiClient';
import { Section } from '@/types/section.type';
import { GlobalResponse } from '@/types/api.type';

interface Props {
    initDatatable?: boolean;
    callback?: Function;
    page?: number;
    perPage?: number;
    order?: string[];
    filter?: {
        searchedColumn?: string;
        searchedOperator?: string;
        searchText?: string;
    };
    search?: string;
}

export const useSection = (props: Props) => {

    const { initDatatable, callback, page, perPage, order, filter, search, } = props;

    // const ApiClient = new ApiClient();


    const object: { [key: string]: any } = {
        page,
        per_page: perPage,
    };
    if (search) {
        object['search'] = search;
    }
    // if (order?.length) {
    //     object['order'] = order;
    // }

    // if (filter?.searchText && filter.searchedColumn) {
    //     const f  = {
    //         searchText : filter?.searchText,
    //         searchedColumn : filter?.searchedColumn,
    //         searchedOperator : filter?.searchedOperator,
    //     };
    //     const objFilter = qs.stringify(f);
    //     object['filter'] = objFilter;

    // }

    let error: any = null;
    let mutate: KeyedMutator<GlobalResponse<Section[]>>;
    const params = new URLSearchParams(object).toString();
    let response: GlobalResponse<Section[]> = {
        // meta: {
        //     http_code: 0,
        //     page: 0,
        //     perPage: 0,
        //     totalPage: 0,
        //     total: 0,
        //     hasNextPage: false
        // },
        message: '',
        data: []
    }
    if (initDatatable) {
        const { data: resp, error: err, mutate: mtt } = useSWR<GlobalResponse<Section[]>>(`employees`, ApiClient.fetcher, {
            onSuccess: (data, key) => {
                if (!data?.status) {
                    message.error(data?.message);
                }
                if (callback) callback();
            },
            // onError(err, key, config) {
            //     console.log('onError : ', err);
            // },
            // onErrorRetry(err, key, config, revalidate, revalidateOpts) {
            //     console.log('onErrorRetry : ', err);
            // },
        });
        
        console.log('ERR : ', err);
        console.log('resp : ', resp);
        
        response = resp!!;
        error = err;
        mutate = mtt;
    }

    const data = camelcaseKeys(response?.data!!);
    // const meta = camelcaseKeys(response?.meta);

    const getAll = async () => {
        const result = await ApiClient.request<Section[]>(`section`, ApiClient.METHOD_GET);
        return result.data;
    };

    const create = async (params: Section) => {
        const result = await ApiClient.request<Section>('create', ApiClient.METHOD_POST, params);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        mutate.apply('employees');
    };

    const find = async (id: Number) => {
        const result = await ApiClient.request<Section>(`employees/${id}`, ApiClient.METHOD_GET, params);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        return result.data;
    };

    const update = async (id: Number, params: Section) => {
        const result = await ApiClient.request<Section>(`employees/${id}`, ApiClient.METHOD_PATCH, params);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        mutate.apply('employees');

    };

    const remove = async (id: number) => {
        const result = await ApiClient.request<Section>(`employees/${id}`, ApiClient.METHOD_DELETE);
        if (!result.status) {
            const message = result.message;
            notification.error({ message })
            throw new Error(message);
        }
        notification.info({
            message: result.message
        });
        mutate.apply('employees');
    };

    return { data, error, getAll, create, find, update, remove };
};