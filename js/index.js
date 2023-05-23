function moveVideosToNav() {
  var pubVideo = document.getElementById("pub-video");
  var subVideo = document.getElementById("sub-video");
  var navContainer = document.getElementById("nav-container");
  navContainer.appendChild(pubVideo);
  navContainer.appendChild(subVideo);
}

function moveVideosToStage() {
  var pubVideo = document.getElementById("pub-video");
  var subVideo = document.getElementById("sub-video");
  var stageContainer = document.getElementById("stage-container");
  stageContainer.appendChild(pubVideo);
  stageContainer.appendChild(subVideo);
}

function removeHasVideo() {
  var videos = document.getElementById("pub-video");
  if (videos) {
    videos.classList.remove("has-video");
    console.log(
      "Class for 'videos' after removing has-video:",
      videos.className
    );
  } else {
    console.error("Cannot find 'videos' element");
  }
}

function removeHasAudio() {
  var videos = document.getElementById("pub-video");
  if (videos) {
    videos.classList.remove("has-audio");
    console.log(
      "Class for 'videos' after removing has-audio:",
      videos.className
    );
  } else {
    console.error("Cannot find 'videos' element");
  }
}

function resizePublisherSmall() {
  var publisherContainer = document.getElementById("pub-video");
  publisherContainer.style.width = "200px";
  publisherContainer.style.height = "200px";
}

function resizePublisherLarge() {
  var publisherContainer = document.getElementById("pub-video");
  publisherContainer.style.width = "400px";
  publisherContainer.style.height = "400px";
}

function resizeSubscriberSmall() {
  var subscriberContainer = document.getElementById("sub-video");
  subscriberContainer.style.width = "200px";
  subscriberContainer.style.height = "200px";
}

function resizeSubscriberLarge() {
  var subscriberContainer = document.getElementById("sub-video");
  subscriberContainer.style.width = "400px";
  subscriberContainer.style.height = "400px";
}
