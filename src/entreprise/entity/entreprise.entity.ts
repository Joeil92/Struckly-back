import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { EntrepriseToUser } from '../../entrepriseToUser/entity/entreprise-to-user.entity'

@Entity('Entreprises')
@Unique(['siretNumber'])
export class Entreprise {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  compagnyName: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  country: string

  @Column({ type: 'varchar', length: 255 })
  address: string

  @Column({ type: 'varchar', length: 255 })
  city: string

  @Column({ type: 'varchar', length: 10 })
  postalCode: string

  @Column({ type: 'varchar', length: 14 })
  siretNumber: string

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null

  @OneToMany(
    () => EntrepriseToUser,
    (entrepriseToUser) => entrepriseToUser.entreprise,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  entrepriseToUsers: EntrepriseToUser[]

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
