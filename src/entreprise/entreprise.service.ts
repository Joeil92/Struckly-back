import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateEntrepriseDto } from './dto/create-entreprise'
import { Repository } from 'typeorm'
import { Entreprise } from './entity/entreprise.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class EntrepriseService {
  constructor(
    @InjectRepository(Entreprise)
    private entrepriseRepository: Repository<Entreprise>
  ) {}

  async create(entreprise: CreateEntrepriseDto) {
    if (await this.findBySiret(entreprise.siretNumber)) {
      throw new HttpException('Siret already exists', HttpStatus.CONFLICT)
    }

    const newEntreprise = new Entreprise()
    newEntreprise.compagnyName = entreprise.compagnyName
    newEntreprise.name = entreprise.name
    newEntreprise.country = entreprise.country
    newEntreprise.address = entreprise.address
    newEntreprise.city = entreprise.city
    newEntreprise.postalCode = entreprise.postalCode
    newEntreprise.siretNumber = entreprise.siretNumber
    newEntreprise.phoneNumber = entreprise.phoneNumber
    newEntreprise.email = entreprise.email ?? null
    newEntreprise.website = entreprise.website ?? null
    return await this.entrepriseRepository.save(newEntreprise)
  }

  async findBySiret(siret: string): Promise<Entreprise | null> {
    return await this.entrepriseRepository.findOneBy({ siretNumber: siret })
  }
}
