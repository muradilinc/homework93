import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  SetMetadata,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitAuthGuard } from '../auth/permit-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Post()
  @UseGuards(TokenAuthGuard)
  async create(@Body() trackData: CreateTrackDto) {
    try {
      const track = new this.trackModel({
        title: trackData.title,
        album: trackData.album,
        duration: trackData.duration,
      });
      return await track.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }

      throw error;
    }
  }

  @Get()
  getAll(@Query('albumId') albumId: string) {
    if (albumId) {
      return this.trackModel.find({ album: albumId });
    } else {
      return this.trackModel.find();
    }
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, PermitAuthGuard)
  @SetMetadata('roles', 'admin')
  deleteTrack(@Param('id') id: string) {
    return this.trackModel.findByIdAndDelete(id);
  }
}
