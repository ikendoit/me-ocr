import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>Me OCR</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Main</Link>
			<Link activeClassName={style.active} href="/profile">Account</Link>
			<Link activeClassName={style.active} href="/setting">Setting</Link>
		</nav>
	</header>
);

export default Header;
