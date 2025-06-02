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
    const organizationFactory = factoryManager.get(Organization)
    const userFactory = factoryManager.get(User)

    const users: User[] = []
    const organizations: Organization[] = []
    await Promise.all(
      Array.from({ length: 50 }, async () => {
        const user = await userFactory.make()
        const organization = await organizationFactory.make()

        user.organization = organization
        organization.owner = user
        users.push(user)
        organizations.push(organization)
      })
    )

    await dataSource.getRepository(User).save(users)
    await dataSource.getRepository(Organization).save(organizations)
  }
}
