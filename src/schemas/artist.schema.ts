import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Artist {
  @Prop({required: true})
  name: string;
  @Prop()
  description: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
export type ArtistDocument = Artist & Document;