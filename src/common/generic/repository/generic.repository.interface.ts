export interface GenericRepository<T, R> {
  create(itemDto: T): Promise<R>;

  getById(id: string): Promise<R>;

  updateById(id: string, itemDto: Partial<T>): Promise<Partial<R>>;

  deleteById(id: string): Promise<Partial<R>>;
}
