import { CreateHomeDto, HomeFilterDto, Image, MessageDto } from "../home.dto";

export interface GenericRepository<T> {
  create(itemDto: T): Promise<T>;

  getById(id: number): Promise<T>;

  updateById(id: number, updateHomeDto: Partial<T>): Promise<Partial<T>>;

  deleteById(id: number): Promise<Partial<T>>;
}

export interface IHomeRepository extends GenericRepository<CreateHomeDto> {
  getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<any>;
}

export interface IImageRepository {
  createImages(images: Image[]): void;
}

export interface IMessageRepository extends GenericRepository<MessageDto> {
  getAllMessagesByHomeId(homeId: number): Promise<MessageDto[]>;
}
