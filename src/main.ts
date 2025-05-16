import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from 'common/exception/http-exception-filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/v1')
  app.enableCors()

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === 'production',
      whitelist: true,
      transform: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Struckly API')
    .setDescription('Struckly API description')
    .setVersion('1.0')
    .addTag('Struckly')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  const logger = new Logger('Server')

  const port = process.env.PORT ?? 3000

  await app.listen(port)
  logger.log(`Server started on port ${port}`)
}
void bootstrap()
