import { setSeederFactory } from "typeorm-extension";
import { EntrepriseToUser } from "../../src/entrepriseToUser/entity/entreprise-to-user.entity";

export const entrepriseToUserFactory = setSeederFactory(EntrepriseToUser, () => {
    const entrepriseToUser = new EntrepriseToUser();
    return entrepriseToUser;
});