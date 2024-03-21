import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Album } from './album.schema';
import mongoose from 'mongoose';

@Schema()
export class Track {
  @Prop({ required: true })
  title: string;

  @Prop({ ref: Album.name, required: true })
  album: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  duration: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
export type TrackDocument = Track & Document;
