var host = window.location.host;
var protocol = window.location.protocol;
var url = protocol + "//" + host
console.log(url);
fetch(url + "/blogs", {
    method: 'POST',
})
    .then(response => response.json())
    .then(jsonObj => {
        console.log(jsonObj);
        var count = Object.keys(jsonObj).length;
        var container = document.getElementById('all-blogs'); // reference to containing elm
        for (var i = 0; i < count; i++) {
            var obj = jsonObj[i];
            //    var button = "<input type='button' value="+obj.title+"></input>"
            var postPreview = document.createElement('div');
            postPreview.className = 'post-preview';
            var postLink = document.createElement('a');
            postLink.href = '/post.html?blog=' + obj.url;
            var postTitle = document.createElement('h2');
            postTitle.className = 'post-title';
            postTitle.innerHTML = obj.title;
            var postSubtitle = document.createElement('h3');
            postSubtitle.className = 'post-subtitle';
            postSubtitle.innerHTML = obj.subtitle;
            var postMeta = document.createElement('p');
            postMeta.className = 'post-meta';
            postMeta.innerHTML = 'Posted by <a href="#">' + obj.posted_by + '</a> on ' + obj.created_at;
            postPreview.appendChild(postLink);
            postLink.appendChild(postTitle);
            postLink.appendChild(postSubtitle);
            postPreview.appendChild(postMeta);
            container.appendChild(postPreview);
        }
    }
    );