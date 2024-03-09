import { ApiClient } from '@/clients/ApiClient';
import { LoginInput, LoginResult } from '@/types/auth.type';
import { notification } from 'antd';
import camelcaseKeys from "camelcase-keys";


interface Props {
    callback? : Function;
    limit? : number;
    offset? : number;
    order? : string[];
    filter? : {
        searchedColumn? : string;
        searchedOperator? : string;
        searchText? : string;
    };
    search? : string;
}

export const useAuth = (props : Props) => {

    let error = null;

    const login = async (params: LoginInput) => {
        const result = await ApiClient.request<LoginResult>('login', ApiClient.METHOD_POST, params);
        if (!result.status) {
            // const message = result?.validations?.length ? result.validations[0].message : result?.message;
            const message = result?.message;
            notification.error({ message });
            throw new Error(message);
        }
        notification.success({
            message : result?.message
        })
        return camelcaseKeys(result.data!!);
    };


    const logout = async () => {
        const params = {};
        const result = await ApiClient.request<LoginResult>('logout', ApiClient.METHOD_POST, params);
        if (!result.status) {
            notification.error({
                message : result.message
            });
        }
        notification.success({
          message : result.message
        })
    };
    return { error, login, logout };
};