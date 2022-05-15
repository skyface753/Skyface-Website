var host = window.location.host;
var protocol = window.location.protocol;
var url = protocol + "//" + host
console.log(url);
fetch(url + "/blogs/last5", {
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
            var created_at = obj.createdAt;
            var created_date = created_at.split('T')[0];
            var created_time = created_at.split('T')[1];
            // 08:11:09.442Z to 08:11:09
            created_time = created_time.split('.')[0];
            postMeta.innerHTML = 'Posted by <a href="/profile.html?profile=' + obj.posted_by + '">' + obj.posted_by + '</a> on ' + created_date + ' at ' + created_time;
            postPreview.appendChild(postLink);
            postLink.appendChild(postTitle);
            postLink.appendChild(postSubtitle);
            postPreview.appendChild(postMeta);
            container.appendChild(postPreview);
            var divider = document.createElement('hr');
            divider.className = "my-4";
            container.appendChild(divider);
        }
    }
    );