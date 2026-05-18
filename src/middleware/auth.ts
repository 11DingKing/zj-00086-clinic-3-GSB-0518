import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'clinic-management-secret-key-2024';

export const AuthMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: '未提供认证令牌' };
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: '无效的认证令牌' };
  }
};

export const RoleMiddleware = (roles: string[]) => {
  return async (ctx: Context, next: Next) => {
    const user = ctx.state.user;
    if (!user || !roles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = { message: '权限不足' };
      return;
    }
    await next();
  };
};

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
