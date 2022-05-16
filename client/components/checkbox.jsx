import styles from '../styles/checkbox.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

function CheckBox({ onChange, name }) {
    return <input type='checkbox' className={cx('checkbox')} name={name} onChange={onChange} />;
}

export default CheckBox;
