import React from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/api-service";
import BlogPreviewOL from "../components/blog-preview";
import { MeetupLoader, SkyCloudLoader } from "../components/Loader";
import CheckIfAdmin from "../services/CheckIfAdmin";
import ShowCategoriesSelect from "../components/showCategoriesSelect";

export default function SingleCategory() {
  var { categoryUrl } = useParams();
  var UserIsAdmin = CheckIfAdmin();

  const [category, setCategory] = React.useState(null);
  const [editCategory, setEditCategory] = React.useState(null);
  const [posts, setPosts] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    apiService("blog-categories/" + categoryUrl, {}).then((response) => {
      console.log(response.data);
      setCategory(response.data["category"]);
      setEditCategory(response.data["category"]);
      setPosts(response.data["blogs"]);
    });
  }, []);

  if (!category) return <SkyCloudLoader />;

  return (
    <div>
      {category ? (
        editMode ? (
          <div>
            <h1>Edit Category</h1>
            <input
              type="text"
              value={editCategory.name}
              onChange={(e) => {
                editCategory.name = e.target.value;
                setEditCategory({ ...editCategory });
              }}
            />
            <input
              type="text"
              value={editCategory.description}
              onChange={(e) => {
                editCategory.description = e.target.value;
                setEditCategory({ ...editCategory });
              }}
            />
            <input
              type="text"
              value={editCategory.url}
              onChange={(e) => {
                editCategory.url = e.target.value;
                setEditCategory({ ...editCategory });
              }}
            />
            <ShowCategoriesSelect
              selectedID={editCategory.parent_category}
              onChange={(e) => {
                console.log("Selected ID: " + e.target.value);
                if (e.target.value === editCategory._id) {
                  alert("You cannot set a category as its own parent");
                  return;
                }
                editCategory.parent_category = e.target.value;
                setEditCategory({ ...editCategory });
                // editCategory.parent_category = id;
                // setEditCategory({ ...editCategory });
              }}
            />
            <button
              onClick={() => {
                if (editCategory.parent_category === editCategory._id) {
                  alert("You can't set a category as its own parent!");
                  return;
                }
                apiService("admin/category/edit", editCategory).then(
                  (response) => {
                    if (response.data.success) {
                      setEditMode(false);
                      setCategory(response.data.category);
                      window.location = "/category/" + editCategory.url;
                    } else {
                      alert(response.data.message);
                    }
                  }
                );
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this category?"
                  )
                ) {
                  apiService("admin/category/delete/" + editCategory._id).then(
                    (response) => {
                      if (response.data.success) {
                        window.location = "/";
                      } else {
                        alert(response.data.message);
                      }
                    }
                  );
                }
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            {UserIsAdmin ? (
              <button
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </button>
            ) : null}
          </div>
        )
      ) : (
        <div>Loading...</div>
      )}
      {posts ? (
        <BlogPreviewOL blogList={posts} UserIsAdmin={false} marginLeft="0px" />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
