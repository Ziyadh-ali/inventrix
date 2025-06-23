

export interface ISale {
    date: Date,
    items: {
        name: string,
        quantity: number,
        price: number
    }[],
    customerName: string;
}