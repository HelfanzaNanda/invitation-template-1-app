"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import { useMedia } from '@/hooks/useMedia';
import { useStory } from '@/hooks/useStory';
import { auth } from '@/middlewares/auth.middleware';
import { FormType, FormTypeCreate, FormTypeEdit } from '@/types/global.type';
import { ExclamationCircleFilled, InstagramOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Descriptions, DescriptionsProps, Form, Image, Input, List, Modal, Upload, UploadFile } from 'antd';
import Meta from 'antd/es/card/Meta';
import { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React from 'react'
import Bride from './components/Bride';
import { useSetting } from '@/hooks/useSetting';
import { Setting } from '@/types/setting.type';
import Detail from './components/Detail';


const Setting = () => {

    auth();
    const { get } = useSetting();
    const [setting, setSetting] = React.useState<Setting>({});


    const handleGetData = async () => {
        const data = await get();
        setSetting(data);
    }

    React.useEffect(() => {
        (async () => {
            await handleGetData()
        })()
    }, []);

    

    return (
        <main >
            <Breadcrumbs items={[{label : 'Story', to : '/story'}]} />

            <div className='space-y-3'>
                <div className='grid grid-cols-2 space-x-3'>
                    <Bride title='Mempelai Pria' data={setting} type='GROOM' mutate={handleGetData} />
                    <Bride title='Mempelai Wanita' data={setting} type='BRIDE' mutate={handleGetData} />
                </div>

                <Detail title='Detail' data={setting} mutate={handleGetData} />

                
            </div>


        </main>
    )
}

export default Setting;
