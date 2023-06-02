// Replace with your Vonage Video API key, session ID, and token
const apiKey = process.env.API_KEY;
const sessionId = process.env.SESSION_ID;
const token = process.env.TOKEN;

// Initialize a session object
const session = OT.initSession(apiKey, sessionId);

// Create a publisher object
let publisher;
// Keep track of connected subscribers
const connectedSubscribers = {};

// Event handlers for the session
session.on({
  sessionConnected: function (event) {
    console.log("Session connected");
  },
  sessionDisconnected: function (event) {
    console.log("Session disconnected");
  },
  streamCreated: function (event) {
    console.log("Session stream created");
    const subscriberContainer = document.createElement("div");
    subscriberContainer.className = "subscriber-container";
    const subscriberId = `subscriber-${event.stream.streamId}`;
    subscriberContainer.id = subscriberId;
    document.getElementById("subscribers").appendChild(subscriberContainer);
    session.subscribe(
      event.stream,
      subscriberId,
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
      },
      function (error) {
        if (error) {
          console.error("Error subscribing:", error);
        } else {
          const subscriber = session.getSubscribersForStream(event.stream)[0];
          attachSubscriberEventListeners(subscriber, subscriberId);
        }
      }
    );

    const stream = event.stream;
    if (stream.name === "Vonage Video API Recording") {
      console.log("Recording started");
      // Handle recording start
    }
  },
  streamDestroyed: function (event) {
    console.log("Session stream destroyed");
    const subscriberId = `subscriber-${event.stream.streamId}`;
    const subscriberContainer = document.getElementById(subscriberId);
    if (subscriberContainer) {
      subscriberContainer.parentNode.removeChild(subscriberContainer);
    }
  },
  connectionCreated: function (event) {
    const connectionId = event.connection.connectionId;
    console.log(`User connected: ${connectionId}`);
    // Perform actions when a user is connected

    // Store the connected user in the connectedSubscribers object
    connectedSubscribers[connectionId] = true;
  },
  connectionDestroyed: function (event) {
    const connectionId = event.connection.connectionId;
    console.log(`User disconnected: ${connectionId}`);
    // Perform actions when a user is disconnected

    // Remove the disconnected user from the connectedSubscribers object
    delete connectedSubscribers[connectionId];
  },
  signal: function (event) {
    console.log("Session signal received");
  },
  archiveStarted: function (event) {
    console.log("Session archive started");
  },
  archiveStopped: function (event) {
    console.log("Session archive stopped");
  },
  sessionReconnecting: function (event) {
    console.log("Session reconnecting");
  },
  sessionReconnected: function (event) {
    console.log("Session reconnected");
  },
});

// Connect to the session
session.connect(token, function (error) {
  if (error) {
    console.error("Error connecting to the session", error);
  } else {
    console.log("Connected to the session");
    // Create a publisher if it doesn't exist
    if (!publisher) {
      publisher = OT.initPublisher("publisher", function (error) {
        if (error) {
          console.error("Error initializing publisher:", error);
        } else {
          session.publish(publisher, function (error) {
            if (error) {
              console.error("Error publishing:", error);
            }
          });
        }
      });
    } else {
      // Publisher already exists
      console.log("Publisher already created");
    }

    // Attach event listeners for the publisher
    attachPublisherEventListeners();
  }
});

// Attach event listeners for the publisher
function attachPublisherEventListeners() {
  if (publisher) {
    publisher.on({
      accessAllowed: function (event) {
        console.log("Publisher access allowed");
        if (event.accessDialog && event.accessDialog.source === "screen") {
          console.log("Screen sharing started");
        }
      },
      accessDenied: function (event) {
        console.log("Publisher access denied");
        if (event.accessDialog && event.accessDialog.source === "screen") {
          console.log("Screen sharing denied");
        }
      },
      accessDialogOpened: function (event) {
        console.log("Publisher access dialog opened");
      },
      accessDialogClosed: function (event) {
        console.log("Publisher access dialog closed");
      },
      accessDialogDenied: function (event) {
        console.log("Publisher access dialog denied");
      },
      accessDialogApproved: function (event) {
        console.log("Publisher access dialog approved");
      },
      audioLevelUpdated: function (event) {
        console.log("Publisher audio level updated");
      },
      audioNetworkStats: function (event) {
        console.log("Publisher audio network stats available");
      },
      audioPublishingStarted: function (event) {
        console.log("Publisher audio publishing started");
      },
      audioPublishingStopped: function (event) {
        console.log("Publisher audio publishing stopped");
      },
      audioEnabled: function (event) {
        console.log("Publisher audio enabled");
      },
      audioDisabled: function (event) {
        console.log("Publisher audio disabled");
      },
      streamCreated: function (event) {
        console.log("Publisher stream created");
      },
      streamDestroyed: function (event) {
        console.log("Publisher stream destroyed");
      },
      videoElementCreated: function (event) {
        console.log("Publisher video element created");
      },
      videoElementDestroyed: function (event) {
        console.log("Publisher video element destroyed");
      },
      videoEnabled: function (event) {
        console.log("Publisher video enabled");
      },
      videoDisabled: function (event) {
        console.log("Publisher video disabled");
      },
      videoDisableWarning: function (event) {
        console.log("Publisher video disable warning");
      },
      videoDisableWarningLifted: function (event) {
        console.log("Publisher video disable warning lifted");
      },
      videoDimensionsChanged: function (event) {
        console.log("Publisher video dimensions changed");
      },
      audioBlocked: function (event) {
        console.log("Publisher audio blocked");
      },
      audioUnblocked: function (event) {
        console.log("Publisher audio unblocked");
      },
      videoBlocked: function (event) {
        console.log("Publisher video blocked");
      },
      videoUnblocked: function (event) {
        console.log("Publisher video unblocked");
      },
      destroy: function (event) {
        console.log("Publisher destroyed");
      },
    });
  }
}

// Attach event listeners for the subscriber
function attachSubscriberEventListeners(subscriber, subscriberId) {
  if (subscriber) {
    subscriber.on({
      connected: function (event) {
        const connectionId = event.target.stream.connection.connectionId;
        console.log(
          `Subscriber ${subscriberId} connected (Connection ID: ${connectionId})`
        );

        const subscriberContainer = document.getElementById(subscriberId);
        if (subscriberContainer) {
          subscriberContainer.classList.add("connected");
        }
      },
      disconnected: function (event) {
        const connectionId = event.target.stream.connection.connectionId;
        console.log(
          `Subscriber ${subscriberId} disconnected (Connection ID: ${connectionId})`
        );

        const subscriberContainer = document.getElementById(subscriberId);
        if (subscriberContainer) {
          subscriberContainer.classList.remove("connected");
        }
      },
      videoDisabled: function (event) {
        console.log("Subscriber video disabled");
      },
      videoEnabled: function (event) {
        console.log("Subscriber video enabled");
      },
      audioBlocked: function (event) {
        console.log("Subscriber audio blocked");
      },
      audioUnblocked: function (event) {
        console.log("Subscriber audio unblocked");
      },
      videoBlocked: function (event) {
        console.log("Subscriber video blocked");
      },
      videoUnblocked: function (event) {
        console.log("Subscriber video unblocked");
      },
      destroy: function (event) {
        console.log("Subscriber destroyed");
        const subscriberContainer = document.getElementById(subscriberId);
        if (subscriberContainer) {
          subscriberContainer.parentNode.removeChild(subscriberContainer);
        }
      },
    });
  }
}
