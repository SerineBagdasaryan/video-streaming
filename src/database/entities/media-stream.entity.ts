import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MediaTypes } from '../../common/enum';
import { BaseEntity } from '../base';
import { Organization } from './organization.entity';
@Entity()
export class MediaStream extends BaseEntity {
  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: MediaTypes,
  })
  type: MediaTypes;

  @Column()
  filePath: string;

  @ManyToOne(() => Organization, (organization) => organization.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
