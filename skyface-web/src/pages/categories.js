import React from "react";
import apiService from "../services/api-service";
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
var categoryMarginValue = 15
function childsToHTML(currList, childMargin = categoryMarginValue) {
  var returnHTML = [];
  if (currList == null) return returnHTML;
  for (var i = 0; i < currList.length; i++) {
    var currmargin = childMargin + "px";
    returnHTML.push(
      <div key={currList[i]._id} style={{ marginLeft: currmargin }}>
        <a href={`/category/${currList[i].url}`} className="category-item">
          {currList[i].name} - {currList[i].description}
        </a>

        {childsToHTML(currList[i].children, childMargin + categoryMarginValue)}
      </div>
    );
  }
  return returnHTML;
}

const Categories = () => {
  

  const [categories, setCategories] = React.useState(null);

  React.useEffect(() => {
    apiService("blog-categories").then((response) => {
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
                  return <div>{childsToHTML(category.children)}</div>;
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