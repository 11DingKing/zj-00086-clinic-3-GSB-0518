import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.body = { message: '接口不存在' };
    }
  } catch (err: any) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message || '服务器内部错误'
    };
  }
};
