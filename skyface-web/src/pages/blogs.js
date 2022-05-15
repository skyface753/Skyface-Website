import React from 'react';
import axios from "axios";

const baseURL = "http://localhost:5000/blogs";

function gotoBlock(url) {
	window.location.href = `/blogs/${url}`;
}

export default function Blogs() {
	const [posts, setPost] = React.useState(null);

	React.useEffect(() => {
		// setTimeout(() => {
			axios.post(baseURL).then((response) => {
				setPost(response.data);
			});
	}, []);

	if (!posts) return <div className='loader' />;

	
	return (
		<div
			style={
				{
					width: '80%',
					margin: '0 auto',
					textAlign: 'center',
					border: '1px solid #e0e0e0',
					padding: '5%',
				}
			}>
			<div className='title-container' >
				<img src={require('../img/blogs-title.png')}
					width="100%" alt='About-Title' />
				<div className='title-container-text'>
					<h1>Welcome to SkyBlog</h1>
					<h2>Coding-Blog</h2>
				</div>
			</div>
			{/* Blog Posts */}
			{(() => {
				const blogDivs = [];
				for(let i = 0; i < posts.length; i++) {
					blogDivs.push(

				<div key={posts[i]._id} className='blog-preview'
				onClick={() => gotoBlock(posts[i].url)}>
					<div >
						<h2>{posts[i].title}</h2>
						<p>{posts[i].subtitle}</p>
					</div>
					

					<hr className='blog-divider'></hr>
				</div>
					);
				}
				return blogDivs;
			})()}
        </div>
	);

}
