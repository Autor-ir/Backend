import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { SubjectModule } from './subject/subject.module';
import { LabelModule } from './label/label.module';
import { PhotoModule } from './photo/photo.module';
import * as env from 'dotenv';
env.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      },
      defaults: {
        from: `"Manevis.com" <${process.env.GMAIL_USER}>`,
      },
      template: {
        dir: __dirname + '/../src/email-templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UsersModule,
    PostModule,
    SubjectModule,
    LabelModule,
    PhotoModule,
  ],
})
export class AppModule {}
