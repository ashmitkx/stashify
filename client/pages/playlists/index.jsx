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
                    <Link href={`/playlists/${playlist.id}/tracks`} key={playlist.id}>
                        <a>
                            <Playlist {...playlist} />
                        </a>
                    </Link>
                ))}
            </div>
        </main>
    );
}

function Playlist({ name, owner_name, track_count, description, images, type }) {
    const image = images[0];

    return (
        <article className={cx('playlist')}>
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
        </article>
    );
}

export default Playlists;
