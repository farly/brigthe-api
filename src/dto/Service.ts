import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class ServiceDTO {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}