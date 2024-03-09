"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import { useGift } from '@/hooks/useGift';
import { auth } from '@/middlewares/auth.middleware';
import { FormType, FormTypeCreate, FormTypeEdit } from '@/types/global.type';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, List, Modal, Pagination } from 'antd';
import React from 'react'

const { confirm } = Modal;


const Gift = () => {

    auth();
    const { data, meta, remove, create, find, update } = useGift({ 
        swr : true,
        page : 1,
        perPage : 10
    });    

    const [modal, setModal] = React.useState<boolean>(false);
    const [formType, setFormType] = React.useState<FormType>(null);
    const [form] = Form.useForm();

    const handleCreate = () => {
        setFormType(FormTypeCreate);
        form.resetFields();
        setModal(true);
    }
    const handleCancel = () => {
        setFormType(null);
        form.resetFields();
        setModal(false);
    }

    
    const handleEdit = async (id : number) => {
        setFormType(FormTypeEdit);
        const data = await find(id);
        
        if (data?.id) {
            form.setFieldsValue({...data});
            setModal(true);
        }
    }


    const handleSubmit = async () => {
        const params = await form.validateFields();
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

    return (
        <main >
            <Breadcrumbs items={[{label : 'Gift', to : '/gift'}]} />

            <div className='bg-white h-full p-3 rounded-md'>
                <List
                    header={
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold'>Gift</span>
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
                                title={item.bankName}
                                description={
                                 <>
                                    <span>Nomor Rekening : {item.accountNumber} | </span>
                                    <span>Atas Nama : {item.accountName}</span>
                                 </>   
                                }
                            />
                        </List.Item>
                    )}
                />
                <div className='flex justify-end'>
                    <Pagination defaultCurrent={meta?.page} total={meta?.total} />
                </div>
            </div>


            <Modal
                title={<span className='uppercase'>{formType} Gift</span>}
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
                    <Form.Item label={"Bank Name"} name={'bankName'} rules={[{ required : true, message : "field is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={"Account Name"} name={'accountName'} rules={[{ required : true, message : "field is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={"Account Number"} name={'accountNumber'} rules={[{ required : true, message : "field is required" }]}>
                        <Input />
                    </Form.Item>

                </Form>

            </Modal>

        </main>
    )
}

export default Gift;
