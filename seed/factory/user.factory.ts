import { User } from "../../src/user/entity/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

export const userFactory = setSeederFactory(User, () => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    const email = faker.internet.email({ firstName, lastName });
    const password = faker.helpers.maybe(() => bcrypt.hashSync("test1234", Number(process.env.SALT_ROUNDS)), { probability: 0.9 });
    const avatarUrl = !password ? null : faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.9 });

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.password = password ?? null;
    user.avatarUrl = avatarUrl ?? null;
    return user;
})