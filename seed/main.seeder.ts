import { User } from '../src/users/user.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Organization } from '../src/organizations/organization.entity'
import { faker } from '@faker-js/faker'

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const usersFactory = factoryManager.get(User)
    const organizationsFactory = factoryManager.get(Organization)

    const users = await usersFactory.saveMany(50)
    const organizations = await organizationsFactory.saveMany(50)

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const organization = organizations[i];

      user.organization = organization
      organization.owner = user
    }

    await dataSource.getRepository(User).save(users)
    await dataSource.getRepository(Organization).save(organizations)
  }
}
