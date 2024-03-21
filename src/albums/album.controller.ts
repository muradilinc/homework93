import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateAlbumDto } from './create-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import express from 'express';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Controller('albums')
export class AlbumController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/albums',
        filename(
          _req: express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const filename = randomUUID();
          callback(null, filename + '' + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      author: albumData.author,
      title: albumData.title,
      release: albumData.release,
      image: file ? '/uploads/albums/' + file.filename : null,
    });
    return album.save();
  }

  @Get()
  getAll(@Query('authorId') authorId: string) {
    if (authorId) {
      return this.albumModel.find({ author: authorId });
    } else {
      return this.albumModel.find();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('author');
    if (!album) {
      throw new NotFoundException('No such albums!');
    }
    return album;
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    return this.albumModel.findByIdAndDelete(id);
  }
}
