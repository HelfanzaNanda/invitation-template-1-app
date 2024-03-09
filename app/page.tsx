"use client"

import { useAuth } from "@/hooks/useAuth";
import { guest } from "@/middlewares/auth.middleware";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {

    guest();

    const { login } = useAuth({});
    const authStore = useAuthStore();
    const router = useRouter();

    const [form] = Form.useForm();

    const handleLogin = async () => {
        const params = await form.validateFields();
        const res = await login(params);
        authStore.setAuth(res);
        router.push('/dashboard');
    }

    return (
        <main className="bg-gray-100 w-screen h-screen  flex items-center justify-center">
            <div className="grid grid-cols-2 h-3/6 w-4/6 rounded-2xl shadow-md">
                <div className="bg-white rounded-s-2xl">
                    <div className="px-20 flex flex-col justify-center h-full">
                        <div className="mb-5">
                            <div className="text-2xl font-semibold ">Welcome</div>
                            <span className="text-xs">Enter your password to access the admin.</span>
                        </div>
                        <Form
                            form={form}
                            name="basic"
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="email"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item className="flex justify-end">
                                <Button onClick={handleLogin} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className="bg-[#001529] tracking-[10px] uppercase font-semibold rounded-e-2xl text-white text-5xl flex items-center justify-center">
                    <span>invitation</span>
                </div>
            </div>
        </main>
    );
}
