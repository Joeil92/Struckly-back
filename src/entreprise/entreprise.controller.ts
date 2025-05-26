import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common'
import { EntrepriseService } from './entreprise.service'
import { CreateEntrepriseDto } from './dto/create-entreprise'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { UserRole } from '../user/entity/user.entity'
import { Roles } from '../../common/decorator/role.decorator'
import { Entreprise } from './entity/entreprise.entity'
import { RequestAuthenticated } from '../../common/types/requestAuthenticated.interface'

@ApiBearerAuth()
@Controller('entreprises')
export class EntrepriseController {
  private readonly logger = new Logger(EntrepriseController.name)

  constructor(private entrepriseService: EntrepriseService) {}

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
    return this.entrepriseService.create(entreprise)
  }

  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get entreprises',
  })
  findByUserId(
    @Request() request: RequestAuthenticated
  ): Promise<Entreprise[]> {
    this.logger.log(`${request.method} ${request.url}`)
    return this.entrepriseService.findEntreprisesByUserId(request.user.id)
  }
}
