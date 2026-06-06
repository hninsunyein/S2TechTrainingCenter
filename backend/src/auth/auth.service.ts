import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private email: EmailService,
  ) {}

  // ── Admin ──────────────────────────────────────────
  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: admin.id, email: admin.email, name: admin.name };
    return { access_token: this.jwt.sign(payload), admin: { id: admin.id, email: admin.email, name: admin.name } };
  }

  async getMe(adminId: string) {
    return this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  // ── User ───────────────────────────────────────────
  async register(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already registered');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, password: hash, name } });
    const payload = { sub: user.id, email: user.email, name: user.name };
    return { access_token: this.jwt.sign(payload), user: { id: user.id, email: user.email, name: user.name } };
  }

  async userLogin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');
    const payload = { sub: user.id, email: user.email, name: user.name };
    return { access_token: this.jwt.sign(payload), user: { id: user.id, email: user.email, name: user.name } };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('No account found with this email');
    await this.prisma.otpToken.updateMany({ where: { email, used: false }, data: { used: true } });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.otpToken.create({ data: { email, otp, expiresAt } });
    await this.email.sendOtp(email, otp, user.name);
    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, otp: string) {
    const token = await this.prisma.otpToken.findFirst({
      where: { email, otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!token) throw new BadRequestException('Invalid or expired OTP');
    return { valid: true };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const token = await this.prisma.otpToken.findFirst({
      where: { email, otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!token) throw new BadRequestException('Invalid or expired OTP');
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { email }, data: { password: hash } });
    await this.prisma.otpToken.update({ where: { id: token.id }, data: { used: true } });
    return { message: 'Password reset successfully' };
  }
}
