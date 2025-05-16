import { Body, Controller, Logger, Post, Request } from '@nestjs/common'
import { EntrepriseService } from './entreprise.service'
import { CreateEntrepriseDto } from './dto/create-entreprise'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '../user/entity/user.entity'
import { Roles } from '../../common/decorator/role.decorator'
import { Entreprise } from './entity/entreprise.entity'

@ApiBearerAuth()
@Controller('entreprises')
export class EntrepriseController {
  private readonly logger = new Logger(EntrepriseController.name)

  constructor(private entrepriseService: EntrepriseService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Request() request: Request,
    @Body() entreprise: CreateEntrepriseDto
  ): Promise<Entreprise> {
    this.logger.log(`${request.method} ${request.url}`)
    return this.entrepriseService.create(entreprise)
  }
}
