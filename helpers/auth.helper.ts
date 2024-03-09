export const getJwtToken = ()  => {
    if (typeof window !== 'undefined') {
        const str = localStorage.getItem('authStore');
        if (str) {
            const obj = JSON.parse(str);
            const accessToken = obj?.state?.auth?.jwt?.access_token;
            return accessToken;
        }
        return null;
    }
    return null;
}

export const isLogin = () => {
    const token = getJwtToken();
    return token ? true : false;
}

export const removeAuth = ()  => {
    localStorage.removeItem('authStore');

}