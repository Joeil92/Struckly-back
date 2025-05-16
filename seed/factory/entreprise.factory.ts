import { setSeederFactory } from "typeorm-extension";
import { Entreprise } from "../../src/entreprise/entity/entreprise.entity";
import { faker } from "@faker-js/faker";

export const entrepriseFactory = setSeederFactory(Entreprise, () => {
    const name = faker.company.name();
    const compagnyName = name + " SARL";
    const country = faker.location.country();
    const address = faker.location.streetAddress();
    const city = faker.location.city();
    const postalCode = faker.location.zipCode();
    const siretNumber = faker.helpers.replaceSymbols("##############");
    const phoneNumber = faker.phone.number({ style: "international" });
    const email = faker.internet.email({ provider: name.replace(/\s/g, "") });
    const website = faker.internet.url();

    const entreprise = new Entreprise();
    entreprise.compagnyName = compagnyName;
    entreprise.name = name;
    entreprise.country = country;
    entreprise.address = address;
    entreprise.city = city;
    entreprise.postalCode = postalCode;
    entreprise.siretNumber = siretNumber;
    entreprise.phoneNumber = phoneNumber;
    entreprise.email = email;
    entreprise.website = website;

    return entreprise;
})