if (!apiKey || !sessionId) {
  console.error("no apiKey or sessionId");
}

const session = OT.initSession(apiKey, sessionId);
const WIDTH = 100/(ROOM_SIZE / 2)+ "%";
const HEIGHT = '50%';

const publisherOptions = {
  insertMode:'append',
  width: WIDTH,
  height: HEIGHT,
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
    errorBox.style.margin = "0 0";
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
  },

  // runs when session.publish() successfully completes
  streamCreated: (event) => {
    let subscriberOptions = {
      insertMode:'append',
      width: WIDTH,
      height: HEIGHT
    };
    session.subscribe(event.stream, 'video-container', subscriberOptions, (err) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log("successfully subscribed to streams");
      }
    });
  },

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