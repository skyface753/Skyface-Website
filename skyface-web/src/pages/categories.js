import React from "react";
import apiService from "../services/api-service";
import { SkyCloudLoader } from "../components/Loader";

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
var categoryMarginValue = 20;
function childsToHTML(currList, childMargin = categoryMarginValue) {
  var returnHTML = [];
  if (currList == null) return returnHTML;

  for (var i = 0; i < currList.length; i++) {
    var currmargin = childMargin + "px";
    if (currList[i].children) {
      returnHTML.push(
        // <details open key={currList[i]._id} style={{ marginLeft: currmargin }}>
        //   <summary>
        <ol
          className="categories-list"
          key={currList[i]._id}
          style={{ marginLeft: currmargin }}
        >
          <CategoriesPreview category={currList[i]} currmargin={currmargin} />
          {childsToHTML(
            currList[i].children,
            childMargin + categoryMarginValue
          )}
        </ol>
        // </summary>
        // </details>
      );
    } else {
      returnHTML.push(
        <CategoriesPreview category={currList[i]} currmargin={currmargin} />
      );
    }
  }
  return returnHTML;
}

const CategoriesPreview = ({ category, currmargin }) => {
  return (
    // <li key={category._id} style={{ marginLeft: currmargin }}>
    <article
      className="categories-article"
      key={category._id}
      style={{ marginLeft: currmargin }}
    >
      {/* <Star />{" "} */}
      <div className="categories-article-title">
        <a href={`/category/${category.url}`}>{category.name}</a>
      </div>
      {/* <div className="categories-article-description">
        {category.description}
      </div> */}
      <div className="categories-article-count">{category.blogCount} Blogs</div>
    </article>
    // </li>
  );
};

const Categories = () => {
  const [categories, setCategories] = React.useState(null);

  React.useEffect(() => {
    apiService("blog-categories").then((response) => {
      setCategories(parentSort(response.data));
    });
  }, []);

  if (!categories) return <SkyCloudLoader />;
  return (
    <div
      style={{
        textAlign: "left",
      }}
    >
      <h1 className="categories-title">Categories</h1>
      {/* <AllCategories categories={categories} /> */}
      <section className="categories-section">
        {(() => {
          return categories.map((category) => {
            if (category.children) {
              return (
                // <details open key={category._id}>
                //   <summary>
                <ol className="categories-list" key={category._id}>
                  <CategoriesPreview category={category} currmargin="0px" />
                  {/* // </summary> */}
                  {(() => {
                    if (category.children) {
                      return childsToHTML(category.children);
                    }
                  })()}
                </ol>
                // </details>
              );
            } else {
              return <CategoriesPreview category={category} currmargin="0px" />;
            }
          });
        })()}
      </section>
    </div>
  );
};
export default Categories;
