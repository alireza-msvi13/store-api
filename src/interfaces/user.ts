interface IBaseUserInfo {
    username: string;
    email: string;
    phone: string;
    password: string;
    role?: "ADMIN" | "USER";
}

interface IUser extends IBaseUserInfo {
    _id: string;
    province?: string;
    city?: string;
    address?: string;
    postalCode?: string;
}


export { IUser, IBaseUserInfo }