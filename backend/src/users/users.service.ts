import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

type SafeUser = Omit<User, 'password'>;
const SAFE_SELECT = ['userId', 'email', 'name', 'income'] as const;
const toSafeUser = (u: User): SafeUser => {
  const { password, ...rest } = u as User & { password?: string };
  return rest;
};

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const exists = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (exists) throw new ConflictException('User with this email already exists');

    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const saved = await this.userRepository.save(this.userRepository.create({ ...createUserDto, password: hashed }));
    return toSafeUser(saved);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find({ select: SAFE_SELECT as unknown as Array<keyof User>, order: { userId: 'ASC' } });
    return users.map(toSafeUser);
  }

  async findOne(id: number): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ where: { userId: id }, select: SAFE_SELECT as unknown as Array<keyof User> });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return toSafeUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } }); // includes password for auth
  }

  async update(id: number, dto: UpdateUserDto): Promise<SafeUser> {
    const current = await this.userRepository.findOne({ where: { userId: id } });
    if (!current) throw new NotFoundException(`User with ID ${id} not found`);

    if (dto.email && dto.email !== current.email) {
      const exists = await this.userRepository.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('User with this email already exists');
    }
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

    await this.userRepository.update(id, dto);
    const updated = await this.userRepository.findOne({ where: { userId: id }, select: SAFE_SELECT as unknown as Array<keyof User> });
    if (!updated) throw new NotFoundException(`User with ID ${id} not found`);
    return toSafeUser(updated);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.userRepository.remove(user);
  }

  async validatePassword(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? toSafeUser(user) : null;
  }
}
