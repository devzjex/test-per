'use client';

import { Button, Modal, Spin, message } from 'antd';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { LoadingOutlined, FileSearchOutlined } from '@ant-design/icons';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import './ModalCompare.scss';
import Input from '../ui/input/Input';
import { usePathname, useRouter } from 'next/navigation';

export default function ModalCompare(props) {
    const page = useRef(1);
    const [listResult, setListResult] = useState([]);
    const [selectedApps, setSelectedApps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const parts = pathname.split('/');
    const appName = parts[2] || '';
    const router = useRouter();
    const [searching, setSearching] = useState(false);

    const dataRecommended =
        props.recommendedApps && Array.isArray(props.recommendedApps.apps)
            ? props.recommendedApps.apps
            : props.recommendedApps || [];

    const filteredDataRecommended = dataRecommended.filter((item) => item.app_id !== appName);
    const specificPart = parts[parts.length - 1];
    const appIdParts = specificPart.split('-lmtvs-');

    const uniqueAppIds = new Set();
    appIdParts.forEach((part) => {
        if (!part.includes('-')) {
            uniqueAppIds.add(part);
        } else {
            let combinedAppId = part;
            if (combinedAppId.length > 0) {
                uniqueAppIds.add(combinedAppId);
            }
        }
    });

    const uniqueAppIdsArray = Array.from(uniqueAppIds);
    const filteredData = filteredDataRecommended.filter((item) => !uniqueAppIdsArray.includes(item.app_id));

    const handleOk = () => {
        props.disableModal();
    };

    const handleCancel = () => {
        props.disableModal();
    };

    const saveCompetitor = () => {
        if (selectedApps.length === 0) {
            message.warning('Please select at least one app.');
            return;
        }

        if (pathname === '/') {
            selectedApps.forEach((app) => props.onAddApp(app));
        } else {
            const baseApp = parts[2];
            const compareParts = parts[5].split('-lmtvs-');
            const allApps = [...compareParts, baseApp, ...selectedApps.map((app) => app.app_id)].sort((a, b) =>
                a.localeCompare(b),
            );
            const mainApp = allApps[0];
            const compareApps = allApps.slice(1).join('-lmtvs-');
            const newPath = `/app/${mainApp}/compare-app/vs/${compareApps}`;
            router.push(newPath);
        }

        props.disableModal();
        setSelectedApps([]);
    };

    const onSearch = async (value) => {
        if (value.trim() === '') {
            setSearching(false);
            setListResult([]);
            return;
        }
        setSearching(true);
        setIsLoading(true);
        try {
            if (value) {
                const result = await DetailAppApiService.searchData(value, page.current, 100);
                if (result && result.code === 0) {
                    if (result.data && result.data.apps) {
                        const data = [];
                        if (result.data.apps) {
                            result.data.apps.map((item) => {
                                const index = props.competitor.findIndex((i) => i.appId === item.app_id);
                                if (
                                    index === -1 &&
                                    item.detail &&
                                    item.detail.app_icon !== null &&
                                    !uniqueAppIdsArray.includes(item.app_id) &&
                                    item.app_id !== appName
                                ) {
                                    data.push(item);
                                }
                            });
                            setListResult(data);
                        }
                    }
                }
            } else {
                setListResult([]);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectItem = (item) => () => {
        const exists = selectedApps.some((a) => a.app_id === item.app_id);
        if (exists) {
            setSelectedApps((prev) => prev.filter((a) => a.app_id !== item.app_id));
        } else {
            if (selectedApps.length >= 4) {
                message.warning('You can only select up to 4 apps.');
                return;
            }
            setSelectedApps((prev) => [...prev, item]);
        }
    };

    const renderItem = (item, source = 'search') => {
        const itemId = source === 'search' ? item.detail?.app_id : item.app_id;
        const itemName = source === 'search' ? item.detail?.name : item.name;
        const itemIcon = source === 'search' ? item.detail?.app_icon : item.app_icon;
        const isSelected = selectedApps.some((a) => a.app_id === itemId);

        return (
            <div
                className={`item-name ${isSelected ? 'item-active' : ''}`}
                key={itemId}
                onClick={selectItem(source === 'search' ? item.detail : item)}
            >
                {itemIcon && (
                    <Image
                        src={itemIcon}
                        alt={itemName || 'App icon'}
                        width={30}
                        height={30}
                        style={{ marginRight: '8px', borderRadius: '4px' }}
                    />
                )}
                {itemName || ''}
            </div>
        );
    };

    return (
        <Modal width={420} title="Add Competitor" visible={true} footer={null} onOk={handleOk} onCancel={handleCancel}>
            <div className="popup-add-competitor">
                <div className="input-competitor">
                    <div className="search-data">
                        <Input placeholder="Application name" onSearch={onSearch} autoFocus />
                    </div>
                    {searching ? (
                        <>
                            {!listResult || listResult.length === 0 ? (
                                <Spin
                                    style={{ width: '100%' }}
                                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                                    spinning={isLoading}
                                >
                                    <div className="flex justify-center">
                                        <FileSearchOutlined className="search-icon" />
                                    </div>
                                </Spin>
                            ) : (
                                <>
                                    <div className="result-search">
                                        {listResult.map((item) => renderItem(item, 'search'))}
                                    </div>
                                    <div className="item-active"></div>
                                    <div className="save-competitor">
                                        <Button
                                            htmlType="submit"
                                            className="button-add"
                                            type="primary"
                                            onClick={saveCompetitor}
                                            style={{ width: 320 }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </>
                            )}
                        </>
                    ) : filteredData.length > 0 ? (
                        <>
                            <div className="recommend">Recommended</div>
                            <div className="result-search-recommend">
                                {filteredData.map((item) => renderItem(item, 'recommended'))}
                            </div>
                            <div className="item-active"></div>
                            <div className="save-competitor">
                                <Button
                                    htmlType="submit"
                                    className="button-add"
                                    type="primary"
                                    onClick={saveCompetitor}
                                    style={{ width: 320 }}
                                >
                                    Add
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Spin
                            style={{ width: '100%' }}
                            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                            spinning={isLoading}
                        >
                            <div className="flex justify-center">
                                <FileSearchOutlined className="search-icon" />
                            </div>
                        </Spin>
                    )}
                </div>
            </div>
        </Modal>
    );
}
