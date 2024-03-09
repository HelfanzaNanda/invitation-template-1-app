import { create } from "zustand";
import { devtools, persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { LoginResult } from "@/types/auth.type";


interface AuthState {
    auth : LoginResult;
    setAuth : (data : LoginResult) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            auth : {
                jwt: {
                    accessToken: "",
                    expiresIn: "",
                    refreshToken: "",
                    tokenType: ""
                },
                user: {
                    id: 0,
                    name: "",
                    email: "",
                    role: ""
                }
            },
            setAuth: (data: LoginResult) => set({ auth : data }),
        }), 
        {
            name: "authStore",
        }
    )
);

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('AuthStore', useAuthStore);
} 