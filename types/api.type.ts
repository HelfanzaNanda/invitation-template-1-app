export type MetaResponse = {
    http_code?: number;
    page?: number;
    perPage?: number;
    totalPage?: number;
    total?: number;
    hasNextPage?: boolean;
    sql?: string;
}

export type GlobalResponse<T> = {
    message?: string;
    data?: T;
    meta?: MetaResponse;
    status?: boolean;
    validations?: Validation;
}


export type ParamsPaginate = {
    page?: number;
    perPage?: number;
    filter? : Object;
    sort? : Object;
}

export type Validation = {
    [key : string] : string[];
}