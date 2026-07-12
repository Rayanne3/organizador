import { prisma } from "../db/client";
import { User, UserRole } from "../../core/entities/user.entity";
import { IUserRepository } from "../../core/interfaces/user-repository.interface";

export class PrismaUserRepository implements IUserRepository {
  private mapUser(u: any): User {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role as UserRole,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { email } });
    return u ? this.mapUser(u) : null;
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id } });
    return u ? this.mapUser(u) : null;
  }
}