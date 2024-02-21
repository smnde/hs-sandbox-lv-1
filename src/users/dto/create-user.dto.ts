import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Role } from 'src/enums/roles.enum';
export class CreateUserDto {
  id?: number;

  @IsNotEmpty({ message: 'Nama tidak boleh kosong!' })
  @IsString({ message: 'Nama harus berupa string!' })
  nama: string;

  @IsNotEmpty({ message: 'Email tidak boleh kosong!' })
  @IsString({ message: 'Email harus berupa string!' })
  @IsEmail({}, { message: 'Masukan email yang valid!' })
  email: string;

  @IsNotEmpty({ message: 'Umur tidak boleh kosong!' })
  @IsInt({ message: 'Umur harus berupa angka!' })
  @Min(20, { message: 'Umur minimal 20 tahun!' })
  @Max(40, { message: 'Umur maksimal 40 tahun' })
  umur: number;

  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong!' })
  @IsString({ message: 'Tanggal lahir harus berupa string!' })
  tanggal_lahir: string;

  @IsNotEmpty({ message: 'Role tidak boleh kosong!' })
  @IsString({ message: 'Role harus berupa string!' })
  @IsEnum(Role, { message: 'Role tidak valid' })
  role: string;
}
