import React from 'react';
import { NotificationManager} from 'react-notifications';

export const INFO = 'info'
export const SUCCESS = 'success'
export const WARNING = 'warning'
export const ERROR = 'error'
 
class Example extends React.Component {
  static createNotification = (type, data) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info(data);
          
          break;
        case 'success':
          NotificationManager.success(data, 'Success');
          break;
        case 'warning':
          NotificationManager.warning(data, 'Warning!!', 3000);
          break;
        case 'error':
          NotificationManager.error(data, 'Error');
          break;
      }
    };
  }
}

export default Example