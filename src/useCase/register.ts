import { In, Repository } from "typeorm";
import { Lead } from "../entities/Lead";
import { Service } from "../entities/Service";
import { RegisterInput } from "../resolvers/LeadResolver";
import { toLeadDTO } from "../dto/mappers/lead";

type Repositories = {
  serviceRepo: Repository<Service>;
  leadRepo: Repository<Lead> 
}

export const register = async (input: RegisterInput, {
  serviceRepo,
  leadRepo,
}: Repositories) => {

    const services = await serviceRepo.find({
      where: { name: In(input.services) },
    });

    const lead = leadRepo.create({
      name: input.name,
      email: input.email,
      mobile: input.mobile,
      postcode: input.postcode,
      services,
    });

    const createdLead = await leadRepo.save(lead);
    return toLeadDTO(createdLead);
}