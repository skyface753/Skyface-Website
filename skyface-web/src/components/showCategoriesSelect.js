import React from "react";
import axios from "axios";
import apiService from "../services/api-service";

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
    if (fullList[i].parent_category == currItemId) {
      var childs = getChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      returnList.push(fullList[i]);
    }
  }
  if (returnList.length == 0) return null;
  return returnList;
}

function childsToHTML(childPrefix, currList, selectedValue) {
  var returnHTML = [];
  if (currList == null) return returnHTML;
  for (var i = 0; i < currList.length; i++) {
    returnHTML.push(
      <div key={currList[i]._id}>
        <input
          type="radio"
          name="category"
          value={currList[i]._id}
          checked={selectedValue === currList[i]._id}
          //   onChange={() => console.log("changed")}
        />
        <label>
          {childPrefix} {currList[i].name}
        </label>

        {childsToHTML(childPrefix + " -", currList[i].children, selectedValue)}
      </div>
    );
  }
  return returnHTML;
}

const ShowCategoriesSelect = (props) => {
  var selectedValue = props.selectedID;

  const [categories, setCategories] = React.useState(null);
  //   const [selectedCategory, setSelectedCategory] = React.useState(selectedValue);

  React.useEffect(() => {
    apiService("blog-categories").then((response) => {
      setCategories(parentSort(response.data));
    });
  }, []);

  if (!categories) return <div className="loader" />;
  console.log("Selected Value in ShowCategoriesSelect: " + selectedValue);
  return (
    <div
      style={{
        textAlign: "left",
      }}
    >
      <fieldset onChange={props.onChange}>
        <input type="radio" name="category" value="" checked={!selectedValue} onChange={() => {
          props.onChange(null);
        }} />
        {(() => {
          return categories.map((category) => {
            // console.log(selectedValue + ":" + category._id);
            return (
              <div key={category._id}>
                <input
                  type="radio"
                  name="category"
                  value={category._id}
                  checked={selectedValue === category._id}
                  //   onChange={() => props.onChange(category._id)}
                  //   onChange={() => setSelectedCategory(category._id)}
                />
                <label>{category.name}</label>

                {/* <p className="category-item">
                  {category.name} - {category.description}
                </p> */}
                {(() => {
                  if (category.children) {
                    return (
                      <div>
                        {childsToHTML("-", category.children, selectedValue)}
                      </div>
                    );
                  }
                })()}
              </div>
            );
          });
        })()}
      </fieldset>
    </div>
  );
};
export default ShowCategoriesSelect;
