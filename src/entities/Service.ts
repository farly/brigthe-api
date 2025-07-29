import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Lead } from './Lead';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Lead, lead => lead.services)
  leads: Lead[];
}