import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PropertyType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { HomeFilterDto } from "../controller/home.dto";
import { HomeService } from "./home.service";

describe("HomeService", () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        PrismaService,
        // {
        //   provide: PrismaService,
        //   useValue: {
        //     home: {
        //       findMany: jest.fn().mockReturnValue(prismaService_home_findMany_returnedValue),
        //     },
        //   },
        // },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllHomesByFilter", () => {
    it("it should return the right value", async () => {
      prismaService.home.findMany = jest.fn().mockReturnValue(prismaService_home_findMany_returnedValue);

      expect(await service.getAllHomesByFilter(getAllHomeByFilterFilter)).toEqual(homeService_getAllHomesByFilterReturnedValue);
    });

    it("it should throw HttpException when no homes is found ", async () => {
      prismaService.home.findMany = jest.fn().mockReturnValue([]);

      await expect(service.getAllHomesByFilter(getAllHomeByFilterFilter)).rejects.toThrowError(HttpException);
    });

    it("prismaService should be called by the right params ", async () => {
      const mockPrismaFindMany = jest
        .spyOn(prismaService.home, "findMany")
        .mockImplementation(jest.fn().mockReturnValue(prismaService_home_findMany_returnedValue));

      await service.getAllHomesByFilter(getAllHomeByFilterFilter);

      await expect(mockPrismaFindMany).toBeCalledWith(selectGetAllHomesByFilter);
    });
  });
});

//Below is test data
const homeService_getAllHomesByFilterReturnedValue = [
  {
    adress: "rue numéro 10",
    city: "city1",
    id: 5,
    landSize: 100,
    numberOfBathrooms: 1,
    numberOfBedrooms: 4,
    price: 50000,
    propertyType: PropertyType.CONDO,
    images: [
      {
        url: "img1",
        id: 5,
      },
      {
        url: "img2",
        id: 6,
      },
    ],
  },
];

const prismaService_home_findMany_returnedValue = [
  {
    adress: "rue numéro 10",
    city: "city1",
    id: 5,
    landSize: 100,
    numberOfBathrooms: 1,
    numberOfBedrooms: 4,
    price: 50000,
    propertyType: "CONDO",
    images: [
      {
        url: "img1",
        id: 5,
      },
      {
        url: "img2",
        id: 6,
      },
    ],
  },
];

const getAllHomeByFilterFilter: HomeFilterDto = {
  city: "city1",
  price: {
    gte: 4000,
  },
};

const selectGetAllHomesByFilter = {
  select: {
    adress: true,
    city: true,
    id: true,
    landSize: true,
    numberOfBathrooms: true,
    numberOfBedrooms: true,
    price: true,
    propertyType: true,
    images: {
      select: {
        url: true,
        id: true,
      },
    },
  },
  where: getAllHomeByFilterFilter,
};
