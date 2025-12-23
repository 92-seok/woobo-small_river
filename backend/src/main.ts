import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:8080', // VITE 개발 서버 포트
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('백엔드 서버 실행 중: ', process.env.PORT || 3000);
}
bootstrap();
