import { GenericRepository } from "../../../common/generic/repository/generic.repository.interface";
import { UserDto } from "../service/user.dto";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepository<R> extends GenericRepository<UserDto, R> {
  findUserByEmail(email: string): Promise<R>;
}

export class userRepositoryMongoDb implements IUserRepository<UserDto> {
  findUserByEmail(email: string): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }
  create(itemDto: UserDto): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }
  updateById(id: string, updateHomeDto: Partial<UserDto>): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }
}

export class userRepositoryPrisma implements IUserRepository<UserDto> {
  findUserByEmail(email: string): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }
  create(itemDto: UserDto): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<UserDto> {
    throw new Error("Method not implemented.");
  }
  updateById(id: string, updateHomeDto: Partial<UserDto>): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<Partial<UserDto>> {
    throw new Error("Method not implemented.");
  }
}
