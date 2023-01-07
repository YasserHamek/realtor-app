import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserTokenData } from "../user/user.dto";
import { CreateHomeDto, HomeFilterDto, MessageDto, UpdateHomeDto } from "./home.dto";
import { HomeDocument } from "./home.schema";
import { IHomeRepository, IImageRepository, IMessageRepository } from "./repository/repository.interface";

@Injectable()
export class HomeService {
  constructor(
    @InjectModel("Home") private homeModel: Model<HomeDocument>,
    private readonly homeRepository: IHomeRepository,
    private readonly imageRepository: IImageRepository,
    private readonly messageRepository: IMessageRepository,
  ) {}

  // async createHomeV2(createHomeDto: CreateHomeDto, id: number): Promise<HomeDocument> {
  //   const newHome = new this.homeModel(createHomeDto);
  //   return newHome.save();
  // }

  // /**
  //  * @deprecated use createHomeV2 instead
  //  */
  async createHome(createHomeDto: CreateHomeDto) {
    const createdHome: CreateHomeDto = await this.homeRepository.create(createHomeDto);

    await this.imageRepository.createImages(
      createHomeDto.images.map(image => {
        return { url: image.url, homeId: createdHome.id };
      }),
    );

    return createdHome;
  }

  async getAllHomesByFilter(homeFilterDto: HomeFilterDto): Promise<UpdateHomeDto[]> {
    const homes: any[] = await this.homeRepository.getAllHomesByFilter(homeFilterDto);

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
