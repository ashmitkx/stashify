import { useState } from 'react';
import Image from 'next/image';
import classnames from 'classnames/bind';

import styles from '../styles/track-list.module.scss';
import { timeSince, timeToDuration } from '../utils/date-parse';
import CheckBox from './checkbox';
const cx = classnames.bind(styles);

function TrackList({ trackList, selectedTracksState }) {
    const [selectedTracks, setSelectedTracks] = selectedTracksState;

    // update checked value, on checkbox change
    function onCheck(e) {
        const checkbox = e.target;
        setSelectedTracks({ ...selectedTracks, [checkbox.name]: checkbox.checked });
    }

    return (
        <section className={cx('tracks')}>
            {trackList?.map((track, index) => (
                <Track
                    key={track.track.id + track.added_at}
                    {...track}
                    srNo={index + 1}
                    selected={selectedTracks[track.track.id]}
                    onCheck={onCheck}
                />
            ))}
        </section>
    );
}

function Track({ added_at, track, srNo, selected, onCheck }) {
    const [hovering, setHovering] = useState(false);
    const mouseEnter = () => setHovering(true);
    const mouseLeave = () => setHovering(false);

    let { album, artists, name, duration_ms } = track;
    const image = album.images?.[album.images.length - 1]; // pick out smallest resolution image
    artists = artists.map(artist => artist.name).join(', '); // comma separate artist names
    added_at = timeSince(added_at); // parse timestamp
    const duration = timeToDuration(duration_ms); // parse duration

    const showCheckBox = hovering || selected;

    return (
        <div className={cx('track')} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
            <div className={cx('main-info')}>
                <div className={cx('select')}>
                    {showCheckBox ? (
                        <CheckBox onChange={onCheck} name={track.id} />
                    ) : (
                        <span className='sub --large'>{srNo}</span>
                    )}
                </div>
                <div className={cx('img-cnt')}>
                    <Image
                        src={image?.url || '/images/missing-song-art.png'}
                        alt='track img'
                        height={image?.height || 64}
                        width={image?.width || 64}
                        layout='responsive'
                    />
                </div>
                <div className={cx('text')}>
                    <h3>{name}</h3>
                    <span className='sub --small'>{artists}</span>
                </div>
            </div>
            <span className='sub'>{album.name}</span>
            <span className='sub'>{added_at}</span>
            <span className='sub'>{duration}</span>
        </div>
    );
}

export default TrackList;
