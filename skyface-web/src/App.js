import React, { createContext, useReducer } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Blogs from "./pages/blogs";
import SignUp from "./pages/sign-up";
import BlogPost from "./pages/blog-post";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./credentials";
import EditBlogPost from "./pages/admin-area/edit-blog";
import Categories from "./pages/categories";
import SingleCategory from "./pages/single-category";
import ShowProfile from "./pages/show-profile";
import FileUpload from "./pages/admin-area/file-upload";
import AdminHome from "./pages/admin-area";
import ShowFiles from "./pages/admin-area/show-files";
import NotFound from "./pages/not-found";
import SignIn from "./pages/sign-in";
import CreateBlog from "./pages/admin-area/create-blog";
import CreateCategory from "./pages/admin-area/CreateCategory";
import SeriesPage from "./pages/Series";
import SingleSeries from "./pages/SingleSeries";
import CreateSeries from "./pages/admin-area/CreateSeries";
import SearchPage from "./pages/SearchPage";
import ContactForm from "./pages/Contact";
import { initialState, reducer } from "./store/reducer";
import Impressum from "./pages/impressum";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PendingComments from "./pages/admin-area/PendingComments";
import ShowContacts from "./pages/admin-area/show-contacts";
import DeckGl from "./pages/deckgl";
import UseGaTracker from "./useGATracker";
import { UseSelfTracker } from "./services/selfTracker";
import ShowSelfTracker from "./pages/admin-area/show-selftracker";
// import browserSignature from "browser-signature";

// import env from "react-dotenv";

// import Login from "./components/Login";
// import Home from "./components/Home";
export const AuthContext = createContext();

function App() {
  // const signature = browserSignature();
  // console.log("signature", signature);
  const [state, dispatch] = useReducer(reducer, initialState);
  // const clientId = env.GOOGLE_CLIENT_ID;
  // console.log("clientId", clientId);
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <GoogleOAuthProvider clientId={config.clientId}>
        <Router>
          <UseGaTracker />
          <UseSelfTracker />
          <Navbar />
          <div className="main-div">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/home" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:blogUrl" element={<BlogPost />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/contact" element={<ContactForm />} />
              {/* <Route path="/login/manuelly" element={<SignIn />} /> */}
              <Route path="/login" element={<SignIn />} />
              {/* <Route path="/sign-up" element={<SignUp />} /> */}
              <Route path="/register" element={<SignUp />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/category/:categoryUrl"
                element={<SingleCategory />}
              />
              <Route path="/users/:username" element={<ShowProfile />} />
              <Route path="/series" element={<SeriesPage />} />
              <Route path="/series/:seriesUrl" element={<SingleSeries />} />
              <Route path="/search" element={<SearchPage />} />
              {/* ADMIN AREA */}
              <Route
                path="/admin/edit-blog/:blogUrl"
                element={<EditBlogPost />}
              />
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/create-blog" element={<CreateBlog />} />
              <Route path="/admin/file-upload" element={<FileUpload />} />
              <Route path="/admin/show-files" element={<ShowFiles />} />
              <Route
                path="/admin/create-category"
                element={<CreateCategory />}
              />
              <Route path="/admin/create-series" element={<CreateSeries />} />
              <Route
                path="/admin/pending-comments"
                element={<PendingComments />}
              />
              <Route path="/admin/show-contacts" element={<ShowContacts />} />
              <Route
                path="/admin/show-selftracker"
                element={<ShowSelfTracker />}
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/deckgl" element={<DeckGl />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}

export default App;
