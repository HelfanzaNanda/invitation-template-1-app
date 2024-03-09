import { FilterValue } from "antd/es/table/interface";
import { MetaResponse } from "./api.type";


export interface TableParams {
    page?: number;
    perPage?: number;
    sortField?: string | null;
    sortOrder?: string | null;
    filters?: Record<string, FilterValue | null>;
}

export interface SortParams {
    [key: string]: string | null | undefined;
}

export interface FilterParams {
    column: string;
    operator?: string;
    value: string;
}



export interface HeaderDatatable {
    id: string;
    header: string;
    enableSorting?: boolean;
    render?: (value: any) => void;
    show?: boolean;
    search?: boolean;
    filtered?: boolean;
    width?: number;
    fixed?: string;
}

export interface RequestDatatable {
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


export interface Hooks {
    (params?: RequestDatatable): {
        data: any[],
        meta: MetaResponse,
        isLoading: boolean,
        create?: (params: any) => Promise<void>,
        find?: (id: number) => Promise<void>,
        update?: (id: number, params: any) => Promise<void>,
        remove?: (id: number) => Promise<void>,
    }
}

export interface ParamsDatatable {
    title: string;
    columns: any[];
    hooks: any;
    scroll?: { x?: string | number | true | undefined; y?: string | number | undefined; } & { scrollToFirstRowOnChange?: boolean | undefined; }
} 