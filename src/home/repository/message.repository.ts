import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PrismaService } from "../../prisma/prisma.service";
import { MessageDto } from "../controller/home.dto";
import { GenericRepository } from "../../common/generic/repository/generic.repository.interface";

export interface IMessageRepository<R> extends GenericRepository<MessageDto, R> {
  getAllMessagesByHomeId(homeId: string): Promise<MessageDto[]>;
}

export class MessageRepositoryMongoDb implements IMessageRepository<MessageDto> {
  constructor(@InjectModel("Message") private messageModel: Model<MessageDto>) {}

  async create(messageDto: MessageDto): Promise<MessageDto> {
    const message = new this.messageModel(messageDto);
    return (await (await message.save()).populate("home")).toObject();
  }

  async getAllMessagesByHomeId(homeId: string): Promise<MessageDto[]> {
    return await this.messageModel.find({ home: { _id: homeId } }).lean();
  }

  getById(id: string): Promise<MessageDto> {
    throw new Error("Method not implemented.");
  }
  updateById(id: string, updateHomeDto: Partial<MessageDto>): Promise<Partial<MessageDto>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<Partial<MessageDto>> {
    throw new Error("Method not implemented.");
  }
}

export class MessageRepositoryPrisma implements IMessageRepository<MessageDto> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(messageDto: Partial<MessageDto>): Promise<MessageDto> {
    return await this.prismaService.message.create({
      data: {
        message: messageDto.message,
        buyerId: messageDto.buyer.id,
        homeId: messageDto.home.id,
        realtorId: messageDto.home.realtorId,
      },
      include: {
        buyer: {
          select: {
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async getAllMessagesByHomeId(homeId: string): Promise<MessageDto[]> {
    return await this.prismaService.message.findMany({
      where: {
        id: parseInt(homeId),
      },
      include: {
        buyer: {
          select: {
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  getById(id: string): Promise<MessageDto> {
    throw new Error("Method not implemented.");
  }
  updateById(id: string, updateHomeDto: MessageDto): Promise<MessageDto> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<MessageDto> {
    throw new Error("Method not implemented.");
  }
}
