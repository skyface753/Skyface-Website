import React from 'react';
import Star from '../img/star';
import Arrow from '../img/arrow';
import apiService from '../services/api-service';
import { SkyCloudLoader } from '../components/Loader';
import ProjectsPreview from '../components/ProjectsPreview';
import BlogPreviewOL from '../components/blog-preview';

const Home = () => {
  const [latestPosts, setLatestPosts] = React.useState(null);
  const [last3Projects, setLast4Projects] = React.useState(null);

  React.useEffect(() => {
    //Timeout 2 seconds to simulate loading
    // setTimeout(() => {
    apiService('blogs/last5').then((response) => {
      if (response.data.success) {
        setLatestPosts(response.data['blogs']);
      }
    });
    apiService('projects/last3').then((response) => {
      if (response.data.success) {
        setLast4Projects(response.data['projects']);
      }
    });
    // }, 500);
  }, []);

  document.title = 'SkyBlog - Home';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        // alignItems: "Right",
        // height: "100vh",
        flexDirection: 'column',
      }}
    >
      {/* <CloudLoader /> */}
      {/* <CloudsRainLoader /> */}

      <h1 className='home-title animate__animated animate__slideInUp'>
        Hi, I'm Sebastian
      </h1>
      <p className='home-description'>
        I'm a <strong>computer science student </strong>
        in <strong>Darmstadt</strong>. I develop web and mobile apps as a hobby{' '}
        <strong>fullstack </strong>developer. This is my site,{' '}
        <strong>SkyBlog</strong> (build with React and NodeJS), where I blog and
        share whatever side projects I've been working on.
      </p>
      {/* <div className="y"> */}
      <div className='home-connect'>
        <Star />
        <strong
          style={{
            marginLeft: '10px',
          }}
        >
          Socials
        </strong>
        <p className='home-connect-text'>
          You can find me on{' '}
          <strong>
            <a
              href='https://www.instagram.com/_seppel99_/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Instagram
            </a>
          </strong>
          ,{' '}
          <strong>
            <a
              href='https://github.com/skyface753'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub
            </a>
          </strong>
          , and{' '}
          <strong>
            <a
              href='https://de.linkedin.com/in/sebastian-j%C3%B6rz-01a708232/en?trk=people-guest_people_search-card'
              target='_blank'
              rel='noopener noreferrer'
            >
              LinkedIn
            </a>
          </strong>
          .
        </p>
      </div>
      {/* Latest Blogs */}
      <section className='home-latest-posts'>
        <h2 className='home-latest-posts-title'>Latest Blog Posts</h2>
        {latestPosts ? (
          <BlogPreviewOL blogList={latestPosts} UserIsAdmin={false} />
        ) : (
          <SkyCloudLoader />
        )}
        {/* <ol className="home-latest-posts-elemets">
          {latestPosts ? (
            latestPosts.map((post) => {
              return createPostsArticle(
                post.title,
                post.url,
                post.createdAt.substring(0, 10)
              );
            })
          ) : (
            <SkyCloudLoader />
          )} */}
        {/* {createPostsArticle(
            "SkyBlog - A Blog for Myself",
            "url-test-12",
            "2022-06-04"
          )} */}
        {/* </ol> */}
        <a href='/blogs/' className='home-latest-posts-more'>
          <span className='home-latest-posts-text'>more blog posts</span>{' '}
          <Arrow />
        </a>
      </section>
      {/* Projects */}
      {last3Projects ? (
        <ProjectsPreview
          UserIsAdmin={false}
          projects={last3Projects}
          showMoreLink={true}
        />
      ) : (
        <SkyCloudLoader />
      )}
    </div>
  );
};

export default Home;
