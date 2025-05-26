import { User } from "../../src/user/entity/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

export const userFactory = setSeederFactory(User, () => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    const email = faker.internet.email({ firstName, lastName });
    const password = faker.helpers.maybe(() => bcrypt.hashSync("test1234", Number(process.env.SALT_ROUNDS)), { probability: 0.9 });
    const resetToken = password ? null : bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), Number(process.env.SALT_ROUNDS));
    const avatarUrl = !password ? null : faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.9 });

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.password = password ?? null;
    user.avatarUrl = avatarUrl ?? null;
    user.resetToken = resetToken;
    return user;
})