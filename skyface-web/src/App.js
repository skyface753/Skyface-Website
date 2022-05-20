import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Blogs from "./pages/blogs";
import SignUp from "./pages/signup";
import BlogPost from "./pages/blog-post";
import { GoogleOAuthProvider } from "@react-oauth/google";
import getCredentials from "./credentials";
import EditBlogPost from "./pages/edit-blog";
import Categories from "./pages/categories";
import SingleCategory from "./pages/single-category";

function App() {
  return (
    <GoogleOAuthProvider clientId={getCredentials()}>
      <Router>
        <Navbar />
        <div className="main-div">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:blogUrl" element={<BlogPost />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/edit-blog/:blogUrl" element={<EditBlogPost />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:categoryUrl" element={<SingleCategory />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
