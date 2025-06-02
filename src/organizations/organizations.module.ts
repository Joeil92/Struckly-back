import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Organization } from './organization.entity'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'
import { User } from '../users/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
