import { useMedia } from "@/hooks/useMedia";
import { useSetting } from "@/hooks/useSetting";
import { Setting } from "@/types/setting.type";
import { EditOutlined, InstagramOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Modal, UploadFile } from "antd";
import Upload, { RcFile } from "antd/es/upload";
import React from "react";
import { UploadRequestOption } from 'rc-upload/lib/interface';

const BRIDE = "BRIDE";
const GROOM = "GROOM";

declare const TYPES : readonly [ typeof BRIDE, typeof GROOM ]

interface Props {
    title : string;
    data : Setting;
    type : typeof TYPES[number];
    mutate : () => void;
}

const Bride : React.FC<Props> = ( { title, data, type, mutate } ) => {

    const [modal, setModal] = React.useState<boolean>(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);


    const { get, set } = useSetting();
    const { upload, download } = useMedia();
    


    const handleCancel = () => {
        setFileList([]);
        form.resetFields();
        setModal(false);
    }

    
    const handleEdit = async () => {
        const data = await get();
        if (data?.id) {
            if (type == GROOM) {
                const file = await download(data.groomPhoto?.uuid!!, data.groomPhoto?.originalName!!);
                const uploadedFile : UploadFile = {
                    uid : data.groomPhoto?.uuid!!,
                    name : data.groomPhoto?.originalName!!,
                    originFileObj : file as RcFile
                };
                setFileList([uploadedFile]);
    
                const item = {
                    id : data.id,
                    name : data.groom,
                    instagram : data.groomInstagram,
                    caption : data.groomCaption,
                    mediaUuid : data.groomPhoto?.uuid,
                    file : data.groomPhoto
                }
                form.setFieldsValue(item);
            }
            if (type == BRIDE) {
                const file = await download(data.bridePhoto?.uuid!!, data.bridePhoto?.originalName!!);
                const uploadedFile : UploadFile = {
                    uid : data.bridePhoto?.uuid!!,
                    name : data.bridePhoto?.originalName!!,
                    originFileObj : file as RcFile
                };
                setFileList([uploadedFile]);
    
                const item = {
                    id : data.id,
                    name : data.bride,
                    instagram : data.brideInstagram,
                    caption : data.brideCaption,
                    mediaUuid : data.bridePhoto?.uuid,
                    file : data.bridePhoto

                }
                form.setFieldsValue(item);
            }
            setModal(true);
        }
    }


    const handleSubmit = async () => {
        const fields = await form.validateFields();

        let params = {};
        if (type == GROOM) {
            params = {
                groom : fields.name,
                groomInstagram : fields.instagram,
                groomCaption : fields.caption,
                groomUuid : form.getFieldValue("mediaUuid"),

            }
        }
        if (type == BRIDE) {
            params = {
                bride : fields.name,
                brideInstagram : fields.instagram,
                brideCaption : fields.caption,
                brideUuid : form.getFieldValue("mediaUuid"),

            }
        }
        await set(params);
        mutate();
        handleCancel();
    }

    const handleChangeFile = async (opt : UploadRequestOption) => {
        const data = await upload(opt.file as File);
        if (data?.uuid) {
            setFileList([opt.file as UploadFile]);   
            form.setFieldsValue({
                "mediaUuid" : data.uuid
            });
        }
    };


    return (
        <>
            <div className="bg-white p-3 rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className='text-lg mb-5 font-semibold'>{title}</div>
                    <Button onClick={() => handleEdit()} type="primary" shape="circle" icon={<EditOutlined/>} />
                </div>

                <div className='flex space-x-4'>
                    <Image
                        className='rounded-md'
                        width={390}
                        src={type == GROOM ? data.groomPhoto?.fileurl : data.bridePhoto?.fileurl}
                    />
                    <div className='flex flex-col space-y-2'>
                        <div className='font-semibold antialiased tracking-wide	'>{type == GROOM ? data.groom : data.bride}</div>
                        <div><InstagramOutlined /> <a href={`https://www.instagram.com/${type == GROOM ? data.groomInstagram : data.brideInstagram}`}>@{type == GROOM ? data.groomInstagram : data.brideInstagram}</a></div>
                        <div>{type == GROOM ? data.groomCaption : data.brideCaption}</div>
                    </div>
                </div>
            </div>

            <Modal
                title={<span className='uppercase'>Edit Setting</span>}
                open={modal}
                onCancel={() => handleCancel()}
                footer={
                    <>
                        <Button key={"cancel"} onClick={() => handleCancel()}>Cancel</Button>
                        <Button key={"submit"} type='primary' onClick={() => handleSubmit()}>Submit</Button>
                    </>
                }
                >
                <Form
                    form={form}
                    layout='vertical'>
                    <Form.Item label={"name"} name={'name'} rules={[{ required : true, message : "field is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={"Instagram"} name={'instagram'} rules={[{ required : true, message : "field is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={"Image"} name={'file'} rules={[{ required : true, message : "field is required" }]}>
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            customRequest={(option) => handleChangeFile(option)}
                            rootClassName='w-full'
                            onRemove={(file) => setFileList([])}>
                            {fileList.length < 1 && (
                                <div className='w-full inline-block border rounded-md cursor-pointer py-1 px-3'>Choose Your Image</div>
                            )}
                            
                        </Upload>
                    </Form.Item>
                    <Form.Item label={"Caption"} name={'caption'} rules={[{ required : true, message : "field is required" }]}>
                        <Input.TextArea />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}

export default Bride;