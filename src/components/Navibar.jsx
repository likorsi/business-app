import React, {useRef} from 'react'
import {NavLink} from 'react-router-dom'
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import Menu from '../../public/icons/menu.svg'
import Exit from '../../public/icons/exit.svg'
import Enter from '../../public/icons/enter.svg'
import Profile from '../../public/icons/profile.svg'
import {lang} from "../lang";


export const Navibar = props => {

	// const styles = {
	// 	collapsing: {
	// 	  transition: 'height 500ms ease'
	// 	}
	// }

	const hideNav = useRef(0)

	const setHide = () => {

		if (props.auth) {
			hideNav.current.classList.add('collapsing')
			hideNav.current.classList.remove('show')
			hideNav.current.classList.remove('collapsing')
		}
	}

	const toggleHide = () => {
		// console.log(hideNav.current.style)
		// if (hideNav.current.style.height === "0px") {
  //       hideNav.current.style.height = `${ hideNav.current.scrollHeight }px`
	 //    } else {
	 //        hideNav.current.style.height = `${ hideNav.current.scrollHeight }px`;
	 //        window.getComputedStyle(hideNav.current, null).getPropertyValue("height");
	 //        hideNav.current.style.height = "0";
	 //    }


		hideNav.current.classList.toggle('show')

	}


	return (
		<Navbar collapseOnSelect expand="md" bg="white" variant="light" fixed="top">
		  <Container className="container-fluid">
		  <Nav onClick={() => setHide()}><Navbar.Brand as={NavLink} to='/'>{lang.appTitle}</Navbar.Brand></Nav>
		  {
		  	!props.auth
		  	? <Nav><Nav.Link as={NavLink} to="/auth"><Enter /></Nav.Link></Nav>
		  	: <><Button variant='light' className='d-md-none my-btn' onClick={() => toggleHide()}><Menu/></Button>
			  <Navbar.Collapse ref={hideNav} >
			    <Nav className='me-auto' onClick={() => toggleHide()} >
			    	{
			      		props.links.map((link, index) => 
		          			(<Nav.Link
								as={NavLink}
					          	to={link.to}
					          	className={link.status}
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
		      		className='disabled'
		          	to="/profile"
				  >
				    <Profile/>
				  </Nav.Link>
				  <Nav.Link as={NavLink} to="/auth" onClick={props.logout}><Exit /></Nav.Link>
			    </Nav>
			  </Navbar.Collapse></>
		  }
		  </Container>
		</Navbar>
	)
}