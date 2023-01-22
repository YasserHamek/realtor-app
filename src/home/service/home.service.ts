import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Type, UnauthorizedException } from "@nestjs/common";
import { Types } from "mongoose";
import { UserTokenData } from "../../user/controller/user.dto";
import { CreateHomeDto, HomeFilterDto, MessageDto, UpdateHomeDto } from "../controller/home.dto";
import { IHomeRepository } from "../repository/home.repository";
import { IImageRepository } from "../repository/image.repository";
import { IMessageRepository } from "../repository/message.repository";

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

  async getHomeById(id: string): Promise<UpdateHomeDto> {
    const home = await this.homeRepository.getById(id);

    if (!home) {
      throw new NotFoundException("Home with id : " + id + " do not exist in database");
    }

    return new UpdateHomeDto(home);
  }

  async updateHomeById(homeId: string, updateHomeDto: UpdateHomeDto, user: UserTokenData): Promise<UpdateHomeDto> {
    this.checkUserAuthorisation(homeId, user, "Update");

    const updatedHomeDto = await this.homeRepository.updateById(homeId, updateHomeDto);

    return new UpdateHomeDto(updatedHomeDto);
  }

  async deleteHomeById(homeId: string, user: UserTokenData): Promise<UpdateHomeDto> {
    this.checkUserAuthorisation(homeId, user, "Delete");

    const deletedHome = await this.homeRepository.deleteById(homeId);

    return new UpdateHomeDto(deletedHome);
  }

  async addMessage(homeId: string, buyer: UserTokenData, message: string): Promise<MessageDto> {
    const home = await this.getHomeById(homeId);

    const addedMessage = await this.messageRepository.create({
      message: message,
      sender: { _id: new Types.ObjectId(buyer.id) },
      home: home,
      receiver: { _id: new Types.ObjectId(home.realtor.id) },
    });

    home.messages.push(addedMessage);

    this.updateHomeById(home._id.valueOf() + "", home, buyer);

    return new MessageDto(addedMessage);
  }

  async getAllMessages(homeId: string, user: UserTokenData): Promise<MessageDto[]> {
    this.checkUserAuthorisation(homeId, user, "check messages");

    const messages = await this.messageRepository.getAllMessagesByHomeId(homeId);

    return messages.map(message => new MessageDto(message));
  }

  private async checkUserAuthorisation(homeId: string, user: UserTokenData, mode: string): Promise<void> {
    const home: UpdateHomeDto = await this.getHomeById(homeId);

    if (home.realtor.id != user.id)
      throw new UnauthorizedException(
        "Anauthorized " + mode + ", you must be the realtor associated with this home to " + mode + " it.",
      );
  }
}
