import Image from 'next/image';

import styles from '../styles/playlist-info.module.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const PlaylistInfo = ({ images, description, name, owner, public: isPublic }) => {
    const image = images?.[0]; // pick out highest resolution image
    const visibility = isPublic ? 'public' : 'private';

    return (
        <header className={cx('playlist-info')}>
            <div className={cx('img-cnt')}>
                <Image
                    src={image?.url || '/images/missing-song-art.png'}
                    alt='track img'
                    height={image?.height || 640}
                    width={image?.width || 640}
                    layout='responsive'
                />
            </div>
            <div className={cx('main-info')}>
                <span className='sub --small'>{`${visibility} playlist`}</span>
                <h1>{name}</h1>
                {description && <p className='sub'>{description}</p>}
                <div className={cx('extra-info')}>By {owner.display_name}</div>
            </div>
        </header>
    );
};

export default PlaylistInfo;
