import {Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArtistDto } from './create-artist.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('artist')
export class ArtistController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {dest: './public/uploads/artist'})
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistDto: CreateArtistDto
  ) {
    const artist = new this.artistModel({
      name: artistDto.name,
      description: artistDto.description,
      picture: file ? '/uploads/albums/' + file.filename : null,
    });
    return artist.save();
  }
  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    return this.artistModel.findByIdAndDelete(id);
  }
}
