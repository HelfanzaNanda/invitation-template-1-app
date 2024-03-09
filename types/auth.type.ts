export type LoginInput = {
    email?: string;
    password?: string;
}

export type Jwt = {
    tokenType : string;
    expiresIn : string;
    accessToken : string;
    refreshToken : string;
}
export type User = {
    id: number;
    name: string;
    email: string;
    role : string;
}


export type LoginResult = {
    user : User;
    jwt : Jwt;
}
