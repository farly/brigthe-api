import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { Lead } from '../entities/Lead';
import { Service } from '../entities/Service';
import { AppDataSource } from '../data-source';
import { In } from 'typeorm';

@InputType()
class RegisterInput {
  @Field() name: string;
  @Field() email: string;
  @Field() mobile: string;
  @Field() postcode: string;
  @Field(() => [String]) services: string[];
}

@Resolver()
export class LeadResolver {
  private leadRepo = AppDataSource.getRepository(Lead);
  private serviceRepo = AppDataSource.getRepository(Service);

  @Query(() => [Lead])
  async leads(): Promise<Lead[]> {
    return this.leadRepo.find();
  }

  @Query(() => Lead, { nullable: true })
  async lead(@Arg('id', () => Int) id: number): Promise<Lead | null> {
    return this.leadRepo.findOne({ where: { id } });
  }

  @Mutation(() => Lead)
  async register(@Arg('input') input: RegisterInput): Promise<Lead> {
    const services = await this.serviceRepo.find({
      where: { name: In(input.services) },
    });

    const lead = this.leadRepo.create({
      name: input.name,
      email: input.email,
      mobile: input.mobile,
      postcode: input.postcode,
      services,
    });

    return await this.leadRepo.save(lead);
  }
}