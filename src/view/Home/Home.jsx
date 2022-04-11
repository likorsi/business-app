import React from "react";
import {Stack} from "react-bootstrap";
import Pic from '../../../public/icons/home-background.svg'
import {lang} from "../../lang";

const Home = () => {
	return (
			<Stack
				direction='horizontal'
				gap={2}
				style={{flexWrap: 'wrap', justifyContent: 'space-around'}}
				className='centered vertical-centered'
			>
				<div>
					<h2 style={{textAlign: "center"}}>{lang.appTitle}</h2>
					<p>{lang.appDescribe}</p>
				</div>
				<div style={{display: 'flex', overflow: 'hidden'}}><Pic/></div>
			</Stack>
	)
}

export default Home