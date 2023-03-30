export interface User {
  name: string,
  birthday: string,
  cpf: string,
  phone: string,
  email: string,
  password: string,
  id?: number,
  blocked?: boolean;
}

export interface UserRequest {
  accessToken: string,
  user: User
}
