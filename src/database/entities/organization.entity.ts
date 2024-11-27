import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base';
import { IsObject } from 'class-validator';
@Entity()
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column()
  apiKey: string;

  @IsObject()
  metadata: object;
}
