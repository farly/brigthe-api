import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable
} from 'typeorm';
import { Service } from './Service';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  postcode: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Service, { eager: true })
  @JoinTable({
    name: 'lead_services',
    joinColumn: {
      name: 'lead_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
  })
  services: Service[];
}