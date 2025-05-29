'use client';

import ScrollToTop from '@/components/ui/scroll-to-top/ScrollToTop';
import { BREADCRUMB_ROUTES } from '@/constants/MenuItem';
import {
  HomeOutlined,
  RightOutlined,
  AppstoreOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  ReadOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FooterSasi from '../footer/FooterPage';
import HeaderComponent from '../header/HeaderComponent';
import HeaderMobile from '../header/header-mobile/HeaderMobile';
import Auth from '@/utils/store/Authentication';
import { useDispatch, useSelector } from 'react-redux';
import { hideOnboarding, showOnboarding } from '@/redux/slice/onboarding/OnboardingState';
import { LayoutPaths, Paths } from '@/utils/router';
import { logout } from '@/redux/slice/auth/LoginApp';
import styles from './LayoutMain.module.scss';
import dynamic from 'next/dynamic';
import AuthApiService from '@/api-services/api/auth/AuthApiService';
import LocalStorage from '@/utils/store/local-storage';
import MyLink from '@/components/ui/link/MyLink';

const Onboarding = dynamic(() => import('@/components/onboarding/Onboarding'), { ssr: false });

const { Content } = Layout;

export default function LayoutMain({
  children,
  token,
  accessStore,
  fullName,
  initialMyApps,
  initialTourGuide,
  initialNotifications,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isShowProfile, setIsShowProfile] = useState(token);
  const CMS_URL = process.env.NEXT_PUBLIC_REACT_APP_CMS_URL;
  const [selectedKey, setSelectedKey] = useState(null);
  const [isSize, setIsSize] = useState(false);
  const dispatch = useDispatch();
  const isShowOnboarding = useSelector((state) => state.onboardingState.isShowOnboardingState);

  const handleOnboarding = () => {
    dispatch(showOnboarding());
  };

  const handleCloseOnboarding = () => {
    dispatch(hideOnboarding());
  };

  useEffect(() => {
    const previousUrl = window.location.href;
    Auth.setPreviousUrl(previousUrl);

    const handleResize = () => {
      setIsSize(window.innerWidth <= 1275);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSearch = (value) => {
    const query = { q: value };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const handleChangePass = () => {
    const isAccountPassWord =
      Auth.getIsHasPassword() === true
        ? `${LayoutPaths.Auth}${Paths.ChangePassword}`
        : `${LayoutPaths.Auth}${Paths.SetPassword}`;

    router.push(isAccountPassWord);
  };

  const handleLogout = async () => {
    setIsShowProfile(false);
    dispatch(logout());
    Auth.logout();
    await AuthApiService.logoutPage();
    router.refresh();
  };

  const menu = (
    <Menu className="apps-dropdown">
      {token && (
        <>
          <Menu.Item key="cms" icon={<AppstoreOutlined />} id="step4">
            <MyLink target="_blank" href={`${CMS_URL}/login?accessToken=` + token}>
              Cms
            </MyLink>
          </Menu.Item>
          <Menu.Item key="my-partner" icon={<UserOutlined />}>
            <MyLink href="/my-partner">My Partner</MyLink>
          </Menu.Item>
        </>
      )}
      <Menu.Item key="changePass" onClick={handleChangePass} icon={<EditOutlined />}>
        {Auth.getIsHasPassword() === true ? 'Change password' : 'Set password'}
      </Menu.Item>
      {LocalStorage.getComparisonLists().length !== 0 && (
        <Menu.Item key="compared" icon={<SwapOutlined />}>
          <MyLink href="/compared-apps-list">Comparison app list</MyLink>
        </Menu.Item>
      )}
      <Menu.Item key="onboarding" onClick={handleOnboarding} icon={<ReadOutlined />} id="step8">
        Getting started guide
      </Menu.Item>
      <Menu.Item key="help" icon={<InfoCircleOutlined />}>
        <MyLink target="_blank" rel="noopener noreferrer" href="https://docs.letsmetrix.com/">
          Help
        </MyLink>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const getLabelBreadcrumb = () => {
    const currentPage = BREADCRUMB_ROUTES.find((item) => item.path == pathname);
    return currentPage ? currentPage.label : '';
  };

  return (
    <Layout className={styles.sasiLayout}>
      {!isSize ? (
        <HeaderComponent
          myApps={initialMyApps.listMyApps}
          menu={menu}
          isShowProfile={isShowProfile}
          selectedKeys={selectedKey}
          setSelectedKey={setSelectedKey}
          token={token}
          accessStore={accessStore}
          fullName={fullName}
          initialTourGuide={initialTourGuide}
          initialNotifications={initialNotifications}
        />
      ) : (
        <HeaderMobile
          onSearch={onSearch}
          menu={menu}
          isShowProfile={isShowProfile}
          myApps={initialMyApps.listMyApps}
          token={token}
          accessStore={accessStore}
          fullName={fullName}
        />
      )}
      <Content className={styles.containerContent}>
        {BREADCRUMB_ROUTES.map((item) => item.path).includes(pathname) && (
          <div className="breadcrumb-header">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    href: '/',
                    title: <HomeOutlined />,
                  },
                  {
                    title: <span>{getLabelBreadcrumb()}</span>,
                  },
                ]}
                separator={<RightOutlined />}
              />
            </div>
          </div>
        )}

        <div
          className={styles.contentMenu}
          style={{
            marginBottom: `${pathname === '/' || pathname === '/explore' ? 0 : '50px'}`,
          }}
        >
          {children}
        </div>
        <ScrollToTop />
      </Content>
      <FooterSasi />
      {isShowOnboarding && <Onboarding handleSuccess={handleCloseOnboarding} />}
    </Layout>
  );
}
