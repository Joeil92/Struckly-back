import { DataSource, DataSourceOptions } from "typeorm"
import { runSeeders, SeederOptions } from "typeorm-extension"
import * as dotenv from "dotenv";
import { MainSeeder } from "./main.seeder";
import { userFactory } from "./factory/user.factory";
import { entrepriseFactory } from "./factory/entreprise.factory";
import { entrepriseToUserFactory } from "./factory/entreprise-to-user.factory";

dotenv.config();

(async () => {
    if (process.env.NODE_ENV === 'production') {
        console.log('🚨 Seeding is only available in development or test environment. 🚨')
        process.exit(1)
    }

    const options: DataSourceOptions & SeederOptions = {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT as string),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        seeds: [MainSeeder],
        factories: [
            userFactory,
            entrepriseFactory,
            entrepriseToUserFactory,
        ],
        synchronize: true
    }

    const dataSource = new DataSource(options)
    await dataSource.initialize()

    console.log("🔵 Seeding...");

    await runSeeders(dataSource);

    console.log('🚀 Seeding done. ✅')
})()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })