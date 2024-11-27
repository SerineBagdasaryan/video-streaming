import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../database/entities';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  async findOne(params: Partial<Organization>): Promise<Organization> {
    const apiKey = params.apiKey.trim();
    return await this.orgRepository.findOne({ where: { apiKey } });
  }
}
