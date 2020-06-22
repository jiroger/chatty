let session = OT.initSession(apiKey, sessionId);
let publisher = OT.initPublisher('publisher');

// Attach event handlers
session.on({

  // This function runs when session.connect() asynchronously completes
  sessionConnected: () => {
    // Publish the publisher we initialzed earlier (this will trigger 'streamCreated' on other
    // clients)
    session.publish(publisher);
  },

  // This function runs when another client publishes a stream (eg. session.publish())
  streamCreated: (event) => {
    session.subscribe(event.stream, 'subscribers', { insertMode: 'append' });
  }

});

// Connect to the Session using the 'apiKey' of the application and a 'token' for permission
session.connect(token);