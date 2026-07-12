import { LoginDTO, User } from "../entities/user.entity";
import { IUserRepository } from "../interfaces/user-repository.interface";
// Usaremos bcryptjs para comparar a senha (instalaremos em breve)
import bcrypt from "bcryptjs";

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(data.password, user.password!);

    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas.");
    }

    // Verifica se é um Admin (regra de negócio da sua feature)
    if (user.role !== "ADMIN") {
      throw new Error("Acesso não autorizado.");
    }

    // Retorna o usuário sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}