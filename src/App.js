import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ARTISTS_ALBUMS_SONGS } from "./graphql/queries";
import {
   ADD_ARTIST_ALBUM_SONGS,
   DELETE_ARTIST,
   UPDATE_ARTIST,
   UPDATE_ALBUM,
} from "./graphql/mutations";
import "./App.css";

function App() {
   const { loading, error, data } = useQuery(GET_ARTISTS_ALBUMS_SONGS);
   const [addArtistWithAlbumAndSongs] = useMutation(ADD_ARTIST_ALBUM_SONGS, {
      refetchQueries: [{ query: GET_ARTISTS_ALBUMS_SONGS }],
      onError: (error) => console.error("Mutation error:", error),
   });
   const [deleteArtist] = useMutation(DELETE_ARTIST, {
      refetchQueries: [{ query: GET_ARTISTS_ALBUMS_SONGS }],
      onError: (error) => console.error("Mutation error:", error),
   });
   const [updateArtist] = useMutation(UPDATE_ARTIST);
   const [updateAlbum] = useMutation(UPDATE_ALBUM);

   const [artistName, setArtistName] = useState("");
   const [albumTitle, setAlbumTitle] = useState("");
   const [songs, setSongs] = useState([""]);

   const [editing, setEditing] = useState(null);
   const [newValue, setNewValue] = useState("");

   if (loading) return <p>Loading...</p>;
   if (error) return <p>Error: {error.message}</p>;

   const handleSongChange = (index, value) => {
      const newSongs = [...songs];
      newSongs[index] = value;
      setSongs(newSongs);
   };

   const addSongField = () => {
      setSongs([...songs, ""]);
   };

   const handleAddArtistAlbumSongs = () => {
      if (
         artistName.trim() &&
         albumTitle.trim() &&
         songs.length > 0 &&
         songs[0].trim()
      ) {
         addArtistWithAlbumAndSongs({
            variables: {
               name: artistName,
               albumTitle: albumTitle,
               songs: songs.filter((song) => song.trim() !== ""),
            },
         }).catch((error) => console.error("Mutation failed:", error));
         setArtistName("");
         setAlbumTitle("");
         setSongs([""]);
      }
   };

   const handleDeleteArtist = (artistId) => {
      deleteArtist({
         variables: { artistId },
      }).catch((error) => console.error("Mutation failed:", error));
   };

   const handleUpdateArtist = (artistId, newName) => {
      updateArtist({ variables: { artistId, newName } })
         .then(() => console.log("Artist updated successfully"))
         .catch((error) => console.error("Update failed:", error));
   };

   const handleUpdateAlbum = (albumId, newTitle) => {
      updateAlbum({ variables: { albumId, newTitle } })
         .then(() => console.log("Album updated successfully"))
         .catch((error) => console.error("Update failed:", error));
   };

   const handleEdit = (type, id) => {
      window.scrollTo(0, document.body.scrollHeight);
      setEditing({ type, id });
   };

   const handleSave = () => {
      if (editing) {
         if (editing.type === "artist") {
            handleUpdateArtist(editing.id, newValue);
         } else if (editing.type === "album") {
            handleUpdateAlbum(editing.id, newValue);
         }
         setEditing(null);
         setNewValue("");
      }
   };

   return (
      <div className="container">
         <h1>Music Collection</h1>

         <div className="add-artist-form">
            <input
               type="text"
               value={artistName}
               onChange={(e) => setArtistName(e.target.value)}
               placeholder="Artist Name"
            />
            <input
               type="text"
               value={albumTitle}
               onChange={(e) => setAlbumTitle(e.target.value)}
               placeholder="Album Title"
            />

            <div className="songs-input">
               {songs.map((song, index) => (
                  <input
                     key={index}
                     type="text"
                     value={song}
                     onChange={(e) => handleSongChange(index, e.target.value)}
                     placeholder={`Song ${index + 1}`}
                  />
               ))}
               <button className="add-anotherSong-btn" onClick={addSongField}>
                  Add another song
               </button>
            </div>

            <button
               className="add-artist-song-album-btn"
               onClick={handleAddArtistAlbumSongs}
            >
               Add Artist with Album and Songs
            </button>
         </div>

         <div className="artist-list">
            {data.allArtists.map((artist) => (
               <div key={artist.id} className="artist-card">
                  <h3 className="artist-name">
                     ARTIST: {artist.name}
                     <button
                        className="edit-artist-btn"
                        onClick={() => handleEdit("artist", artist.id)}
                     >
                        Edit Artist
                     </button>
                  </h3>
                  <div className="album-list">
                     {artist.albums.map((album) => (
                        <div key={album.id} className="album-card">
                           <h3 className="album-title">
                              ALBUM: {album.title}
                              <button
                                 className="edit-album-btn"
                                 onClick={() => handleEdit("album", album.id)}
                              >
                                 Edit Album
                              </button>
                           </h3>
                           <ul className="song-list">
                              <h3>Songs:</h3>
                              {album.songs.map((song) => (
                                 <li key={song.id} className="song-item">
                                    {song.title}
                                 </li>
                              ))}
                           </ul>
                           <button
                              onClick={() => handleDeleteArtist(artist.id)}
                              className="delete-button"
                           >
                              Delete Artist
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {editing && (
            <div className="edit-form">
               <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={`New ${editing.type} name/title`}
                  autoFocus
               />
               <button onClick={handleSave} className="save-button">
                  Save
               </button>
               <button
                  onClick={() => setEditing(null)}
                  className="cancel-button"
               >
                  Cancel
               </button>
            </div>
         )}
      </div>
   );
}

export default App;
