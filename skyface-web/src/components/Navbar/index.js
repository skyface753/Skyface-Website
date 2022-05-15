import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
} from './NavbarElements';

// import { useScroll } from '../../hooks/useScroll';

export default function Navbar(){
	// const { y, x, scrollDirection } = useScroll(); 
	// const styles = {
	// 	active: {
	// 	  visibility: "visible",
	// 	  transition: "all 0.5s"
	// 	},
	// 	hidden: {
	// 	  visibility: "hidden",
	// 	  transition: "all 0.5s",
	// 	  transform: "translateY(-100%)"
	// 	}
	//   }
return (
	<>
	<Nav /*style={scrollDirection === "down" ? styles.active: styles.hidden}*/ >
		<Bars/>
		<NavMenu>
		<NavLink to='/about' activeStyle>
			About
		</NavLink>
		<NavLink to='/blogs' activeStyle>
			Blogs
		</NavLink>
		<NavLink to='/sign-up' activeStyle>
			Sign Up
		</NavLink>
		{/* Second Nav */}
		{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
		</NavMenu>
		<NavBtn>
		<NavBtnLink to='/signin'>Sign In</NavBtnLink>
		</NavBtn>
	</Nav>
	</>
);
};

