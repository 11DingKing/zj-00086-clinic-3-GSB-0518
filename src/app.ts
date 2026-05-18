import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';
import { AppDataSource } from './data-source';
import router from './routes';
import { specs } from './swagger';
import { errorHandler } from './middleware';

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(bodyParser());

app.use(errorHandler);

app.use(async (ctx, next) => {
  if (ctx.path === '/api/swagger.json') {
    ctx.body = specs;
  } else {
    await next();
  }
});

app.use(
  koaSwagger({
    routePrefix: '/api/docs',
    swaggerOptions: {
      url: '/api/swagger.json'
    }
  })
);

app.use(router.routes()).use(router.allowedMethods());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
