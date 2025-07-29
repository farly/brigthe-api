import { Lead } from "../../entities/Lead";
import { Service } from "../../entities/Service";
import { LeadDTO } from "../Lead";
import { toServiceDTO } from "./service";

export const toLeadDTO = (lead: Lead): LeadDTO => {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    mobile: lead.mobile,
    postcode: lead.postcode,
    createdAt: lead.createdAt,
    services: lead.services.map((service: Service) => toServiceDTO(service))
  };
}