var host = window.location.host;
var protocol = window.location.protocol;
var url = protocol + "//" + host
// console.log(url);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const blogUrl = urlParams.get('blog');
// console.log(blogUrl);
fetch(url + "/blogs/get", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        blogUrl: blogUrl
    })

})
    .then(response => response.json())
    .then(jsonObj => {
        // Check null
       if(jsonObj == null){
              console.log("Blog DB not found");   
              window.location.replace(url + "/404"); 
              return;
         }
        console.log(jsonObj);
        var blogTitleLoad = document.getElementById('Blog-Title-Load');
        var blogSubtitleLoad = document.getElementById('Blog-Subtitle-Load');
        var blogMetaLoad = document.getElementById('Blog-Meta-Load');
        blogTitleLoad.innerHTML = jsonObj.title;
        blogSubtitleLoad.innerHTML = jsonObj.subtitle;
        blogMetaLoad.innerHTML = jsonObj.posted_by;
        blogMetaLoad.href = '/profile.html?profile=' + jsonObj.posted_by;
        // Load the blog content from folder /blogs/blog-url
        var content = document.getElementById('Blog-Content-Load');
        
            $.get("/posts-content/" + jsonObj.url + ".html", function(data) {    
                content.innerHTML = data;
            });
    setTimeout(() => {

    



    const copyButtonLabel = "Copy Code";
    console.log("Hello World");

// you can use a class selector instead if you, or the syntax highlighting library adds one to the 'pre'. 

let blocks = document.querySelectorAll("pre");
console.log("Start Copy Code Buttons");
blocks.forEach((block) => {
  // only add button if browser supports Clipboard API
  if (navigator.clipboard) {
      console.log("Adding button");
    let button = document.createElement("button");
    button.innerText = copyButtonLabel;
    button.addEventListener("click", copyCode);
    block.appendChild(button);
  }else{
    console.log("Clipboard API not supported");
  }
});
    }, 1000);
    });

async function copyCode(event) {
  const button = event.srcElement;
  const pre = button.parentElement;
  let code = pre.querySelector("code");
  let text = code.innerText;
  await navigator.clipboard.writeText(text);
  
  button.innerText = "Code Copied";
  
  setTimeout(()=> {
    button.innerText = copyButtonLabel;
  },1000)
}