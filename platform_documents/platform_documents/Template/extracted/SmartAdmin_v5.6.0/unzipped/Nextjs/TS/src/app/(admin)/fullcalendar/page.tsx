import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import CalendarPage from './components/CalendarCard'

export const metadata: Metadata = { title: 'FullCalendar' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Full Calendar'} subTitle1={'Data Visualization'} subText={'Interactive event calendar with drag and drop'} />

        <div className="main-content">
          <CalendarPage />
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }} id="toast-container" />
        </div>
      </div>
    </>
  )
}

export default Page
