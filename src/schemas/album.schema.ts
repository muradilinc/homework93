import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from './artist.schema';
import mongoose from 'mongoose';

@Schema()
export class Album {
  @Prop({ ref: Artist.name, required: true })
  author: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  release: number;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
export type AlbumDocument = Album & Document;
