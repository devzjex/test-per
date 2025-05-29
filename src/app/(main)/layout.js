import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import MyAppApiService from '@/api-services/api/MyAppApiService';
import LayoutMain from '@/layouts/main/LayoutMain';
import { cookies } from 'next/headers';
import React from 'react';

export default async function MainLayout({ children }) {
  const token = cookies().get('accessToken')?.value;
  const accessStore = cookies().get('accessStore')?.value;
  const fullName = cookies().get('fullName')?.value;
  const isAccessStore = accessStore === 'true';

  let initialMyApps = {
    listMyApps: [],
  };

  let initialTourGuide = {
    show_onboarding: false,
    skip_step: '',
  };

  let initialNotifications = {
    notifications: [],
    unreadCount: 0,
  };

  if (token) {
    try {
      const [myApps, tourGuide, notifications, unreadCount] = await Promise.all([
        MyAppApiService.getMyAppsToServer(token),
        LandingPageApiService.handleShowOnboardToServer({ token }),
        MyAppApiService.getNotificationsToServer(token),
        MyAppApiService.getCountNotificationsToServer(token),
      ]);

      if (myApps.code === 0 && tourGuide.code === 0 && notifications.code === 0 && unreadCount.code === 0) {
        initialMyApps = {
          listMyApps: myApps.apps,
        };

        initialTourGuide = {
          show_onboarding: tourGuide.show_onboarding,
          skip_step: tourGuide.skip_step,
        };

        initialNotifications = {
          notifications: notifications.results,
          unreadCount: unreadCount.results,
        };
      }
    } catch (error) {
      console.error('Error fetching my apps:', error);
    }
  }

  return (
    <LayoutMain
      token={token}
      accessStore={isAccessStore}
      fullName={fullName}
      initialMyApps={initialMyApps}
      initialTourGuide={initialTourGuide}
      initialNotifications={initialNotifications}
    >
      {children}
    </LayoutMain>
  );
}
