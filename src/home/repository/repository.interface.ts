import { CreateHomeDto, HomeFilterDto, Image, MessageDto } from "../controller/home.dto";

export interface GenericRepository<T, R> {
  create(itemDto: T): Promise<R>;

  getById(id: number): Promise<R>;

  updateById(id: number, updateHomeDto: Partial<T>): Promise<Partial<R>>;

  deleteById(id: number): Promise<Partial<R>>;
}

export interface IHomeRepository<R> extends GenericRepository<CreateHomeDto, R> {
  getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<any>;
}

export interface IImageRepository {
  createImages(images: Image[]): void;
}

export interface IMessageRepository<R> extends GenericRepository<MessageDto, R> {
  getAllMessagesByHomeId(homeId: number): Promise<MessageDto[]>;
}
