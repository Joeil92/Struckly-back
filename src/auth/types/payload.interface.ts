import { UserRole } from 'src/user/entity/user.entity'

export interface Payload {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  roles: UserRole[]
}
