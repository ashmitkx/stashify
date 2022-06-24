import { useRouter } from 'next/router';
import Link from 'next/link';

function NavLink({ href, children, ...props }) {
    const { asPath } = useRouter();
    const isActive = asPath.startsWith(href);

    props.className ??= '';
    props.className += ' navlink'; // common class to catch both span and a

    if (isActive) {
        props.className += ' --active';
        return <span {...props}>{children}</span>;
    }

    return (
        <Link href={href}>
            <a {...props}>{children}</a>
        </Link>
    );
}

export default NavLink;
