const initLayoutContainer = require('opentok-layout-js');
const layout = initLayoutContainer(document.getElementById("video-container")).layout;
layout();

if (!apiKey || !sessionId) {
  console.error("no apiKey or sessionId");
}

const session = OT.initSession(apiKey, sessionId);

const publisherOptions = {
  insertMode:'append',
  name,
  style: {
    buttonDisplayMode: 'off'
  }
};

const publisher = OT.initPublisher('video-container', publisherOptions, (err) => {
  if (err) {
    console.error(err.message);
  }
  else {
    console.log("publisher successfully initialized");
  }
});

publisher.on({
  accessDenied: (event) => {
    const errorBox = document.getElementById('video-container');
    errorBox.innerHTML = `Chatty requires access to your microphone and camera.  
                          <br><br> You can always turn them off when connected.)`;
    errorBox.style.fontSize = "x-large";
    errorBox.style.textAlign = "center";
    errorBox.style.justifyContent = "center";
    errorBox.style.alignContent = "center";
    errorBox.style.margin = "75px 0";
    errorBox.style.backgroundColor = "white";

    document.getElementById('footer-container').innerHTML = "";
  }
});

// Attach event handlers
session.on({
  // This function runs when session.connect() asynchronously completes
  sessionConnected: () => {
    // trigger 'streamCreated' event
    session.publish(publisher, (err) => {
      if (err) {
        console.log(err.message);
      }
      else {
        console.log("successfully published video");
      }
    });
    layout();
  },

  // runs when session.publish() successfully completes
  streamCreated: (event) => {
    let subscriberOptions = {
      insertMode:'append'
    };
    session.subscribe(event.stream, 'video-container', subscriberOptions, (err) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log("successfully subscribed to streams");
      }
    });
    layout();
  },

  streamDestroyed: (event) => {
    layout();
  }
});

// Connect to the Session using the 'apiKey' of the application and a 'token' for permission
session.connect(token, (err) => {
  if (err) {
    console.error("connection not established");
  }
  else {
    console.log("successfully connected to session");
  }
});

//resizes videos when window size changes
let resizeTimeout;
window.onresize = function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    layout();
  }, 20);
};

function toggleVideo() {
  if (publisher.stream.hasVideo) {
    publisher.publishVideo(false);
  }
  else {
    publisher.publishVideo(true);
  }
}

function toggleAudio() {
  if (publisher.stream.hasAudio) {
    publisher.publishAudio(false);
  }
  else {
    publisher.publishAudio(true);
  }
}

//needed for browserify to expose functions to template
module.exports = { toggleAudio: toggleAudio, toggleVideo: toggleVideo };