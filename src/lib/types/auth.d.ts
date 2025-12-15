export type LoginResponse = {
    token: string;
    user: {
        _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    };
}


export type LoginFields = {
    email: string;
    password: string;
}