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
import { User } from '../users/user.entity'
import { Invitation } from '../invitations/invitation.entity'

@Entity('Entreprises')
@Unique(['siretNumber', 'slug'])
export class Entreprise {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  slug: string

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl: string | null

  @OneToMany(() => User, (user) => user.entreprise)
  users: User[]

  @OneToMany(() => Invitation, (invitation) => invitation.entreprise)
  invitations: Invitation[]

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
