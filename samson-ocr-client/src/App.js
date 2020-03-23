import React from 'react';
import Header from './components/header';
import Home from './routes/home';

const App = (props) => {
	return (
		<div id="app">
			<Header />
			<Home />
		</div>
	);
}

export default App
