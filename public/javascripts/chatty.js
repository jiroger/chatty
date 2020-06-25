if (!apiKey || !sessionId) {
  alert("no apiKey or sessionId");
}

let session = OT.initSession(apiKey, sessionId);
let publisher = OT.initPublisher('publisher', null, (err) => {
  if (err) {
    alert(err);
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
        alert("cannot publish your video");
      }
      else {
        console.log("successfully published video");
      }
    });
  },

  // This function runs when another client publishes a stream (eg. session.publish())
  streamCreated: (event) => {
    session.subscribe(event.stream, 'subscribers', { insertMode: 'append' }, (err) => {
      if (err) {
        alert("cannot subscribe to other streams");
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
    alert("connection not established");
  }
  else {
    console.log("successfully connected to session");
  }
});