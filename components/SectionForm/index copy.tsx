import { SectionField } from "@/types/section.type";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, FormInstance, Input, InputNumber, Space, Upload } from "antd";
import React from "react";

interface Props {
    fields : SectionField[];
}

const STRING = "string";
const DATE = "date";
const FOREIGNID = "foreign_id";
const TEXT = "text";

const { TextArea } = Input;

const SectionForm : React.FC<Props> = ({ fields }) => {
    const datatypes = datatype.split('|');
    // const [children, setChildren] = React.useState<{ [key : string] : any }[]>([]);
    return (
        datatypes.map((item, index) => {
            let [ field, type] = item.split(':');
            // if (field == 'gifts') {
            // }
            type = type.split('(').shift()!!;

            // let children: any[] | undefined = [];
            let children: any[] | undefined = [];

            if (type == "array") {

                var child = item.substring(item.indexOf("(") + 1, item.lastIndexOf(")"));

                let childFields = child.split(',');
                const childs: { [key : string] : any } = {};
                childFields.forEach(c => {
                    let [ childField, childType] = c.split(':');
                    // const i = {
                    //     field : childField,
                    //     type : childType,
                    //     value : null
                    // }    
                    childs[childField] = childType;
                })
                
                
                // const child = {
                // };

                // children[]

                // const items = [ ...children, childs];

                // setChildren(items);

                

                children.push(childs);


                // console.log('ayayayyayay');
                // console.log('childField : ', childField);
                // console.log('childType : ', childType);
                
            }

            // if (children.length > 0) {
            //     // form.setFieldsValue({
            //     //     "children" : children
            //     // })
            // }


            console.log('########################');
            console.log('children : ', children);
            console.log('field :', field);
            console.log('type :', type);
            console.log('########################');
            
            return (
                <div key={index}>
                    {
                        type == STRING &&
                        <Form.Item label={field} name={field} rules={[{required : true}]}>
                            <Input/>
                        </Form.Item>
                    }
                    {
                        type == DATE &&
                        <Form.Item label={field} name={field} rules={[{required : true}]}>
                            <DatePicker className="w-full"/>
                        </Form.Item>
                    }
                    {
                        type == FOREIGNID &&
                        <Form.Item label={field} name={field} rules={[{required : true}]}>
                            <Upload className="!w-full">
                                <Button className="!w-full" icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    }
                    {
                        type == TEXT &&
                        <TextArea/>
                    }
                    {/* <p>CHILDREN : {JSON.stringify(children)}</p> */}
                    <Form.List name={"children"} initialValue={children}>
                        {(fields) => {
                            console.log('fields : ', fields);
                            console.log('children : ', children);
                            console.log('field : ', field);
                            console.log('type : ', type);
                            
                            return (
                                <div>
                                {fields.map((field) => (
                                    <Form.Item {...field}>
                                    <Input />
                                    </Form.Item>
                                ))}
                                </div>
                            )
                        }}
                    </Form.List>
                    {/* {
                        children.length > 0 && children.map((child, index) => (
                            <div key={index}>
                                {
                                    child.type == STRING &&
                                    <Form.Item label={child.field} name={child.field} rules={[{required : true}]}>
                                        <Input/>
                                    </Form.Item>
                                }
                                {
                                    child.type == DATE &&
                                    <Form.Item label={child.field} name={child.field} rules={[{required : true}]}>
                                        <DatePicker className="w-full"/>
                                    </Form.Item>
                                }
                                {
                                    child.type == FOREIGNID &&
                                    <Form.Item label={child.field} name={child.field} rules={[{required : true}]}>
                                        <Upload className="!w-full">
                                            <Button className="!w-full" icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                }
                                {
                                    child.type == TEXT &&
                                    <TextArea/>
                                }
                            </div>
                        ))
                    } */}
                </div>
            )
        })
        // <div>test</div>
    )
}
export default SectionForm;