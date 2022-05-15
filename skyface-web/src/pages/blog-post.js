import React from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

const baseURL = "http://localhost:5000/blog/";

const copyButtonLabel = "Copy Code";

function copyCode(code){
	navigator.clipboard.writeText(code);
}

export default function BlogPost() {
	let { blogUrl } = useParams();
	// console.log(id);
	const [posts, setPost] = React.useState(null);

	React.useEffect(() => {
		// setTimeout(() => {
		axios.post(baseURL + blogUrl).then((response) => {
			setPost(response.data);
			console.log(response.data);
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
					<h1>{posts["blog"].title}</h1>
					<h2>{posts["blog"].subtitle}</h2>
				</div>
			</div>
			{/* Blog Posts */}
			{(() => {
				const contentDivs = [];
				var content = posts["blogContent"];
				for (let i = 0; i < content.length; i++) {
					if (content[i].type === "text") {
						contentDivs.push(
							<div key={content[i]._id} className='content-div'>
							<p>{content[i].content}</p>
							</div>
						);
					}
					else if(content[i].type == "code"){
						
						contentDivs.push(
							// <div key={content[i]._id} >
								<pre className="pre-code">
									<code>{content[i].content}</code>
									<button className="copy-code-button" onClick={() => copyCode(content[i].content)}>{copyButtonLabel}</button>
								</pre>
							// </div>
						);
						//TODO: CHANGE
					}else if(content[i].type == "image"){
						contentDivs.push(
							<div key={content[i]._id} >
								<img src={content[i].content} alt="image" />
							</div>
						);
					}else if(content[i].type == "subline"){
						contentDivs.push(
							// <div key={content[i]._id} >
								<h3 className='sublines'>{content[i].content}</h3>
							// </div>
						);
					}
				}
				return contentDivs;
			})()}
		</div>
	);

}
