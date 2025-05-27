import { UserRole } from 'src/users/user.entity'

export interface Payload {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  roles: UserRole[]
}
