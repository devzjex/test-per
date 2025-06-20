import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class LandingPageApiService {
    static async getTop5Apps(id) {
        const response = await CommonCall(`${URL_API}home/top_app_in_category?category=${id}`);
        return response;
    }
    static async getCategoriesHome() {
        const response = await CommonCall(`${URL_API}home/all_category`);
        return response;
    }
    static async getTopMoverHome(page, per_page) {
        const response = await CommonCall(`${URL_API}home/top_movers`);
        return response;
    }
    static async getTopReviewHome(page, per_page) {
        const response = await CommonCall(`${URL_API}home/top_review`);
        return response;
    }
    static async getTopReleaseHome(page, per_page) {
        const response = await CommonCall(`${URL_API}home/top_release`);
        return response;
    }
    static async getCount() {
        const response = await CommonCall(`${URL_API}home/count`);
        return response;
    }
    static async getBlogs() {
        const response = await CommonCall(`${URL_API}blogs/get_for_landing_page`);
        return response;
    }
    static async handleShowOnboard(show_onboarding, skip_step) {
        const body = {
            show_onboarding,
            skip_step,
        };
        const header = {
            method: 'POST',
            body: JSON.stringify(body),
        };
        const api = `${URL_API}onboarding`;
        if (skip_step) {
            const result = await CommonCall(api, header);
            return result;
        }
        const result = await CommonCall(api);
        return result;
    }

    static async handleShowOnboardToServer({ token, show_onboarding, skip_step } = {}) {
        const api = `${URL_API}onboarding`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        if (skip_step !== undefined || show_onboarding !== undefined) {
            const response = await fetch(api, {
                method: 'POST',
                headers,
                body: JSON.stringify({ show_onboarding, skip_step }),
            });
            return response.json();
        } else {
            const response = await fetch(api, {
                method: 'GET',
                headers,
            });
            return response.json();
        }
    }
}
