import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { api } from '../../../utils/stashify.api';
import classnames from 'classnames/bind';
import TrackList from '../../../components/track-list';

// const cx = classnames.bind(styles);

const Tracks = () => {
    const router = useRouter();
    const { playlist_id } = router.query;

    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [playlistTracks, setPlaylistTracks] = useState(null);
    const selectedTracksState = useState({});

    useEffect(() => {
        async function getPlaylist() {
            let res;
            try {
                res = await api.get(`/playlists/${playlist_id}`);

                const { tracks, ...rest } = res.data;
                setPlaylistInfo(rest);
                setPlaylistTracks(tracks.items);
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
                <title>{playlistInfo.name} — Playlist</title>
            </Head>
            <TrackList trackList={playlistTracks} selectedTracksState={selectedTracksState} />
        </main>
    );
};

export default Tracks;
