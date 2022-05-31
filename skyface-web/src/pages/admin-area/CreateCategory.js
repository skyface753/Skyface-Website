import React from "react";
import apiService from "../../services/api-service";
import ShowCategoriesSelect from "../../components/showCategoriesSelect";

const emptyCategory = {
  name: "",
  description: "",
  parent_category: null,
  url: "",
};

function checkIfCategoryIsFree(categoryUrl, cbSetError) {
  if (!categoryUrl) {
    cbSetError("Category URL is required");
    return false;
  }
  apiService("admin/category/checkFreeUrl/" + categoryUrl, {}).then(
    (response) => {
      if (response.data.success) {
        cbSetError(null);
      } else {
        cbSetError("Category URL is not free");
      }
    }
  );
}

export default function CreateCategory() {
  const [category, setCategory] = React.useState(emptyCategory);
  const [error, setError] = React.useState(null);

  return (
    <div>
      <h1>Create Category</h1>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={category.name}
          onChange={(e) => {
            setCategory({ ...category, name: e.target.value });
          }}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={category.description}
          onChange={(e) => {
            setCategory({ ...category, description: e.target.value });
          }}
        />
      </div>
      <ShowCategoriesSelect selectedID={
        category.parent_category ? category.parent_category : null

      } onChange={(e) => {
          console.log("New Selected: " + e.target.value);
          setCategory({ ...category, parent_category: e.target.value });
        }} />
      <div>
        <label>Parent Category</label>
        <input
          type="text"
          value={category.parent_category}
          onChange={(e) => {
            setCategory({ ...category, parent_category: e.target.value });
          }}
        />
      </div>
      <div>
        <label>URL</label>
        <input
          type="text"
          value={category.url}
          onChange={(e) => {
            setCategory({ ...category, url: e.target.value });
            checkIfCategoryIsFree(e.target.value, setError);
          }}
        />
      </div>
      <p
        style={{
          color: error ? "red" : "black",
        }}
      >
        {error}
      </p>
      <button
        onClick={() => {
          if (!category.name || !category.url || !category.description) {
            alert("Name, Description and URL are required");
            return;
          }
          apiService("admin/category/create", category).then((response) => {
            if (response.data.success) {
              alert("Category created successfully");
            }
          });
        }}
        {...(error ? { disabled: true } : {})}
      >
        Create
      </button>
    </div>
  );
}
