export interface User {
    id: string,
    email: string,
}
export interface UserLogin {
    id: string,
    email: string,
    accessToken: string,
}
export interface LoginData {
    email: string,
    password: string,
}

export interface LoginResponse {
    user: {
        _id: string,
        email: string;
    }
    accessToken: string;
    refreshToken: string;
    message: string;
}
export interface SignupResponse {
    user: {
        _id: string,
        email: string;
    }
    message: string;
}

export interface ICustomer {
    _id: string,
    name: string;
    address: string;
    mobile: number;
}

export interface Response {
    customer: ICustomer,
    message: string;
}

export interface IItem {
    _id : string;
    name: string;
    description: string;
    quantity: number;
    price: number;
}

export interface ISale {
    _id : string;
    date: Date,
    items: {
        name : string,
        quantity : number,
        price : number,
    }[],
    customerName: string;
}

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};