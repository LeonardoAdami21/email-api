import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserSeed {
  constructor(
    @Inject('db__client')
    private readonly dbClient: PrismaClient,
  ) {}

  private readonly userRepository = this.dbClient.users;
  async run() {
    const users = await this.userRepository.findMany();
  }
}

function generateConfirmationToken() {
  return faker.number
    .int({
      min: 10000000000,
      max: 99999999999,
    })
    .toString();
}
