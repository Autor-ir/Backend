import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PhotoService } from './photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';
import { PhotoTypeDto } from './dto/photo-type.dto';
import { PhotoTypeEnum } from './enum/PhotoType.enum';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folderName = `/manevis-storage/photos/${
            PhotoTypeEnum[req.query.type] ? req.query.type : 'trash'
          }`;
          fs.mkdirSync(folderName, { recursive: true });
          cb(null, folderName);
        },
        filename: (req, file, cb) => {
          return cb(
            null,
            `${
              PhotoTypeEnum[req.query.type] ? req.query.type : 'trash'
            }+${uuid()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  create(
    @Req() req,
    @Query() photoTypeDto: PhotoTypeDto,
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile() photo,
  ) {
    return this.photoService.create(
      req.user,
      createPhotoDto,
      photo,
      photoTypeDto,
    );
  }

  @Get(':fileName')
  async findOne(@Param('fileName') fileName: string) {
    return this.photoService.findOne(fileName);
  }

  @Get(':fileName/file')
  async findFile(@Param('fileName') fileName, @Res() res) {
    return res.sendFile(
      fileName,
      { root: `/manevis-storage/photos/${fileName.split('+')[0]}` },
      err => {
        if (err) {
          return res.status(HttpStatus.NOT_FOUND).send({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'تصویر مورد نظر یافت نشد!',
          });
        }
      },
    );
  }
}
