export interface IRepository<T, k = Partial<T>> {
    create(data: k): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<void>;
    findPaginated(
        options: { limit?: number; skip?: number; sort?: any; },
        query?: any
    ): Promise<{ data: T[]; total: number }>
}
