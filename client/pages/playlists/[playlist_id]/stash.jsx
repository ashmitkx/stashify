import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { api } from '../../../utils/stashify.api';
import TrackList from '../../../components/track-list';
import PlaylistInfo from '../../../components/playlist-info';

const Stash = () => {
    const router = useRouter();
    const { playlist_id } = router.query;

    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [stashTracks, setStashTracks] = useState(null);
    const selectedTracksState = useState({});

    useEffect(() => {
        async function getStash() {
            try {
                const resInfo = await api.get(`/playlists/${playlist_id}`);
                const resTracks = await api.get(`/playlists/${playlist_id}/stash`);

                setPlaylistInfo(resInfo.data);
                setStashTracks(resTracks.data.tracks);
            } catch (err) {
                console.error(err);
            }
        }

        if (playlist_id) getStash();
    }, [playlist_id]);

    if (!playlistInfo || !stashTracks) return null;
    return (
        <main>
            <Head>
                <title>{playlistInfo.name} — Stash</title>
            </Head>
            <PlaylistInfo {...playlistInfo} />
            <TrackList trackList={stashTracks} selectedTracksState={selectedTracksState} />
        </main>
    );
};

export default Stash;
