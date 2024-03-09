"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import { auth } from '@/middlewares/auth.middleware';
import { Breadcrumb } from 'antd';
import React from 'react'

const Dashboard = () => {
    auth();
    return (
        <main>
            <Breadcrumbs items={[{label : 'Dashboard', to : '/dashboard'}]} />
            <div> Welcome </div>
        </main>
    )
}

export default Dashboard;
