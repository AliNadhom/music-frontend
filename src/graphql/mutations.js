import { gql } from "@apollo/client";

export const ADD_ARTIST_ALBUM_SONGS = gql`
   mutation AddArtistWithAlbumAndSongs(
      $name: String!
      $albumTitle: String!
      $songs: [String!]!
   ) {
      addArtistWithAlbumAndSongs(
         name: $name
         albumTitle: $albumTitle
         songs: $songs
      ) {
         artist {
            id
            name
            albums {
               id
               title
               songs {
                  id
                  title
               }
            }
         }
      }
   }
`;

export const DELETE_ARTIST = gql`
   mutation DeleteArtist($artistId: ID!) {
      deleteArtist(artistId: $artistId) {
         success
      }
   }
`;

export const UPDATE_ARTIST = gql`
   mutation UpdateArtist($artistId: ID!, $newName: String!) {
      updateArtist(artistId: $artistId, newName: $newName) {
         artist {
            id
            name
         }
      }
   }
`;

export const UPDATE_ALBUM = gql`
   mutation UpdateAlbum($albumId: ID!, $newTitle: String!) {
      updateAlbum(albumId: $albumId, newTitle: $newTitle) {
         album {
            id
            title
         }
      }
   }
`;
