import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { User } from '../entities';
import { comparePassword, hashPassword } from '../utils';
import { generateToken } from '../middleware';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  constructor() {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: 用户登录
   *     tags: [认证]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: 登录成功
   *       401:
   *         description: 用户名或密码错误
   */
  async login(ctx: Context) {
    const { username, password } = ctx.request.body as any;
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user || !(await comparePassword(password, user.password))) {
      ctx.status = 401;
      ctx.body = { message: '用户名或密码错误' };
      return;
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    });

    ctx.body = {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    };
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: 用户注册
   *     tags: [认证]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [admin, doctor, receptionist, patient]
   *     responses:
   *       200:
   *         description: 注册成功
   */
  async register(ctx: Context) {
    const { username, password, name, role = 'patient' } = ctx.request.body as any;
    
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      ctx.status = 400;
      ctx.body = { message: '用户名已存在' };
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      name,
      role
    });

    await this.userRepository.save(user);
    ctx.body = { message: '注册成功', userId: user.id };
  }
}
