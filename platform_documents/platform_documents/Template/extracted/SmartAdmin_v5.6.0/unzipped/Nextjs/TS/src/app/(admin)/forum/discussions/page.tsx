import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import Discussions from './components/Discussions'
import Pagination from './components/Pagination'
import Post from './components/Post'
import ThreadReplySection from './components/ThreadReplySection'

export const metadata: Metadata = { title: 'Forum: Discussion' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Forum: Discussion'}
          subTitle1={'Layouts'}
          subTitle2={'Miscellaneous'}
          subText="Discussion view with short and long reply action buttons, jump to dropdown, pagination, likes and star rating system."
        />
        <div className="main-content">
          <Discussions />
          <Post />
          <Pagination />
          <ThreadReplySection />
        </div>
      </div>
    </>
  )
}

export default Page
