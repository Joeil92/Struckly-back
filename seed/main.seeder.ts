import { User } from "../src/user/entity/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Entreprise } from "../src/entreprise/entity/entreprise.entity";
import { faker } from "@faker-js/faker";

export class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        // User seeder
        const users = await factoryManager.get(User).saveMany(500);

        // Entreprise seeder
        const entrepriseFactory = factoryManager.get(Entreprise);
        const entreprises = await Promise.all(
            Array.from({ length: 50 }, async () => {
                const entreprise = await entrepriseFactory.make({
                    users: faker.helpers.arrayElements(users, { min: 1, max: 10 })
                });
                return entreprise;
            })
        );
        await dataSource.getRepository(Entreprise).save(entreprises);
    }
}