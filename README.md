# opentok sample code

## Screen Sharing

For Publisher:

- To add screen sharing detection to the publisher, you can utilize the accessAllowed and accessDenied events of the publisher object.

- In this code, the accessAllowed event listener is added to the publisher object. If the accessDialog.source is set to 'screen', it indicates that the publisher started or attempted to start screen sharing. Similarly, the accessDenied event listener checks if the accessDialog.source is set to 'screen', indicating that screen sharing was denied.

For Subscriber:

- To add screen sharing detection for the subscriber, you can utilize the videoType property of the subscriber stream object.

- In this code, the videoTypeChanged event listener is added to the subscriber object. It checks the videoType property of the event object to determine if screen sharing is started or stopped for the subscriber. If the videoType is 'screen', it indicates that the subscriber is currently receiving a screen-sharing stream.

## Video enabled/disabled

For Subscribers:

- To detect when subscribers turn their video on or off, you can utilize the videoEnabled and videoDisabled events of the subscriber object.

- In this code, the videoEnabled event listener is added to the subscriber object. It indicates that the subscriber has turned on their video. Similarly, the videoDisabled event listener is added to detect when the subscriber turns off their video.

## Audio enabled/disabled

For both Publisher and Subscribers:

- To detect when users have muted their microphone, you can utilize the audioEnabled and audioDisabled events of the publisher and subscriber objects.
- In this code, the audioEnabled event listener is added to both the publisher and subscriber objects to detect when the microphone is turned on. The audioDisabled event listener is added to detect when the microphone is muted.

## Detect Video/Audio Source changed

For both Publisher and Subscribers:

- To detect when a user has changed their video source or audio source, you can utilize the videoSourceChanged and audioSourceChanged events of the publisher and subscriber objects. This listeners also handle the case where the video source fails or the state of it changes.

- In this code, the videoSourceChanged event listener is added to both the publisher and subscriber objects to detect when the video source (camera) is changed. Similarly, the audioSourceChanged event listener is added to detect when the audio source (microphone) is changed.

## Detect which user has connected/disconnected

To handle disconnection and reconnection events for multiple users, you can leverage the connectionCreated and connectionDestroyed events provided by the API.

For Subscribers:

- In this updated code, we introduced an object called connectedSubscribers to keep track of connected subscribers. The keys of this object are the connection IDs of the subscribers.

- When the connectionCreated event is triggered, indicating that a user has connected to the session, we store the connection ID of the user in the connectedSubscribers object.

- When the connectionDestroyed event is triggered, indicating that a user has been disconnected from the session, we remove the corresponding connection ID from the connectedSubscribers object.

- Within the attachSubscriberEventListeners function, we've also updated the log messages to include the connection ID of the subscriber.

- By using these event handlers and the connectedSubscribers object, you can keep track of connected users and perform specific actions when a user is disconnected or reconnected.

## Detect Recording

To detect when a recording has started, you can utilize the streamCreated event of the session object. This event is triggered when a new stream, such as a recording stream, is created in the session.

## Running the App

Copy `config-sample.js`, rename it to `config.js` and populate with opentok credentials.

You can use VS Code Extension Live Server to run the app.

Duplicate the Browsers and open the Browser's Inspector to view the logs of the opentok journey.

Click Initialize Session and then Publish for both browsers.

You can resize the Publisher and Subscribers.

You can relocate the Publisher and Subscribers.
