import { ObjectType, Field, Int } from 'type-graphql';
import { ServiceDTO } from './Service';

@ObjectType()
export class LeadDTO {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  mobile: string;

  @Field()
  postcode: string;

  @Field()
  createdAt: Date;

  @Field(() => [ServiceDTO])
  services: ServiceDTO[];
}