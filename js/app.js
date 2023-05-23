let videoInputDevices;
let publisher;
let subscriber;
let videoSelectorValue;

let connected = false;
let publisherInitialized = false;
let subscriberInitialized = false;

const session = OT.initSession(API_KEY, SESSION_ID);

function initSession() {
  console.log("Trying to initialize session, please wait...");
  session.connect(TOKEN, (error) => {
    if (error) {
      console.log("Failed to connect: ", error.message);
      if (error.name === "OT_NOT_CONNECTED") {
        alert(
          "You are not connected to the internet. Check your network connection."
        );
      }
    } else {
      connected = true;
      console.log("Session Connected!");
    }
  });
}

// Subscribe to a newly created stream (other than your own) is created in the session.
session.on("streamCreated", (event) => {
  console.log(
    "[X] session.on > streamCreated > A new stream entered session with streamId:" +
      event.stream.streamId
  );
  const subscriberOptions = {
    style: { nameDisplayMode: "on" },
    name: "Name",
    insertMode: "append",
    width: "100%",
    height: "100%",
    resolution: "1280x720",
    frameRate: 30,
    publishAudio: true,
    publishVideo: true,
  };

  subscriber = session.subscribe(
    event.stream,
    "sub-video",
    subscriberOptions,
    (err) => {
      if (err) {
        console.log(
          "session.on > session.subscribe > streamCreated: Streaming connection failed. This could be due to a restrictive firewall."
        );
      } else {
        subscriberInitialized = true;
        console.log(
          "[Z] session.on > session.subscribe > Successfully subscribed to a stream!"
        );
      }
    }
  );

  // WASN'T DISPLAYING CORRECTLY, THIS FIXED IT
  var publisherContainer = document.getElementById("sub-video");
  publisherContainer.style.width = "400px";
  publisherContainer.style.height = "400px";

  if (subscriber && subscriber.videoElement) {
    try {
      const mediaStoppedListener = subscriber._mediaStoppedListener;
      // Use the mediaStoppedListener or perform any necessary operations

      if (typeof subscriber.videoElement.on === "function") {
        subscriber.videoElement.on("destroyed", () => {
          console.log("Subscriber video element destroyed");
          // Handle the destroyed event
          // For example, you can remove the subscriber element from the DOM
          subscriber.destroy();
        });
      }
    } catch (error) {
      console.error("Error: Cannot get _mediaStoppedListener:", error);
      // Handle the error accordingly
    }
  } else {
    // Subscriber or video element is not available, handle it accordingly
    console.error("Subscriber or video element is not available.");
  }
});

if (subscriber) {
  // SUBSCRIBE LISTENERS
  subscriber.on({
    // When the subscriber's audio is blocked
    audioBlocked: (event) => {
      console.log("audioBlocked: Subscriber audio is blocked.");
    },
    audioUnblocked: (event) => {
      console.log("audioUnblocked: Subscriber audio is unblocked.");
    },
    // When the stream is dropped and the client tries to reconnect
    disconnected: (event) => {
      // Display a user interface notification.
      console.log(
        "disconnected: When the stream is dropped and the client tries to reconnect."
      );
    },
    // When a new stream has connected to the session.
    connected: (event) => {
      console.log(
        "[Y] subsciber.on > connected: A new stream has connected to the session.",
        event
      );
    },
    // If the client cannot restore the stream
    destroyed: (event) => {
      console.log("destroyed: If the client cannot restore the stream.");
    },
    videoDimensionsChanged: (event) => {
      console.log(
        "videoDimensionsChanged: A stream published from device orientation changed or due to Screen-Sharing."
      );
      subscriber.element.style.width = event.newValue.width + "px";
      subscriber.element.style.height = event.newValue.height + "px";
      console.log(
        `videoDimensionsChanged: width:${subscriber.element.style.width} and height:${subscriber.element.style.height}`
      );
    },
    // If connectivity improves to support video again, the Subscriber object dispatches
    videoEnabled: () => {
      console.log(
        "videoEnabled: Connectivity improved to support video again, the Subscriber object dispatches this."
      );
    },
    // When the subscriber's video is disabled
    videoDisabled: (event) => {
      if (event.reason == "publishVideo") {
        console.log(
          "videoDisabled: The subscriber's video stopped publishing video by calling publishVideo(false)."
        );
      } else if (event.reason == "quality") {
        console.log(
          "videoDisabled: The subscriber's connectivity quality is poor."
        );
      } else {
        console.log("videoDisabled:", event.reason);
      }
    },
  });
}

