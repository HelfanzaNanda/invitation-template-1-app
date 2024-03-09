import { GetProp, UploadProps } from "antd";


export const FormTypeCreate = "CREATE";
export const FormTypeEdit = "EDIT";
export const FormTypeDetail = "DETAIL";

declare const FormTypes :readonly [
    typeof FormTypeCreate, 
    typeof FormTypeEdit, 
    typeof FormTypeDetail, 
    null
];
export type FormType = typeof FormTypes[number];

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
