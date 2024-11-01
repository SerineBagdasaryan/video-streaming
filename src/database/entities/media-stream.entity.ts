import { Entity, Column } from 'typeorm';
import { MediaTypes } from '../../common/enum';
import { BaseEntity } from '../base'
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
}
