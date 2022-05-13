import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import Blogs from './pages/blogs';
import SignUp from './pages/signup';
import BlogPost from './pages/blog-post';

function App() {
return (
	<Router>
	<Navbar />
	<Routes>
		<Route path='/' exact element={<Home />} />
		<Route path='/about' element={<About />} />
		<Route path='/blogs' element={<Blogs />} />
		<Route path='/blogs/:id' element={<BlogPost />} />
		<Route path='/sign-up' element={<SignUp />} />
	</Routes>
	<Footer />
	</Router>
);
}

export default App;
