import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class MyAppApiService {
  static async getMyApps() {
    const response = await CommonCall(`${URL_API}list_my_app`);
    return response.apps;
  }
  static async getMyAppsToServer(token) {
    const response = await fetch(`${URL_API}list_my_app`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
  static async getNotificationsToServer(token) {
    const response = await fetch(`${URL_API}notification`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
  static async getCountNotificationsToServer(token) {
    const response = await fetch(`${URL_API}unread_notification`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
  static async getReadNotifications(notifications) {
    const body = {
      notifications: notifications.map((item) => item.notification),
    };
    const response = await CommonCall(`${URL_API}read_notification`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response;
  }
}
