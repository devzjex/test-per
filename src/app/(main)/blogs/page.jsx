import ListBlogs from './_components/Blogs';
import { BlogDetail } from '@/seo/Blogs';
import { landingPage } from '@/seo/LandingPage';
import BlogsApiService from '@/api-services/api/BlogsApiService';

const { canonical } = landingPage;
const { title } = BlogDetail;

export const metadata = {
    title: title,
    alternates: {
        canonical: `${canonical}blogs`,
    },
};

export default async function Blogs({ searchParams }) {
    const page = parseInt(searchParams.page || 1);
    const per_page = parseInt(searchParams.per_page || 9);

    let initialDataBlogs = {
        data: [],
        total: 0,
        allTags: [],
        allBlogs: [],
    };

    try {
        const allBlogsResult = await BlogsApiService.getAllBlogs(1, Number.MAX_SAFE_INTEGER);
        const allBlogs = allBlogsResult?.data || [];

        const total = allBlogsResult?.total_app || 0;

        const tagMap = {};
        allBlogs.forEach((blog) => {
            (blog.tags || []).forEach((tag) => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        });

        const allTags = Object.entries(tagMap)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => a.tag.localeCompare(b.tag));

        const result = await BlogsApiService.getAllBlogs(page, 10);

        const start = (page - 1) * per_page;
        const end = start + per_page;
        const paginatedBlogs = allBlogs.slice(start, end);

        if (result && result.code == 0) {
            initialDataBlogs = {
                data: paginatedBlogs,
                total,
                allTags,
                allBlogs,
            };
        }
    } catch (error) {
        console.error('Error fetch data', error);
    }

    return <ListBlogs initialDataBlogs={initialDataBlogs} page={page} per_page={per_page} />;
}
