import {
  BeforeInsert,
  BeforeUpdate,
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
import { Organization } from '../organizations/organization.entity'
import { Invitation } from '../invitations/invitation.entity'
import * as bcrypt from 'bcrypt'

export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER',
}

export type UserGenderType = 'male' | 'female' | 'other'

@Entity('Users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 255, select: false })
  password: string

  @Column({ type: 'varchar', length: 255 })
  firstName: string

  @Column({ type: 'varchar', length: 255 })
  lastName: string

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender: UserGenderType

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string | null

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  organization: Organization | null

  @OneToMany(() => Organization, (organization) => organization.owner)
  ownerOrganizations: Organization[]

  @Column({
    type: 'simple-array',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[]

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  resetToken: string | null

  @Column({ type: 'timestamp', nullable: true, default: null })
  tokenExpiresAt: Date | null

  @OneToMany(() => Invitation, (invitation) => invitation.sender)
  invitations: Invitation[]

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @BeforeInsert()
  setPassword(password: string) {
    const salt = bcrypt.genSaltSync()
    this.password = bcrypt.hashSync(this.password || password, salt)
  }

  @BeforeUpdate()
  setResetToken(token: string) {
    if (!this.resetToken && !token) return

    const salt = bcrypt.genSaltSync()
    this.resetToken = bcrypt.hashSync(this.resetToken || token, salt)
  }
}
