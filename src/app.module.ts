import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { ArtistController } from './artists/artist.controller';
import { AlbumController } from './albums/album.controller';
import { Album, AlbumSchema } from './schemas/album.schema';
import { TracksController } from './tracks/tracks.controller';
import { Track, TrackSchema } from './schemas/tracks.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/musics'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
  ],
  controllers: [
    AppController,
    ArtistController,
    AlbumController,
    TracksController,
  ],
  providers: [AppService],
})
export class AppModule {}
