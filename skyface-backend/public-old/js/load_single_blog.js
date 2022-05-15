var host = window.location.host;
var protocol = window.location.protocol;
var url = protocol + "//" + host
// console.log(url);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const blogUrl = urlParams.get('blog');
var content = document.getElementById('Blog-Content-Load');
if (blogUrl == null) {
    noBlogFoundRedirect();
}
$.get("/posts-content/url-2.html", function (data) {
    content.innerHTML = data;
});
function noBlogFoundRedirect() {
    console.log("Blog DB not found");
    // setTimeout(() => {
        window.location.replace(url + "/all-blogs.html");
    // }, 1000);
    return;
}
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
        if (jsonObj == null) {
            noBlogFoundRedirect();
        }
        console.log(jsonObj);
        var blogTitleLoad = document.getElementById('Blog-Title-Load');
        var blogSubtitleLoad = document.getElementById('Blog-Subtitle-Load');
        // var blogMetaLoad = document.getElementById('Blog-Meta-Load');
        blogTitleLoad.innerHTML = jsonObj.title;
        blogSubtitleLoad.innerHTML = jsonObj.subtitle;
        document.title = jsonObj.title + " - SkyBlog";
        // blogMetaLoad.innerHTML = jsonObj.posted_by;
        // blogMetaLoad.href = '/profile.html?profile=' + jsonObj.posted_by;
        // Load the blog content from folder /blogs/blog-url
       
        var blogSpanLoad = document.getElementById('Blog-Span-Load');
        var created_at = jsonObj.createdAt;
        var created_date = created_at.split('T')[0];
        var created_time = created_at.split('T')[1];
        // 08:11:09.442Z to 08:11:09
        created_time = created_time.split('.')[0];
        blogSpanLoad.innerHTML = 'Posted by <a href="/profile.html?profile=' + jsonObj.posted_by + '">' + jsonObj.posted_by + '</a> on ' + created_date + ' at ' + created_time;
       
        // setTimeout(() => {





        //     const copyButtonLabel = "Copy Code";
        //     console.log("Hello World");

        //     // you can use a class selector instead if you, or the syntax highlighting library adds one to the 'pre'. 

        //     let blocks = document.querySelectorAll("pre");
        //     console.log("Start Copy Code Buttons");
        //     blocks.forEach((block) => {
        //         // only add button if browser supports Clipboard API
        //         if (navigator.clipboard) {
        //             console.log("Adding button");
        //             let button = document.createElement("button");
        //             button.innerText = copyButtonLabel;
        //             button.addEventListener("click", copyCode);
        //             block.appendChild(button);
        //         } else {
        //             console.log("Clipboard API not supported");
        //         }
        //     });
        // }, 1000);
    });

// async function copyCode(event) {
//     const button = event.srcElement;
//     const pre = button.parentElement;
//     let code = pre.querySelector("code");
//     let text = code.innerText;
//     await navigator.clipboard.writeText(text);

//     button.innerText = "Code Copied";

//     setTimeout(() => {
//         button.innerText = copyButtonLabel;
//     }, 1000)
// }