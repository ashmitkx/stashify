import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { api } from '../../../utils/stashify.api';
import TrackList from '../../../components/track-list';
import PlaylistInfo from '../../../components/playlist-info';

const Tracks = () => {
    const router = useRouter();
    const { playlist_id } = router.query;

    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [playlistTracks, setPlaylistTracks] = useState(null);
    const selectedTracksState = useState({});

    useEffect(() => {
        async function getPlaylist() {
            try {
                const resInfo = await api.get(`/playlists/${playlist_id}`);
                const resTracks = await api.get(`/playlists/${playlist_id}/tracks`);

                setPlaylistInfo(resInfo.data);
                setPlaylistTracks(resTracks.data.tracks.items);
            } catch (err) {
                console.error(err);
            }
        }

        if (playlist_id) getPlaylist();
    }, [playlist_id]);

    if (!playlistInfo || !playlistTracks) return null;
    return (
        <main>
            <Head>
                <title>{playlistInfo.name} — Tracks</title>
            </Head>
            <PlaylistInfo {...playlistInfo} />
            <TrackList trackList={playlistTracks} selectedTracksState={selectedTracksState} />
        </main>
    );
};

export default Tracks;
