import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UserTokenData } from "../../user/user.dto";
import { CreateHomeDto, HomeFilterDto, MessageDto, UpdateHomeDto } from "../controller/home.dto";
import { IHomeRepository, IImageRepository, IMessageRepository } from "../repository/repository.interface";

@Injectable()
export class HomeService {
  constructor(
    @Inject("IHomeRepository") private readonly homeRepository: IHomeRepository<any>,
    @Inject("IImageRepository") private readonly imageRepository: IImageRepository,
    @Inject("IMessageRepository") private readonly messageRepository: IMessageRepository<any>,
  ) {}

  async createHome(createHomeDto: CreateHomeDto) {
    const createdHome: CreateHomeDto = await this.homeRepository.create(createHomeDto);
    return new UpdateHomeDto(createdHome);
  }

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<UpdateHomeDto[]> {
    const homes = await this.homeRepository.getAllHomesByFilter(homeFilterDto);

    if (!homes || homes.length === 0) {
      throw new HttpException("No home is found with this filter", HttpStatus.NOT_FOUND);
    }

    return homes.map(home => new UpdateHomeDto(home));
  }

  async getHomeById(id: number): Promise<CreateHomeDto> {
    return await this.homeRepository.getById(id);
  }

  async updateHomeById(id: number, updateHomeDto: UpdateHomeDto): Promise<UpdateHomeDto> {
    const updatedHomeDto = await this.homeRepository.updateById(id, updateHomeDto);

    return new UpdateHomeDto(updatedHomeDto);
  }

  async deleteHomeById(id: number): Promise<UpdateHomeDto> {
    const home = await this.homeRepository.deleteById(id);

    return new UpdateHomeDto(home);
  }

  async addMessage(homeId: number, buyer: UserTokenData, message: string): Promise<MessageDto> {
    const home = await this.getHomeById(homeId);

    const addedMessage = await this.messageRepository.create({
      message: message,
      buyerId: buyer.id,
      homeId: home.id,
      realtorId: home.realtorId,
    });

    return new MessageDto(addedMessage);
  }

  async getAllMessages(homeId: number): Promise<MessageDto[]> {
    const messages = await this.messageRepository.getAllMessagesByHomeId(homeId);

    return messages.map(message => new MessageDto(message));
  }
}
