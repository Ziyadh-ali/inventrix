import { Model, Document, FilterQuery } from "mongoose";
import { IRepository } from "../interfaces/IRepository";

export class BaseRepository<T extends Document> implements IRepository<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findPaginated(
    query: FilterQuery<T> = {},
    options: { limit?: number; skip?: number; sort?: any } = {}
  ): Promise<{ data: T[]; total: number }> {
    const { limit = 10, skip = 0, sort = { createdAt: 1 } } = options;
    console.log(limit)
    const [data, total] = await Promise.all([
      this.model.find(query).skip(skip).limit(limit).sort(sort),
      this.model.countDocuments(query),
    ]);
    return { data, total };
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
