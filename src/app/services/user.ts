export interface User {
  name: string,
  birthday: string,
  cpf: string,
  phone: string,
  email: string,
  password: string,
  id?: number
}

export interface UserRequest {
  accessToken: string,
  user: User
}
