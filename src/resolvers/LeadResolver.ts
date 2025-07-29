import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  InputType,
  Field,
} from 'type-graphql';
import { Lead } from '../entities/Lead';
import { Service } from '../entities/Service';
import { AppDataSource } from '../dataSource';
import { In } from 'typeorm';
import { LeadDTO } from '../dto/Lead';
import { toLeadDTO } from '../dto/mappers/lead';

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

  @Query(() => [LeadDTO])
  async leads(): Promise<LeadDTO[]> {
    const leads = await this.leadRepo.find();

    return leads.map(lead => toLeadDTO(lead));
  }

  @Query(() => LeadDTO, { nullable: true })
  async lead(@Arg('id', () => Int) id: number): Promise<LeadDTO | null> {
    const leadData = await this.leadRepo.findOne({ where: { id } });
    return leadData ? toLeadDTO(leadData) : null; 
  }

  @Mutation(() => LeadDTO)
  async register(@Arg('input') input: RegisterInput): Promise<LeadDTO> {
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

    const createdLead = await this.leadRepo.save(lead);
    return toLeadDTO(createdLead);
  }
}