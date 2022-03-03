/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from 'react-native-firebase';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotification.configure({
  onRegister: function (pushtoken) {
    console.log('frewq', pushtoken);
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          console.log(fcmToken);
        } else {
          console.log('else');
        }
      });

    PushNotification.createChannel(
      {
        channelId: '123', // (required)
        channelName: 'App01', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        // importance: 4,
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  },

  onNotification: function (notification) {
    console.log('NOTIFICTION_CALL');

    if (notification.userInteraction) {
      if (notification.id == undefined) {
        console.log('backgroundId= ' + notification.data.id);
      } else {
        console.log('forgroundId= ' + notification.id);
        PushNotification.cancelLocalNotifications({id: notification.id});
      }
      console.log('3 ' + notification);
    } else {
      if (notification) {
        console.log(notification);
        console.log('serverid = ' + notification.data.id);

        PushNotification.localNotification({
          channelId: '123',
          id: notification.data.id,
          ticker: 'My Notification Ticker',
          autoCancel: true,
          largeIcon: '',
          smallIcon: 'cir',
          color: '#808080',
          vibrate: true,
          vibration: 300,
          tag: 'some_tag',
          group: 'group',
          ongoing: false,
          userInfo: notification.data,
          title: notification.title,
          message: notification.message,
          playSound: false,
          invokeApp: true,
          soundName: 'default',
        });
      }
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err) {
    // console.error('2 ' + err.message, err);
  },
  senderID: '665629759853',
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

AppRegistry.registerComponent('app01', () => App);
