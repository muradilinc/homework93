import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {NotFoundError} from "rxjs";
import {CreateAlbumDto} from "./create-album.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('album')
export class AlbumController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  getAll() {
    return this.albumModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('author');
    if (!album) {
      throw new NotFoundException('No such album!');
    }
    return album;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {dest: './public/uploads/albums'})
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto
  ) {
      const album = new this.albumModel({
        author: albumData.author,
        title: albumData.title,
        release: albumData.release,
        image: file ? '/upload/albums/' + file.filename : null,
      });
      return album.save();
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    return this.albumModel.findByIdAndDelete(id);
  }
}
