interface IUser {
    _id: string
    username: string;
    email: string;
    phone: string;
    password: string;
    role: "ADMIN" | "USER";
    province?: string;
    city?: string;
    address?: string;
    postalCode?: string;
}

export { IUser }