import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Artist, ArtistSchema} from "./schemas/artist.schema";
import { ArtistController } from './artist/artist.controller';
import { AlbumController } from './album/album.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/musics'),
    MongooseModule.forFeature([
      {name: Artist.name, schema: ArtistSchema},
    ]),
  ],
  controllers: [AppController, ArtistController, AlbumController],
  providers: [AppService],
})
export class AppModule {}
