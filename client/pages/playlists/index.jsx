import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames/bind';

import { api } from '../../utils/stashify.api';
import styles from '../../styles/playlists.module.scss';
const cx = classnames.bind(styles);

function Playlists() {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        async function getCurrPlaylists() {
            try {
                const res = await api.get(`/me/playlists`);
                setPlaylists(res.data.items);
            } catch (err) {
                console.error(err);
            }
        }
        getCurrPlaylists();
    }, []);

    return (
        <main>
            <Head>
                <title>Your Playlists</title>
            </Head>

            <h1>Your Playlists</h1>
            <div className={cx('playlists')}>
                {playlists?.map(playlist => (
                    <Playlist key={playlist.id} {...playlist} />
                ))}
            </div>
        </main>
    );
}

function Playlist({ name, id: playlist_id, owner_name, track_count, description, images, type }) {
    const image = images[0];

    return (
        <Link href={`/playlists/${playlist_id}/tracks`}>
            <a className={cx('playlist')}>
                <div className={cx('img-cnt')}>
                    <Image
                        src={image?.url || '/images/missing-song-art.png'}
                        alt='playlist img'
                        height={image?.height || 640}
                        width={image?.width || 640}
                        layout='responsive'
                    />
                </div>
                <h2>{name}</h2>
                <p className='sub --small'>{description || `By ${owner_name}`}</p>
            </a>
        </Link>
    );
}

export default Playlists;
