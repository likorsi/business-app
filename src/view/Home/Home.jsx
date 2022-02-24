import React from "react";

import {Loader} from '../../components/Loader/Loader';

const Home = props => {
	return (
		<div style={{textAlign: 'center', marginTop: 40}}>
			<h3>Home</h3>
			<p>Тут будет описание проекта - целевая страница / инструкции</p>
			<hr/>
			<Loader/>
		</div>
	)
}

export default Home