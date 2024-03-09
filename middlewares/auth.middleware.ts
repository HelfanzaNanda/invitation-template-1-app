import { getJwtToken } from "@/helpers/auth.helper";


export const auth = async () => {
    const token = getJwtToken();
    if (!token) {
        if (typeof window !== 'undefined') {
            location.replace('/');
        }
    }
}

export const guest = async () => {
    const token = getJwtToken();
    if (token) {
        if (typeof window !== 'undefined') {
            location.replace('/dashboard');
        }
    }
}