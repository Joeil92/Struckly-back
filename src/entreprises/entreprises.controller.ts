import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common'
import { EntreprisesService } from './entreprises.service'
import { CreateEntrepriseDto } from './dto/create-entreprise'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { UserRole } from '../users/user.entity'
import { Roles } from '../../common/decorators/role.decorator'
import { Entreprise } from './entreprise.entity'
import { RequestAuthenticated } from '../../common/types/requestAuthenticated.interface'

@ApiBearerAuth()
@Controller('entreprises')
export class EntreprisesController {
  private readonly logger = new Logger(EntreprisesController.name)

  constructor(private entreprisesService: EntreprisesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully create entreprise',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Siret already exists',
  })
  create(
    @Request() request: Request,
    @Body() entreprise: CreateEntrepriseDto
  ): Promise<Entreprise> {
    this.logger.log(`${request.method} ${request.url}`)
    return this.entreprisesService.create(entreprise)
  }

  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get entreprise by user ID',
  })
  findByUserId(
    @Request() request: RequestAuthenticated
  ): Promise<Entreprise | null> {
    this.logger.log(`${request.method} ${request.url}`)
    return this.entreprisesService.findEntrepriseByUserId(request.user.id)
  }
}
