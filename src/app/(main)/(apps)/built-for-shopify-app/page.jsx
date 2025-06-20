import DashboardApiService from '@/api-services/api/DashboardApiService';
import ListAppByDay from '@/components/list-app/ListAppByDay';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
    alternates: {
        canonical: `${canonical}built-for-shopify-app`,
    },
};

export default async function AppByDay(params) {
    const sort_by = params.searchParams.sort_by;
    const date = params.searchParams.date;

    let initialData = {
        listApp: [],
        total: 0,
    };

    try {
        const result = await DashboardApiService.getBFSByDate(date, sort_by, 1, 20);
        if (result && result.code == 0) {
            initialData = {
                listApp: result.result,
                total: result.total_app,
            };
        }
    } catch (error) {
        console.error('Error fetching list app by day:', error);
    }

    return <ListAppByDay initialData={initialData} />;
}
