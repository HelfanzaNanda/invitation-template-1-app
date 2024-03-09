export type MetaResponse = {
    http_code?: number;
    page?: number;
    perPage?: number;
    totalPage?: number;
    total?: number;
    hasNextPage?: boolean;
    sql?: string;
}

// export type ErrorResponse = {
//     field: string;
//     message: string;
// }

declare const StatusTypes: readonly ["success", "failed"];
type StatusType = typeof StatusTypes[number];

export type GlobalResponse<T> = {
    message?: string;
    data?: T;
    meta?: MetaResponse;
    status?: boolean;
    validations?: Object;
}