'use client';

import React from 'react';
import { Rate, List, Tag, Empty } from 'antd';
import { DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import './ReviewItem.scss';
import Link from 'next/link';

export default function ReviewItem(props) {
    const { isDeleted, isArchived, isActive } = props;

    const handleShowReply = (id) => {
        if (props.showReply.includes(id)) {
            props.setShowReply((prev) => prev.filter((item) => item !== id));
            return;
        }
        props.setShowReply((prev) => [...prev, id]);
    };

    const getBackgroundColor = (item) => {
        if (isDeleted === true) return '#ffe6e6';
        if (isArchived === true) return 'rgb(230 245 255)';
        if (isActive === true) return '';

        if (item.is_deleted) return '#ffe6e6';
        if (item.is_archived) return 'rgb(230 245 255)';
        return '';
    };

    const renderStatusTag = (item) => {
        if (isDeleted === true) {
            return (
                <Tag icon={<DeleteOutlined />} className="tag-common" color="#cd201f">
                    Deleted
                </Tag>
            );
        }
        if (isArchived === true) {
            return (
                <Tag icon={<FolderOutlined />} className="tag-common" color="#4096ff">
                    Archived
                </Tag>
            );
        }
        if (isActive === true || (isDeleted === null && isArchived === null && isActive === null)) {
            if (item.is_deleted) {
                return (
                    <Tag icon={<DeleteOutlined />} className="tag-common" color="#cd201f">
                        Deleted
                    </Tag>
                );
            }
            if (item.is_archived) {
                return (
                    <Tag icon={<FolderOutlined />} className="tag-common" color="#4096ff">
                        Archived
                    </Tag>
                );
            }
        }
        return null;
    };

    return (
        <List
            itemLayout="vertical"
            dataSource={props.data?.data || []}
            size="large"
            locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />,
            }}
            renderItem={(item) => (
                <List.Item
                    key={item.title}
                    style={{
                        backgroundColor: getBackgroundColor(item),
                    }}
                >
                    <List.Item.Meta
                        title={
                            <div className="header-review">
                                <div className="flex items-center">
                                    <Link
                                        href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`}
                                        style={{
                                            fontWeight: 500,
                                            textDecoration: 'underline',
                                        }}
                                        prefetch={false}
                                    >
                                        {item.reviewer_name}{' '}
                                    </Link>
                                    {renderStatusTag(item)}
                                </div>

                                <span className="lable-star">
                                    <Rate
                                        disabled={true}
                                        style={{ color: '#ffc225', marginRight: '10px' }}
                                        value={item.star}
                                    />
                                    <span className="created-date">
                                        <Link
                                            href={`/dashboard/review?created_at=${item.create_date}`}
                                            style={{ textDecoration: 'underline' }}
                                            prefetch={false}
                                        >
                                            {item.create_date}{' '}
                                        </Link>
                                    </span>
                                </span>
                            </div>
                        }
                    />
                    {item.reviewer_name_count && item.reviewer_name_count > 1 && (
                        <div className="total">Has {item.reviewer_name_count} other reviews</div>
                    )}
                    <div className="locale">
                        Location:{' '}
                        <Link prefetch={false} href={`/dashboard/review?reviewer_location=${item.reviewer_location}`}>
                            {item.reviewer_location}
                        </Link>
                        {item.time_spent_using_app ? ` - ${item.time_spent_using_app}` : ''}
                    </div>
                    {item.content}
                    {item.reply_content && (
                        <p className="view-reply" onClick={() => handleShowReply(item.int_id)}>
                            {props.showReply.includes(item.int_id) ? 'Hide Reply' : 'Show Reply'}
                        </p>
                    )}
                    <div className={`view-reply-content ${props.showReply.includes(item.int_id) ? 'show' : ''}`}>
                        <div className="view-reply-author">
                            {props.appName} replied {item.reply_time}
                        </div>
                        <div>{item.reply_content}</div>
                    </div>
                </List.Item>
            )}
        />
    );
}
