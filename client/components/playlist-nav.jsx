import styles from '../styles/playlist-nav.module.scss';
import classnames from 'classnames/bind';
import NavLink from './nav-link';

const cx = classnames.bind(styles);

function PlaylistNav({ playlistId }) {
    return (
        <nav>
            <ul className={cx('pl-nav')}>
                <li>
                    <NavLink href={`/playlists/${playlistId}/tracks`}>Tracks</NavLink>
                </li>
                <li>
                    <NavLink href={`/playlists/${playlistId}/stash`}>Stash</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default PlaylistNav;
