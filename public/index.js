const submit  = document.getElementById('send'),
      count   = document.getElementById('count'),
      wrapper = document.getElementById('wrapper');

function render(postsArr) {
    let postsWrapper = document.createElement('div');

    postsArr.forEach((post) => {
        let postContainer   = document.createElement('div'),
            titleElem   = document.createElement('h2'),
            titleText   = document.createTextNode(post.title),
            contentElem = document.createElement('p'),
            contentText = document.createTextNode(post.content),
            linkElem    = document.createElement('a'),
            linkText    = document.createTextNode(post.link);

        titleElem.appendChild(titleText);
        contentElem.appendChild(contentText);
        linkElem.appendChild(linkText);
        linkElem.href = post.link;

        postContainer.appendChild(titleElem);
        postContainer.appendChild(contentElem);
        postContainer.appendChild(linkElem);

        postsWrapper.appendChild(postContainer);
    });

    wrapper.innerHTML = null;
    wrapper.appendChild(postsWrapper);
}

submit.addEventListener('click', () => {

    fetch('/news/:' + count.value)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            render(data);
            console.log(data);
        })
});
