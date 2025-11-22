import { UserModel } from "../models/User.js";

export class UserService {
  static async getAllUsers() {
    return await UserModel.findAll();
  }

  static async getUserById(id: number) {
    return await UserModel.findById(id);
  }

  static async getUserByUsername(username: string) {
    return await UserModel.findByUsername(username);
  }

  static async getUserByEmail(email: string) {
    return await UserModel.findByEmail(email);
  }

  static async updateUser(id: number, data: any) {
    return await UserModel.update(id, data);
  }

  static async deleteUser(id: number): Promise<boolean> {
    return await UserModel.delete(id);
  }
}
