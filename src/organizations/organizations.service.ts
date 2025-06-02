import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateOrganizationDto } from './dto/create-organization'
import { Repository } from 'typeorm'
import { Organization } from './organization.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/user.entity'
import { slugify } from '../../common/utils/slugify'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(
    organization: CreateOrganizationDto,
    userId: string
  ): Promise<Organization> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization'],
    })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    if (user.organization) {
      throw new HttpException(
        'User already has an organization',
        HttpStatus.CONFLICT
      )
    }

    const newOrganization = new Organization()
    newOrganization.slug =
      slugify(organization.name) +
      '-' +
      Math.random().toString(36).substring(2, 15)
    newOrganization.name = organization.name
    newOrganization.country = organization.country
    newOrganization.owner = user

    const organizationSaved =
      await this.organizationRepository.save(newOrganization)

    user.organization = organizationSaved
    await this.userRepository.save(user)

    return organizationSaved
  }

  async findByUserId(userId: string): Promise<Organization | null> {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .select([
        'organization.slug',
        'organization.name',
        'organization.logoUrl',
      ])
      .leftJoin('organization.users', 'users')
      .loadRelationCountAndMap(
        'organization.membersCount',
        'organization.users'
      )
      .where('users.id = :userId', { userId })
      .getOne()
  }
}
