import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as firebaseAdmin from 'firebase-admin'
import * as serviceAccount from '../skyblog-8d79c-firebase-adminsdk-i9nu1-7af1ae5920.json'


export const admin = firebaseAdmin.initializeApp({
  // @ts-ignore
  credential: firebaseAdmin.credential.cert(serviceAccount)
})
export const storageRef = admin.storage().bucket('gs://skyblog-8d79c.appspot.com')

async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({credentials: true, origin: process.env.CLIENT_URL});

  await app.listen(PORT, () => console.log(`Server running om port: ${PORT}`));
}
bootstrap();
