import React from "react";
import axios from "axios";

function parentSort(fullList) {
  var sortedList = [];
  for (var i = 0; i < fullList.length; i++) {
    if (fullList[i].parent_category == null) {
      var childs = getChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      sortedList.push(fullList[i]);
    }
  }
  return sortedList;
}

function getChilds(currItemId, fullList) {
  var returnList = [];
  for (var i = 0; i < fullList.length; i++) {
    if (fullList[i].parent_category === currItemId) {
      var childs = getChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      returnList.push(fullList[i]);
    }
  }
  if (returnList.length === 0) return null;
  return returnList;
}

function childsToHTML(childPrefix, currList) {
  var returnHTML = [];
  if (currList == null) return returnHTML;
  for (var i = 0; i < currList.length; i++) {
    returnHTML.push(
      <div key={currList[i]._id}>
        <a href={`/category/${currList[i].url}`} className="category-item">
          {childPrefix} {currList[i].name} - {currList[i].description}
        </a>

        {childsToHTML(childPrefix + " -", currList[i].children)}
      </div>
    );
  }
  return returnHTML;
}

const Categories = () => {
  const baseURL = "http://localhost:5000/";

  const [categories, setCategories] = React.useState(null);

  React.useEffect(() => {
    // setTimeout(() => {
    axios.post(baseURL + "blog-categories").then((response) => {
      setCategories(parentSort(response.data));
    });
  }, []);

  if (!categories) return <div className="loader" />;

  return (
    <div
      style={{
        textAlign: "left",
      }}
    >
      {(() => {
        return categories.map((category) => {
          return (
            <div key={category._id}>
              <a href={`/category/${category.url}`} className="category-item">
                {category.name} - {category.description}
              </a>
              {(() => {
                if (category.children) {
                  return <div>{childsToHTML("-", category.children)}</div>;
                }
              })()}
            </div>
          );
        });
      })()}
    </div>
  );
};
export default Categories;