// Losing Connectivity
session.on("streamDestroyed", (event) => {
  if (event.reason === "networkDisconnected") {
    event.preventDefault();
    var subscribers = session.getSubscribersForStream(event.stream);
    if (subscribers.length > 0) {
      var subscriberId = document.getElementById(subscribers[0].id);
      // Display error message inside the Subscriber
      subscriberId.innerHTML =
        "Lost connection. This could be due to your internet connection " +
        "or because the other party lost their connection.";
      event.preventDefault(); // Prevent the Subscriber from being removed
    }
  } else {
    console.log("session.on streamDestroyed: " + event.reason);
  }
});

// SEE REFERENCE: Detecting when streams leave a session
session.on("sessionDisconnected", (event) => {
  // AFTER 38 SECONDS THIS IS TRIGGERED WHEN I SHUT OFF WIFI
  if (event.reason == "networkDisconnected") {
    console.log(
      "session.on > sessionDisconnected: networkDisconnected > Your network connection terminated."
    );
    // IS TRIGGERED VIA session.disconnect();
  } else if (event.reason == "clientDisconnected") {
    console.log("session.on > sessionDisconnected: clientDisconnected.");
    session.destroy();
    session.disconnect();
  } else if (event.reason == "forceDisconnected") {
    console.log(
      "session.on > sessionDisconnected: Your moderator forced disconnection."
    );
  } else {
    console.log("session.on > sessionDisconnected:", event.reason);
  }
});

function sessionDisconnect() {
  if (!connected) {
    console.log("No Session to disconnect!");
  } else {
    publishDestroy();
    console.log("session.disconnect > Session Disconnected!");
    connected = false;
    session.disconnect();
  }
}

function publish() {
  if (connected) {
    console.log("Trying to publish, please wait...");
    if (publisherInitialized) {
      console.log("Already Publishing!");
    } else {
      const publisherOptions = {
        insertMode: "append",
        width: "100%",
        height: "100%",
      };

      publisher = OT.initPublisher("pub-video", publisherOptions, (error) => {
        if (error) {
          console.error(error);
        } else {
          publisherInitialized = true;
          console.log("Successfully Published!");
        }
      });
      session.publish(publisher);
      // WASN'T DISPLAYING CORRECTLY, THIS FIXED IT
      var publisherContainer = document.getElementById("pub-video");
      publisherContainer.style.width = "400px";
      publisherContainer.style.height = "400px";
    }
  } else {
    console.log("Please Init Session first!");
  }
}

if (publisherInitialized) {
  session.publish(publisher, (error) => {
    if (error) {
      console.log("[C] session.publish > failed to publish:", error.message);
      if (e.name === "“OT_USER_MEDIA_ACCESS_DENIED”") {
        // handle error (OT_USER_MEDIA_ACCESS_DENIED)
      } else if (e.name === "OT_HARDWARE_UNAVAILABLE") {
        // handle error (OT_HARDWARE_UNAVAILABLE)
        // Switches the video input source used by the publisher to the next one in the list of available devices.
        publisher
          .cycleVideo()
          .then((videoDevice) => {
            console.log(videoDevice);

            // This method sets the video source for a publisher that is using a camera. Pass in the device ID of the new video source.
            publisher
              .setVideoSource(videoDevice.deviceId)
              .then(() => console.info("video source set"))
              .catch((error) => console.error(error.name));
          })
          .catch((err) => {
            alert("cycleVideo error " + err.message);
          });
      }
    } else {
      console.log("[C] session.publish > Successfully published.");
    }
  });

  // PUBLISH LISTENERS
  publisher.on({
    // REFERENCE: ALLOWING DEVICE ACCESS
    // Letting users know camera is being accessed message
    accessDialogOpened: () => {
      console.log("accessDialogOpened: Show allow camera message.");
    },
    // Letting users know camera access message being closed
    accessDialogClosed: () => {
      console.log("accessDialogClosed: Hide allow camera message.");
    },

    // To get statistics for a stream published
    streamCreated: (event) => {
      console.log("[B] publisher.on > streamCreated event:", event);
    },

    // IS TRIGGERED WHEN publisher.destroy() was not called before session.destroy()
    streamDestroyed: (event) => {
      console.log(
        "publisher.on > streamDestroyed > Pulish stream destroyed reason: " +
          event.reason
      );
      // AFTER 38 SECONDS THIS IS TRIGGERED WHEN I SHUT OFF WIFI
      if (event.reason == "networkDisconnected") {
        console.log(
          "publisher.on > streamDestroyed: networkDisconnected > Your network connection terminated."
        );
      }
    },
    mediaStopped: (event) => {
      console.log("publisher.on > mediaStopped: " + event);
    },
    muteForced: (event) => {
      console.log("publisher.on > muteForced: " + event);
    },
  });
}

function publishDestroy() {
  if (publisherInitialized) {
    console.log("Destroying Publisher...");
    publisherInitialized = false;
    publisher.destroy();
  } else {
    console.log("No Publisher to destroy!");
  }
}
