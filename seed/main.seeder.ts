import { User } from '../src/users/user.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Entreprise } from '../src/entreprises/entreprise.entity'
import { faker } from '@faker-js/faker'

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    // Entreprises
    const entreprises = await factoryManager.get(Entreprise).saveMany(50)

    // Users
    const userFactory = factoryManager.get(User)
    const users = await Promise.all(
      Array.from({ length: 200 }, async () =>
        userFactory.make({
          entreprise: faker.helpers.arrayElement(entreprises),
        })
      )
    )
    await dataSource.getRepository(User).save(users)
  }
}
