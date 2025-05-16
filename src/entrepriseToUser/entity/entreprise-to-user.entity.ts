import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { Entreprise } from '../../entreprise/entity/entreprise.entity'

@Entity('Entreprises_users')
export class EntrepriseToUser {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.entrepriseToUsers)
  user: User

  @ManyToOne(() => Entreprise, (entreprise) => entreprise.entrepriseToUsers)
  entreprise: Entreprise

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
