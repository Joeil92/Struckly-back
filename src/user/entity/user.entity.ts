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

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null

  @Column({ type: 'varchar', length: 255 })
  firstName: string

  @Column({ type: 'varchar', length: 255 })
  lastName: string

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender: UserGenderType

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string | null

  @Column({
    type: 'simple-array',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[]

  @OneToMany(
    () => EntrepriseToUser,
    (entrepriseToUser) => entrepriseToUser.user,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  entrepriseToUsers: EntrepriseToUser[]

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  resetToken: string | null

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  tokenExpiresAt: Date | null

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null

  @CreateDateColumn()
  createdAt: Date
}
