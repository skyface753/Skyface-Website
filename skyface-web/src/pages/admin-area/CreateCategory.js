import React from "react";
import apiService from "../../services/api-service";

const emptyCategory = {
    name: "",
    description: "",
    parent_category: null,
    url: "",
};

export default function CreateCategory(){
    const [category, setCategory] = React.useState(emptyCategory);

    return (
        <div>
            <h1>Create Category</h1>
            <div>
                <label>Name</label>
                <input type="text" value={category.name} onChange={(e) => setCategory({...category, name: e.target.value})} />
            </div>
            <div>
                <label>Description</label>
                <input type="text" value={category.description} onChange={(e) => setCategory({...category, description: e.target.value})} />
            </div>
            <div>
                <label>Parent Category</label>
                <input type="text" value={category.parent_category} onChange={(e) => setCategory({...category, parent_category: e.target.value})} />
            </div>
            <div>
                <label>URL</label>
                <input type="text" value={category.url} onChange={(e) => setCategory({...category, url: e.target.value})} />
            </div>
            <button onClick={() => {
                apiService("admin/category/create", category).then((response) => {
                    if(response.data.success) {
                        alert("Category created successfully");
                    }
                });
            }
            }>Create</button>
        </div>
    );
}