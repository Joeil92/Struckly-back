import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Entreprise } from '../entreprises/entreprise.entity'

export enum InvitationStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
}

@Entity('Invitations')
@Unique(['email'])
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.invitations)
  sender: User

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 255 })
  token: string

  @ManyToOne(() => Entreprise, (entreprise) => entreprise.invitations)
  entreprise: Entreprise

  @Column({ type: 'timestamp', nullable: true, default: null })
  validatedAt: Date | null

  @Column({ type: 'enum', enum: InvitationStatus })
  status: InvitationStatus

  @CreateDateColumn()
  createdAt: Date
}
