if (!apiKey || !sessionId) {
  console.error("no apiKey or sessionId");
}

let session = OT.initSession(apiKey, sessionId);
const WIDTH = '25%';
const HEIGHT = '35%';

let publisherOptions = {
  insertMode:'append',
  width: WIDTH,
  height: HEIGHT
};

let publisher = OT.initPublisher('container', publisherOptions, (err) => {
  if (err) {
    console.error(err.message);
  }
  else {
    console.log("publisher successfully initialized");
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
    session.subscribe(event.stream, 'container', subscriberOptions, (err) => {
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