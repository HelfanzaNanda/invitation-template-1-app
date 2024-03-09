"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import { useGallery } from '@/hooks/useGallery';
import { useMedia } from '@/hooks/useMedia';
import { auth } from '@/middlewares/auth.middleware';
import { FormType, FormTypeCreate, FormTypeEdit } from '@/types/global.type';
import { DeleteOutlined, ExclamationCircleFilled, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Form, Image, Modal, Space, Tooltip, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React from 'react'

const { confirm } = Modal;


const Gallery = () => {

    auth();
    const { data, remove, create, find, update } = useGallery({ swr : true, page : "all" });
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
    
    const handleSubmit = async () => {
        const params = await form.validateFields();
        delete params.file;
        params['mediaUuid'] = form.getFieldValue("mediaUuid");
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
                document.querySelector('.ant-image-preview-operations-wrapper')?.remove();
                document.querySelector('.ant-image-preview-root')?.remove();
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
            <Breadcrumbs items={[{label : 'Gallery', to : '/gallery'}]} />

            <div className='bg-white p-5 flex flex-col space-y-5'>
                <div className='flex items-center justify-between'>
                    <span className='font-semibold'>Gallery</span>
                    <div className='flex'>
                        <Button type='primary' onClick={() => handleCreate()}>Create</Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {
                        data?.map((items, index) => (
                            <div className="grid gap-4" key={index}>
                                {
                                    items.map((item, idx) => (
                                        <div key={idx}>
                                            <Image 
                                                src={item.media.fileurl}

                                                preview={{
                                                    toolbarRender: ( _, { 
                                                        transform: { scale, }, 
                                                        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn }, 
                                                    }, ) => (
                                                    <Space size={12} className="toolbar-wrapper">
                                                        <Tooltip title={"Flip Y"}>
                                                            <SwapOutlined className='text-2xl' rotate={90} onClick={onFlipY} />
                                                        </Tooltip>
                                                        <Tooltip title={"Flip X"}>
                                                            <SwapOutlined className='text-2xl' onClick={onFlipX} />
                                                        </Tooltip>
                                                        <Tooltip title={"Rotate Left"}>
                                                            <RotateLeftOutlined className='text-2xl' onClick={onRotateLeft} />
                                                        </Tooltip>
                                                        <Tooltip title={"Rotate Right"}>
                                                            <RotateRightOutlined className='text-2xl' onClick={onRotateRight} />
                                                        </Tooltip>
                                                        <Tooltip title={"Delete"}>
                                                            <DeleteOutlined className='text-2xl' onClick={() => handleDelete(item.id)} />
                                                        </Tooltip>
                                                        <Tooltip title={"Zoom Out"}>
                                                            <ZoomOutOutlined className='text-2xl' disabled={scale === 1} onClick={onZoomOut} />
                                                        </Tooltip>
                                                        <Tooltip title={"Zoom in"}>
                                                            <ZoomInOutlined className='text-2xl' disabled={scale === 50} onClick={onZoomIn} />
                                                        </Tooltip>
                                                    </Space>
                                                    ),
                                                }}/>
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>

            </div>


            <Modal
                title={<span className='uppercase'>{formType} Gallery</span>}
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
                </Form>
            </Modal> 
        </main>
    )
}

export default Gallery;
