import { MediaTypes } from '../enum';
import { Organization } from '../../database/entities';

export interface ICreateMediaStream {
  userId: number;
  type: MediaTypes;
  filePath: string;
  organization: Organization;
}
