import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Post()
  create(@Body() trackData: CreateTrackDto) {
    const track = new this.trackModel({
      title: trackData.title,
      album: trackData.album,
      duration: trackData.duration,
    });
    return track.save();
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
  async deleteTrack(@Param('id') id: string) {
    return this.trackModel.findByIdAndDelete(id);
  }
}
