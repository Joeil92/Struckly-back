import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Entreprise } from './entreprise.entity'
import { EntreprisesController } from './entreprises.controller'
import { EntreprisesService } from './entreprises.service'

@Module({
  imports: [TypeOrmModule.forFeature([Entreprise])],
  controllers: [EntreprisesController],
  providers: [EntreprisesService],
})
export class EntreprisesModule {}
