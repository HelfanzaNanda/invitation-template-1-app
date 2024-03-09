import { Section, SectionChild, SectionField } from "@/types/section.type";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, FormInstance, Input, InputNumber, Space, Upload } from "antd";
import React from "react";

interface Props {
    section : Section;
    // title : string;
    addNewFields : (section : Section, sectionField : SectionField) => void;
}

const STRING = "string";
const DATE = "date";
const FOREIGNID = "foreign_id";
const TEXT = "text";
const ARRAY = "array";

const { TextArea } = Input;

const SectionForm : React.FC<Props> = ({ section, addNewFields }) => {

    // const [items, setItems] = React.useState<SectionField[]>([]);


    // React.useEffect(() => {
    //     setItems(fields);
    // }, [fields]);

    // const addNewFields = (section : SectionField) => {
    //     const newObject : SectionChild = section.children[0];

    //     setItems(prev => {
    //         const is = prev;
    //         const item = is.find(i => i.field == section.field);
    //         if (item) {
    //             item.children.push(newObject);
    //         }
    //         return is;
    //     });

    //     console.log('items : ', items);
        
    // }

    return section.fields?.map((item, index) => {
        // console.log('item :', item);
        
        return (
            <div key={index}>
                {
                    item.type == STRING &&
                    <Form.Item label={item.field} name={item.field} rules={[{required : true}]}>
                        <Input/>
                    </Form.Item>
                }
                {
                    item.type == DATE &&
                    <Form.Item label={item.field} name={item.field} rules={[{required : true}]}>
                        <DatePicker className="w-full"/>
                    </Form.Item>
                }
                {
                    item.type == FOREIGNID &&
                    <Form.Item label={item.field} name={item.field} rules={[{required : true}]}>
                        <Upload className="!w-full">
                            <Button className="!w-full" icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                }
                {
                    item.type == TEXT &&
                    <TextArea/>
                }
                {
                    item.type == ARRAY &&
                    <Form.Item label={"Children"}>
                        <Form.List name={"children"} initialValue={item.children}>
                            {( fields ) => {
                                return (
                                    <div className="ms-10">
                                        {fields.map(({ key, name }) => {
                                            const children = item.children.at(key)?.child!!;
                                            return children.map((child, index) => (
                                                <div key={index}>
                                                    {
                                                        child.type == STRING &&
                                                        <Form.Item label={child.field} name={[name, child.field]} rules={[{required : true}]}>
                                                            <Input/>
                                                        </Form.Item>
                                                    }
                                                    {
                                                        child.type == DATE &&
                                                        <Form.Item label={child.field} name={[name, child.field]} rules={[{required : true}]}>
                                                            <DatePicker className="w-full"/>
                                                        </Form.Item>
                                                    }
                                                    {
                                                        child.type == FOREIGNID &&
                                                        <Form.Item label={child.field} name={[name, child.field]} rules={[{required : true}]}>
                                                            <Upload className="!w-full">
                                                                <Button className="!w-full" icon={<UploadOutlined />}>Click to Upload</Button>
                                                            </Upload>
                                                        </Form.Item>
                                                    }
                                                    {
                                                        child.type == TEXT &&
                                                        <TextArea/>
                                                    }
                                                    {
                                                        ((children.length - 1) == index) &&
                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => addNewFields(section, item)} block icon={<PlusOutlined />}> Add field </Button>
                                                        </Form.Item>
                                                    }
                                                </div>
                                            ))
                                        })}
                                        
                                    </div>
                                )
                            }}
                        </Form.List>
                    </Form.Item>
                }
            </div>
        )
    })
}
export default SectionForm;