"use client"
import '@/styles/global.css'
import { BankOutlined, DashboardOutlined, DollarOutlined, ProfileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs13-progress';
// import { Content, Footer, Header } from 'antd/es/layout/layout';


const { Content, Footer, Header } = Layout;


interface ItemsMenu {
    to : string;
    text : string;
    icon : React.JSX.Element;
    roles : string[];
}

export default function RootLayout({ children, }: { children: React.ReactNode; }) {

    const items : ItemsMenu[] = [
        {
            icon : <DashboardOutlined />,
            text : 'Dashboard',
            to: '/dashboard',
            roles: ['admin', 'user']
        },
        {
            icon : <DollarOutlined />,
            text : 'Gift',
            to: '/gift',
            roles: ['admin', 'user']
        },
        {
            icon : <BankOutlined />,
            text : 'Event',
            to: '/event',
            roles: ['admin', 'user']
        },
        {
            icon : <ProfileOutlined />,
            text : 'Story',
            to: '/story',
            roles: ['admin', 'user']
        },
        {
            icon : <SettingOutlined />,
            text : 'Setting',
            to: '/setting',
            roles: ['admin', 'user']
        },
        {
            icon : <SettingOutlined />,
            text : 'Gallery',
            to: '/gallery',
            roles: ['admin', 'user']
        },
        // {
        //     icon : <ProfileOutlined />,
        //     text : 'Invitation',
        //     to: '/invitation',
        //     roles: ['admin', 'user']
        // },
        // {
        //     icon : <UserOutlined />,
        //     text : 'User',
        //     to: '/user',
        //     roles: ['admin']
        // },
    ];
    const router = useRouter();
    const pathname = usePathname();

    const handleGoToPage = (to : string) => router.push(to);


    return (
        <Layout>
            <Header className='sticky top-0 z-10 w-full flex items-center space-x-3'>
                <div className="demo-logo uppercase font-semibold text-white tracking-[3px] text-xl">invitation</div>
                    {
                        items.map((item, key) => (
                            <div key={key} 
                                className={`
                                    flex items-center px-3 space-x-2
                                    hover:bg-slate-100 hover:text-blue-500 cursor-pointer transition-all duration-150
                                    ${pathname == item.to ? "text-blue-500 bg-slate-100" : "text-gray-300"}
                                `}
                                onClick={() => handleGoToPage(item.to)}>
                                <p>{item.icon}</p>
                                <span>{item.text}</span> 
                            </div>
                        ))
                    }
            </Header>
            <Content className="px-12 h-[calc(100vh-133px)] overflow-y-auto">
                {children}
            </Content>
            <Footer className='text-center'>
                ©{new Date().getFullYear()} Created by Invitation
            </Footer>
        </Layout>
    )
}