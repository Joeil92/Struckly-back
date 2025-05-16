import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Entreprise } from './entity/entreprise.entity'
import { EntrepriseController } from './entreprise.controller'
import { EntrepriseService } from './entreprise.service'

@Module({
  imports: [TypeOrmModule.forFeature([Entreprise])],
  controllers: [EntrepriseController],
  providers: [EntrepriseService],
})
export class EntrepriseModule {}
