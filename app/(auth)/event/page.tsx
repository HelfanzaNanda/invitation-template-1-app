"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import { range } from '@/helpers/array.helper';
import { useEvent } from '@/hooks/useEvent';
import { useGift } from '@/hooks/useGift';
import { auth } from '@/middlewares/auth.middleware';
import { FormType, FormTypeCreate, FormTypeEdit } from '@/types/global.type';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, List, Modal } from 'antd';
import dayjs from 'dayjs';
import React from 'react'

const { confirm } = Modal;


const Event = () => {

    auth();
    const { data, remove, create, find, update } = useEvent({ 
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
            // console.log('DATE : ', dayjs(data.date));
            const datetime = `${data.date} ${data.time}`;
            form.setFieldsValue({...data, date : dayjs(datetime)});
            setModal(true);
        }
    }


    const handleSubmit = async () => {
        const fields = await form.validateFields();
        const params = {
            ...fields,
            date : dayjs(fields.date).format('YYYY-MM-DD'),
            time : dayjs(fields.date).format('HH:mm'),
        }
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
            <Breadcrumbs items={[{label : 'Event', to : '/event'}]} />

            <div className='bg-white h-full p-3 rounded-md'>
                <List
                    header={
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold'>Event</span>
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
                                title={item.title}
                                description={
                                 <>
                                    <span>Date : {item.date}:{item.time} | </span>
                                    <span>Location : {item.location} | </span>
                                    <span>Maps : <a href={item.maps}>{item.maps}</a></span>
                                 </>   
                                }
                            />
                        </List.Item>
                    )}
                />
                
            </div>


            <Modal
                title={<span className='uppercase'>{formType} Event</span>}
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
                    <Form.Item label={"Date"} name={'date'} rules={[{ required : true, message : "field is required" }]}>
                        <DatePicker 
                            className='w-full' 
                            showTime={{ 
                                minuteStep : 15,
                                disabledTime : () => ({
                                    disabledHours : () => range(0, 24).filter(n => n < 8 || n > 20),
                                    disabledSeconds : () => range(1, 60)
                                }),
                             }}
                            disabledDate={(current) => current && current < dayjs().subtract(1, 'day').endOf('day')} 
                        />
                    </Form.Item>
                    <Form.Item label={"Location"} name={'location'} rules={[{ required : true, message : "field is required" }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label={"Maps"} name={'maps'} rules={[{ required : true, message : "field is required" }]}>
                        <Input.TextArea />
                    </Form.Item>

                </Form>

            </Modal>

        </main>
    )
}

export default Event;
