import { gql } from "@apollo/client";

export const GET_ARTISTS_ALBUMS_SONGS = gql`
   query GetArtistsAlbumsSongs {
      allArtists {
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
`;
