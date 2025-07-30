import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  InputType,
  Field,
} from 'type-graphql';

import {
  IsEmail,
  IsNotEmpty,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

import { Lead } from '../entities/Lead';
import { Service } from '../entities/Service';
import { AppDataSource } from '../dataSource';
import { In } from 'typeorm';
import { LeadDTO } from '../dto/Lead';
import { toLeadDTO } from '../dto/mappers/lead';
import { register } from '../useCase/register';
import { fetchLeads } from '../useCase/lead';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString()
  name: string;

  @Field()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Mobile should not be empty' })
  @IsString()
  mobile: string;

  @Field()
  @IsNotEmpty({ message: 'Postcode should not be empty' })
  @IsString()
  postcode: string;

  @Field(() => [String])
  @ArrayNotEmpty({ message: 'At least one service must be selected' })
  services: string[];
}

@Resolver()
export class LeadResolver {

  private leadRepo = AppDataSource.getRepository(Lead);
  private serviceRepo = AppDataSource.getRepository(Service);

  @Query(() => [LeadDTO])
  async leads(): Promise<LeadDTO[]> {
    return fetchLeads({
      leadRepo: this.leadRepo,
    })
  }

  @Query(() => LeadDTO, { nullable: true })
  async lead(@Arg('id', () => Int) id: number): Promise<LeadDTO | null> {
    const leadData = await this.leadRepo.findOne({ where: { id } });
    return leadData ? toLeadDTO(leadData) : null; 
  }

  @Mutation(() => LeadDTO)
  async register(@Arg('input') input: RegisterInput): Promise<LeadDTO> {
    return register(input, {
      serviceRepo: this.serviceRepo,
      leadRepo: this.leadRepo,
    });  
  }
}