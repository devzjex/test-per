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
  };

  try {
    const result = await BlogsApiService.getAllBlogs(page, per_page);
    if (result && result.code == 0) {
      initialDataBlogs = {
        data: result.data,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error('Error fetch data', error);
  }

  return <ListBlogs initialDataBlogs={initialDataBlogs} page={page} per_page={per_page} />;
}
