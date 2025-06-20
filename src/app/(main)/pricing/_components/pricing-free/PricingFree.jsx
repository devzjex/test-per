'use client';

import React from 'react';
import './PricingFree.scss';
import { CheckOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { LayoutPaths, Paths } from '@/utils/router';

export default function PricingFree() {
    const router = useRouter();

    const renderProductLogo = () => (
        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 128 128" className="product-logo">
            <defs />
            <path d="M76.1 91.4V71.7a1 1 0 00-.2-.6l-5.7-6.9V15.4a1.1 1.1 0 00-.1-.4.5.5 0 000-.1l-5.8-10a1 1 0 00-1.7 0l-5.9 10a.5.5 0 000 .1 1.2 1.2 0 00-.1.4v48.8l-5.7 6.9a1 1 0 00-.2.6v19.7a1 1 0 001 1h10.6V95a1 1 0 102 0v-2.7h10.8a1 1 0 001-1zm-17.6-75h9.7v4h-9.7zm4.8-9l4.1 7h-8.1zM52.6 72l4-4.8v23h-4zm11.7 18.3V56.7a1 1 0 10-2 0v33.7h-3.8v-68h9.7v68zm9.8 0h-4v-23l4 4.7z" />
            <path d="M59 94.7a1 1 0 00-1 1v10.9a4.2 4.2 0 00-3.3 2.7 1 1 0 00.6 1.3 1 1 0 00.4 0 1 1 0 001-.6 2.2 2.2 0 012.8-1.4 1 1 0 10.7-1.9H60v-11a1 1 0 00-1-1zM68.7 101.2v-5.5a1 1 0 00-2 0v5.5a1 1 0 102 0zM60.2 112.8a1.4 1.4 0 011.3 1 1 1 0 001.9.3 2.5 2.5 0 014.7 1.4 1 1 0 002 0 4.6 4.6 0 00-7.4-3.6 3.4 3.4 0 00-2.5-1.1 1 1 0 000 2zM73.2 109.7a1 1 0 002 0 6.1 6.1 0 00-6.1-6.1 1 1 0 000 2 4.1 4.1 0 014.1 4zM105.2 109a9.8 9.8 0 00-19-3 6.4 6.4 0 00-2.8-.7 6.5 6.5 0 00-6.5 6.5 1 1 0 002 0 4.5 4.5 0 014.5-4.5 4.4 4.4 0 012.8 1 1 1 0 001.6-.6 7.8 7.8 0 0115.4 1.4 1 1 0 002 0zM7.8 123a8 8 0 006.2-.1 1 1 0 00-.8-1.8 6 6 0 01-8-3 6 6 0 012.9-8 9.4 9.4 0 001.5.8 1 1 0 00.4.1 1 1 0 00.4-2 7.5 7.5 0 01-1-13.2 1 1 0 00.1-1.6A4.2 4.2 0 018.1 91a4.2 4.2 0 017.1-3 1 1 0 001 .2 1 1 0 00.6-.6 5.8 5.8 0 0111.3 1.1A7.4 7.4 0 0022 96a1 1 0 002 0 5.4 5.4 0 118.6 4.4 8.9 8.9 0 00-5.4 7 6.6 6.6 0 00-1 0 6.4 6.4 0 00-4.5 1.9 1 1 0 000 1.4 1 1 0 001.4 0 4.4 4.4 0 017.5 3.1 1 1 0 002 0 6.4 6.4 0 00-3.4-5.7 6.8 6.8 0 014.2-5.9 6.8 6.8 0 019.4 5.9 1 1 0 001.4.8 4.8 4.8 0 011.8-.3 5 5 0 015 5 1 1 0 002 0 7 7 0 00-8.4-6.9 8.9 8.9 0 00-8.6-7h-.2a7.4 7.4 0 00-5.7-11.1 7.8 7.8 0 00-14.6-2.9 6.2 6.2 0 00-3.2-.9 6.2 6.2 0 00-5 10 9.4 9.4 0 00-1 13.9 8.1 8.1 0 00-3.3 4A8 8 0 007.8 123zM91.8 119.8a1 1 0 002 0 6.4 6.4 0 00-11-4.5 1 1 0 000 1.4 1 1 0 001.4 0 4.4 4.4 0 013.1-1.3 4.4 4.4 0 014.5 4.4zM125.4 103.3a7.7 7.7 0 00-3.4-6.4 8.1 8.1 0 00.7-3.3A8.3 8.3 0 00107 90a5.8 5.8 0 00-4 10.6 1 1 0 101.1-1.7 3.8 3.8 0 013.2-6.8 1 1 0 001.2-.6 6.3 6.3 0 0112.2 2 6.2 6.2 0 01-1 3.3 1 1 0 000 .8 1 1 0 00.5.6 5.6 5.6 0 011 9.5 8.4 8.4 0 00-2.8-1.6 1 1 0 10-.6 1.8 6.7 6.7 0 01-.4 12.8 1 1 0 00-.7 1.2 1 1 0 001 .8 1.1 1.1 0 00.2 0A8.7 8.7 0 00124 112a8.7 8.7 0 00-1.3-2.8 7.6 7.6 0 002.7-6z" />
        </svg>
    );

    const handleGetStarted = () => {
        router.push(`${LayoutPaths.Auth}${Paths.Register}`);
    };

    return (
        <div className="pricing container">
            <h1 className="title">Simple Pricing For Everyone</h1>
            <h3 className="description">
                Looking for a tool to monitor and optimize your app ranking? TRY <b>LET'S METRIX</b> for FREE NOW
            </h3>
            <table className="price-table">
                <thead>
                    <tr className="price-table-head">
                        <th scope="col" className="feature-header"></th>
                        <th scope="col" className="plan-header">
                            Started
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="price-row">
                        <td className="feature-label"></td>
                        <td className="price">
                            {renderProductLogo()}
                            <br />
                            <span className="price-amount">Free</span>
                        </td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">Trial Time</td>
                        <td>Unlimited days</td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">Apps</td>
                        <td>Unlimited apps</td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">Connect Google Analytics</td>
                        <td>
                            <CheckOutlined className="check-icon" />
                        </td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">Analyze Keywords</td>
                        <td>Unlimited words</td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">Connect Shopify Partner Data</td>
                        <td>
                            <CheckOutlined className="check-icon" />
                        </td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">App Listing Category Position</td>
                        <td>
                            <CheckOutlined className="check-icon" />
                        </td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">App Listing Details Log</td>
                        <td>
                            <CheckOutlined className="check-icon" />
                        </td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">App Listing Position by Keywords</td>
                        <td>
                            <CheckOutlined className="check-icon" />
                        </td>
                    </tr>
                    <tr className="feature-row">
                        <td className="feature-label">Compare with Competitors</td>
                        <td>
                            <CheckOutlined className="check-icon" />
                        </td>
                    </tr>
                    <tr className="action-row">
                        <td />
                        <td>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleGetStarted}
                                className="get-started-button"
                            >
                                Get Started
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
