import { User } from '../../src/users/user.entity'
import { setSeederFactory } from 'typeorm-extension'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

export const userFactory = setSeederFactory(User, () => {
  const gender = faker.person.sexType()
  const firstName = faker.person.firstName(gender)
  const lastName = faker.person.lastName(gender)
  const email = faker.internet.email({ firstName, lastName })
  const password = bcrypt.hashSync('test1234', Number(process.env.SALT_ROUNDS))
  const avatarUrl =
    faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.9 }) ||
    null

  const user = new User()
  user.email = email
  user.firstName = firstName
  user.lastName = lastName
  user.gender = gender
  user.password = password
  user.avatarUrl = avatarUrl
  return user
})
