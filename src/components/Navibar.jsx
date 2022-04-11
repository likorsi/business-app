import React, {useRef} from 'react';
import PropTypes from "prop-types";
import {NavLink} from 'react-router-dom';
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import Menu from '../../public/icons/menu.svg';
import Exit from '../../public/icons/exit.svg';
import Enter from '../../public/icons/enter.svg';
import Profile from '../../public/icons/profile.svg';
import {lang} from "../lang";


const Navibar = ({auth, links, logout}) => {

	const hideNav = useRef(0)

	const setHide = () => {

		if (auth) {
			hideNav.current.classList.add('collapsing')
			hideNav.current.classList.remove('show')
			hideNav.current.classList.remove('collapsing')
		}
	}

	const toggleHide = () => {
		hideNav.current.classList.toggle('show')
	}


	return (
		<Navbar collapseOnSelect expand="md" bg="white" variant="light" fixed="top">
		  <Container className="container-fluid">
		  <Nav onClick={() => setHide()}><Navbar.Brand as={NavLink} to='/'>{lang.appTitle}</Navbar.Brand></Nav>
		  {
		  	!auth
		  	? <Nav><Nav.Link as={NavLink} to="/auth"><Enter /></Nav.Link></Nav>
		  	: <><Button variant='light' className='d-md-none my-btn' onClick={() => toggleHide()}><Menu/></Button>
			  <Navbar.Collapse ref={hideNav} >
			    <Nav className='me-auto' onClick={() => toggleHide()} >
			    	{
			      		links.map((link, index) =>
		          			(<Nav.Link
								as={NavLink}
					          	to={link.to}
					          	key={index}
					          >
					          	{link.label}
					          </Nav.Link>
			          		))
		          	}
			    </Nav>
			    <hr aria-expanded="false" />
			    <Nav >
			      <Nav.Link
				  	as={NavLink}
					onClick={() => toggleHide()}
		          	to="/profile"
				  >
				    <Profile/>
				  </Nav.Link>
				  <Nav.Link as={NavLink} to="/auth" onClick={logout}><Exit /></Nav.Link>
			    </Nav>
			  </Navbar.Collapse></>
		  }
		  </Container>
		</Navbar>
	)
}

Navibar.propTypes = {
	auth: PropTypes.bool.isRequired,
	links: PropTypes.array.isRequired,
	logout: PropTypes.func.isRequired
}

export default Navibar