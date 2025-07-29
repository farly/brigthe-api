import { Service } from "../../entities/Service";
import { ServiceDTO } from "../Service";

export const toServiceDTO = (service: Service): ServiceDTO => {
  return {
    id: service.id,
    name: service.name
  };
}