// declared variable linking to the Reddit div in the HTML
var redditContent = document.getElementById('reddit');
var redditDD = [];
var redditGain = [];
var redditLoss = [];
var redditNews = [];
var redditYolo = [];
var redditDiscussion = [];
var redditChart = [];
var postObject = {
	"DD": redditDD,
	"Gain": redditGain,
	"Loss": redditLoss,
	"News": redditNews,
	"YOLO": redditYolo,
	"Discussion": redditDiscussion,
	"Chart": redditChart
};

function renderReddit(flair) {
	redditContent.innerHTML = "";

	if (postObject[flair].length === 0) {
		console.log("No posts found");

		var deadFlair = $(`<div class="no-reddit">`).get()[0];
		deadFlair.setAttribute("data-dead-flair", `No posts found for flair '${flair}'`);

		redditContent.appendChild(deadFlair);
		return;
	}

	for (const post of postObject[flair]) {
		redditContent.appendChild(post);
	}
}

// fetching the data from reddit
fetch('https://www.reddit.com/r/wallstreetbets/new.json')
	.then(function (response) {
		return response.json();
	})
	.then(
		// function that parses the returned array and applies it where necessary
		function (data) {
			for (var i = 0; i < data.data.children.length; i++) {
				var redditRedirect = document.createElement('button');

				// post titles parsing
				var redditPosts = document.createElement('p');
				redditPosts.textContent = data.data.children[i].data.title;

				// username parsing
				var redditUsers = document.createElement('span');
				redditUsers.textContent = data.data.children[i].data.author;

				// upvote/score parsing
				var redditScore = document.createElement('span');

				// url parsing, to add permalink to the clickable link functionality
				const link = data.data.children[i].data.permalink;

				// adding the results to the page
				redditRedirect.appendChild(redditPosts);
				redditRedirect.appendChild(redditUsers);
				redditRedirect.appendChild(redditScore);
				redditRedirect.addEventListener("click", function () {
					window.open(`https://www.reddit.com${link}`, "_blank");
					// renderPost(`https://www.reddit.com${link}.json`);
				});

				redditRedirect.classList.add("reddit-post");
				redditPosts.classList.add("post-title");
				redditUsers.classList.add("post-author");
				redditScore.classList.add("post-score");

				var upvote = document.createElement("i");
				upvote.className = "fas fa-arrow-up";

				redditScore.appendChild(upvote);
				redditScore.append(data.data.children[i].data.score);

				function renderPost(jsonurl) {
					fetch(`https://www.reddit.com${link}.json`)
					.then(function (response) {
						return response.json();
					})
					// .then(
					// 	function(data) {
					// 		var postType = data[i].data.children[i].data.post_hint;
					// 		for (var i = 0; i < data[i].data.children[i].data.length; i++) {
					// 			if (postType === "image") {
					// 				var imageRender = document.createElement('img');
					// 				imageRender.src = "`${data[i].data.children[i].data.length}`";
					// 				redditRedirect.appendChild(imageRender);
					// 			} else if (postType.includes("video")) {
					// 				var videoRender = document.createElement('video');
					// 				videoRender.src = "`${data[i].data.children[i].data.url_overridden_by_dest}`";
					// 				redditRedirect.appendChild(videoRender);
					// 			} else {
					// 				window.open(`https://www.reddit.com${data[i].data.children[i].data.permalink}`)
					// 			}
					// 		}
					// 	}
					// ) 
				}
				
				var currentFlair = data.data.children[i].data.link_flair_text;

				if (Object.keys(postObject).includes(currentFlair)) {
					postObject[currentFlair].push(redditRedirect);
				}
			}
		}
	);

document.querySelectorAll(".sort-button").forEach(button => {
	button.addEventListener("click", function (event) {
		event.preventDefault();
		renderReddit(event.currentTarget.innerHTML);
	})
});
