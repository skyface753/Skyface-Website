import React from 'react';

const Blogs = () => {
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
            <div className='title-container'>
                <img src={require('../img/blogs-title.png')}
                    width="100%" alt='About-Title' />
                <div className='title-container-text'>
                    <h1>Welcome to SkyBlog</h1>
                    <h2>Coding-Blog</h2>
                </div>
            </div>
            {/* Divider */}
            <div className="divider" />
            {/* Card */}
            <div >
                <div >
                    <h5>Blogs</h5>
                    <p>This is a blog for all the coding related stuff.</p>
                </div>
                <div>Column 1</div>
                <div>Column 2</div>
                <div>Column 3</div>
                <div>Column 4</div>
                
            </div>
        </div>
    );
};

export default Blogs;
