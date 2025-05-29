'use client';

import './WatchingApps.scss';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Empty, message, Spin } from 'antd';
import ItemDetail from './ItemDetail';
import WatchingAppsCurrent from '@/utils/store/WatchingAppsCurrent';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { LoadingOutlined } from '@ant-design/icons';

function WatchingApps() {
  const dataWatchingApps = useRef(JSON.parse(WatchingAppsCurrent.getListWatchingApps()));
  const [dataApp, setDataApp] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataAppInfo = async () => {
    setIsLoading(true);
    try {
      const appIds = dataWatchingApps?.current?.map((item) => item.app_id);
      const responses = await Promise.all(appIds && appIds.map((id) => DetailAppApiService.getAppInfo(id)));
      const validData = responses.filter((res) => res.code === 0).map((res) => res.data || res);
      setDataApp(validData);
    } catch (error) {
      console.log(error);
      message.error('Error fetching data app');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dataWatchingApps.current !== null ? fetchDataAppInfo() : '';
  }, []);

  return (
    <div className="watching-apps container">
      <Spin spinning={isLoading} indicator={<LoadingOutlined spin />} size="large">
        <div className="header-watching-apps">Watching Apps</div>
        <div className="list-watching-apps container-fluid">
          {dataApp && dataApp !== 0 ? (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {dataApp.reverse().map((item, index) => {
                return (
                  <Col
                    style={{ marginTop: '15px' }}
                    className="gutter-row"
                    xs={24} // 1 cột trên màn hình mobile
                    sm={12} // 2 cột trên tablet nhỏ
                    md={12} // 2 cột trên tablet lớn
                    lg={8} // 3 cột trên desktop
                    key={'' + index}
                  >
                    <ItemDetail value={{ detail: item.detail }} />
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty />
          )}
        </div>
      </Spin>
    </div>
  );
}
export default WatchingApps;
