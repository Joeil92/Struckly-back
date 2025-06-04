import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Invitation } from '../invitations/invitation.entity'
import { OrganizationSize } from './organization.types'

@Entity('Organizations')
@Unique(['slug'])
export class Organization {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  slug: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  country: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string

  @Column({ type: 'varchar', length: 10, nullable: true })
  postalCode: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string

  @Column({
    type: 'enum',
    enum: OrganizationSize,
  })
  size: OrganizationSize

  @ManyToOne(() => User, (user) => user.ownerOrganizations)
  owner: User

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl: string | null

  @OneToMany(() => User, (user) => user.organization)
  users: User[]

  @OneToMany(() => Invitation, (invitation) => invitation.organization)
  invitations: Invitation[]

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
