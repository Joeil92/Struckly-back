import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './dto/create-organization'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { Organization } from './organization.entity'
import { RequestAuthenticated } from '../../common/types/requestAuthenticated.interface'

@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  private readonly logger = new Logger(OrganizationsController.name)

  constructor(private organizationsService: OrganizationsService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully create organization',
  })
  create(
    @Request() request: RequestAuthenticated,
    @Body() organization: CreateOrganizationDto
  ): Promise<Organization> {
    this.logger.log(`${request.method} ${request.url}`)
    return this.organizationsService.create(organization, request.user.id)
  }

  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get organization by user ID',
  })
  findByUserId(
    @Request() request: RequestAuthenticated
  ): Promise<Organization | null> {
    this.logger.log(`${request.method} ${request.url}`)
    return this.organizationsService.findByUserId(request.user.id)
  }
}
