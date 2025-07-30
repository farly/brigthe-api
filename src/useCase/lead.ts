import { toLeadDTO } from "../dto/mappers/lead";
import { LeadDTO } from "../dto/Lead";
import { Repository } from "typeorm";
import { Lead } from "../entities/Lead";

type Repositories = {
  leadRepo: Repository<Lead>;
}

export const fetchLeads = async ({
  leadRepo,
}: Repositories): Promise<LeadDTO[]> => {
  const leads = await leadRepo.find({
    relations: ['services'],
  });
  return leads.map(toLeadDTO);
}

export const fetchById = async (id: number, {
  leadRepo,
}: Repositories): Promise<LeadDTO | null> => {
  const lead = await leadRepo.findOne({
    where: { id },
    relations: ['services'],
  });
  return lead ? toLeadDTO(lead) : null;
}
