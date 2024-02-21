import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnResponse } from 'src/interfaces';
import { users } from 'src/db/users.db';

@Injectable()
export class UsersService {
  private users = users;

  create(data: CreateUserDto): ReturnResponse {
    const { nama, email, umur, tanggal_lahir, role } = data;
    const id = this.generateID();

    const emailIsExists = this.checkEmail(email);
    if (emailIsExists) throw new BadRequestException('Email sudah digunakan!');

    const newUser = { id, nama, email, umur, tanggal_lahir, role };
    this.users.push(newUser);

    return {
      statusCode: 201,
      status: 'Success',
      message: 'Data user berhasil ditambahkan',
      data: newUser,
    };
  }

  createMany(data: CreateUserDto[]): ReturnResponse {
    const existingEmail = this.users.filter((currentUser) => {
      return data.some((newUser) => {
        return newUser.email === currentUser.email;
      });
    });

    if (existingEmail.length > 0) {
      const duplicateEmail = existingEmail.map((user) => user.email).join(', ');
      throw new BadRequestException(`Email ${duplicateEmail} sudah digunakan!`);
    }

    const addNewUser = data.map((user) => {
      return { ...user, id: this.generateID() };
    });

    this.users.push(...addNewUser);

    return {
      statusCode: 201,
      status: 'Success',
      message: 'Penambahan massal berhasil',
    };
  }

  findAll(): ReturnResponse {
    const message =
      this.users.length < 1
        ? 'Daftar user masih kosong'
        : 'Daftar user tersedia';

    return {
      statusCode: 200,
      status: 'Success',
      message,
      data: this.users,
    };
  }

  findOne(id: number): ReturnResponse {
    const user = this.findUserById(id);
    if (!user) throw new NotFoundException('Data user tidak ditemukan!');

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Data user ditemukan',
      data: user,
    };
  }

  update(id: number, data: UpdateUserDto): ReturnResponse {
    const user = this.findUserById(id);
    if (!user) throw new NotFoundException('Data user tidak ditemukan!');

    const emailIsExists = this.users.find(
      (currentUser) =>
        currentUser.id !== id && currentUser.email === data.email,
    );
    if (emailIsExists) throw new BadRequestException('Email sudah digunakan!');

    user.nama = data.nama;
    user.email = data.email;
    user.umur = data.umur;
    user.tanggal_lahir = data.tanggal_lahir;
    user.role = data.role;

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Data user berhasil diubah',
    };
  }

  remove(id: number): ReturnResponse {
    const user = this.findUserById(id);
    if (!user) throw new NotFoundException('Data user tidak ditemukan!');

    this.users = this.users.filter((currentUser) => currentUser.id !== user.id);

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Data user berhasil dihapus',
    };
  }

  removeMany(usersID: number[]): ReturnResponse {
    const notFoundID: number[] = [];
    const deletedID: number[] = [];

    for (const id of usersID) {
      const user = this.findUserById(id);
      if (!user) {
        notFoundID.push(id);
      }
      deletedID.push(id);
    }

    if (notFoundID.length === usersID.length) {
      throw new NotFoundException('Data user tidak ditemukan');
    }

    this.users = this.users.filter(
      (currentUser) => !deletedID.includes(currentUser.id),
    );

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Penghapusan massal berhasil',
    };
  }

  private generateID() {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const ID = parseInt(timestamp + '' + randomNumber);

    return ID;
  }

  private findUserById(id: number) {
    const user = this.users.find((user) => user.id == id);
    return user;
  }

  private checkEmail(email: string) {
    const existingEmail = this.users.find((user) => user.email === email);
    return existingEmail;
  }
}
