import PageBreadcrumb from '@/components/PageBreadcrumb';
export const metadata = {
  title: 'Blank Page'
};
const page = () => {
  return <div className="content-wrapper">
      <PageBreadcrumb title={'Blank Page'} subTitle1={'Insights'} />
    </div>;
};
export default page;