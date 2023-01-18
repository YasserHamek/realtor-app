import { PrismaService } from "../../prisma/prisma.service";
import { MessageDto } from "../controller/home.dto";
import { IMessageRepository } from "./repository.interface";

export class MessageRepository implements IMessageRepository<MessageDto> {
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