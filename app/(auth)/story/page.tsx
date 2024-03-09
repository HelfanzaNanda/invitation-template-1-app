"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import { useMedia } from '@/hooks/useMedia';
import { useStory } from '@/hooks/useStory';
import { auth } from '@/middlewares/auth.middleware';
import { FormType, FormTypeCreate, FormTypeEdit } from '@/types/global.type';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Image, Input, List, Modal, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React from 'react'

const { confirm } = Modal;


const Story = () => {

    auth();
    const { data, remove, create, find, update } = useStory({ swr : true });
    const { upload, download } = useMedia();

    const [modal, setModal] = React.useState<boolean>(false);
    const [formType, setFormType] = React.useState<FormType>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);

    const handleCreate = () => {
        setFormType(FormTypeCreate);
        form.resetFields();
        setModal(true);
    }
    const handleCancel = () => {
        setFileList([]);
        setFormType(null);
        form.resetFields();
        setModal(false);
    }

    
    const handleEdit = async (id : number) => {
        setFormType(FormTypeEdit);
        const data = await find(id);
        if (data?.id) {
            const file = await download(data.media?.uuid!!, data.media?.originalName!!);
            const uploadedFile : UploadFile = {
                uid : data.media?.uuid!!,
                name : data.media?.originalName!!,
                originFileObj : file as RcFile
            };
            setFileList([uploadedFile]);

            const item = {
                id : data.id,
                title : data.title,
                caption : data.caption,
                year : dayjs(data.year),
                mediaUuid : data.media?.uuid,
            }
            form.setFieldsValue(item);
            setModal(true);
        }
    }


    const handleSubmit = async () => {
        const params = await form.validateFields();
        delete params.file;
        params['mediaUuid'] = form.getFieldValue("mediaUuid");
        params['year'] = dayjs(params.year).format('YYYY');
        const id = form.getFieldValue("id");
        formType == FormTypeEdit ? await update(id, params) : await create(params);
        handleCancel();
    }

    const handleDelete = (id : number) => {
        confirm({
            title: 'Are you sure delete this data?',
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                await remove(id);
            },
            onCancel() {},
        });
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
        <main >
            <Breadcrumbs items={[{label : 'Story', to : '/story'}]} />

            <div className='bg-white h-full p-3 rounded-md'>
                <List
                    header={
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold'>Story</span>
                            <div className='flex'>
                                <Button type='primary' onClick={() => handleCreate()}>Create</Button>
                            </div>
                        </div>
                    }
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item actions={[
                            <Button onClick={() => handleEdit(item.id!!)}>Edit</Button>,
                            <Button danger onClick={() => handleDelete(item.id!!)}>Delete</Button>
                        ]} >
                            <List.Item.Meta
                                avatar={
                                    <Image 
                                        width={150}
                                        height={150}
                                        src={item.media?.fileurl}
                                    />
                                }
                                title={item.title}
                                description={
                                 <div className='flex flex-col'>
                                    <span>Year : {item.year}</span>
                                    <span>Caption : {item.caption}</span>
                                 </div>   
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>


            <Modal
                title={<span className='uppercase'>{formType} Story</span>}
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
                    <Form.Item label={"Title"} name={'title'} rules={[{ required : true, message : "field is required" }]}>
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
                    <Form.Item label={"Year"} name={'year'} rules={[{ required : true, message : "field is required" }]}>
                        <DatePicker className='w-full' picker='year' />
                    </Form.Item>

                </Form>
            </Modal>
        </main>
    )
}

export default Story;
