import { setSeederFactory } from 'typeorm-extension'
import { Organization } from '../../src/organizations/organization.entity'
import { faker } from '@faker-js/faker'
import { OrganizationSize } from '../../src/organizations/organization.types'

export const organizationFactory = setSeederFactory(Organization, () => {
  const name = faker.company.name()
  const slug = faker.lorem.slug()
  const country = faker.location.country()
  const address = faker.location.streetAddress()
  const city = faker.location.city()
  const postalCode = faker.location.zipCode()
  const phoneNumber = faker.phone.number({ style: 'international' })
  const website = faker.internet.url()
  const logo =
    faker.helpers.maybe(() => faker.image.url({ width: 100, height: 100 }), {
      probability: 0.8,
    }) ?? null

  const organization = new Organization()
  organization.slug = slug
  organization.name = name
  organization.size = OrganizationSize['1-9']
  organization.country = country
  organization.address = address
  organization.city = city
  organization.postalCode = postalCode
  organization.phoneNumber = phoneNumber
  organization.website = website
  organization.logoUrl = logo

  return organization
})
