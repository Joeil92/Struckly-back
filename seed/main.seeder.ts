import { User } from "../src/user/entity/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Entreprise } from "../src/entreprise/entity/entreprise.entity";
import { faker } from "@faker-js/faker";
import { EntrepriseToUser } from "../src/entrepriseToUser/entity/entreprise-to-user.entity";

export class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        // User seeder
        const users = await factoryManager.get(User).saveMany(500);

        const entrepriseFactory = factoryManager.get(Entreprise);
        const entrepriseToUserFactory = factoryManager.get(EntrepriseToUser);
        const entrepriseToUsers = await Promise.all(
            Array.from({ length: 50 }, async () => {
                const entrepriseToUser = await entrepriseToUserFactory.make({
                    user: faker.helpers.arrayElement(users),
                    entreprise: await entrepriseFactory.save()
                });
                return entrepriseToUser;
            })
        );
        await dataSource.getRepository(EntrepriseToUser).save(entrepriseToUsers);
    }
}