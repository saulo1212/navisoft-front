import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import ChatListView from './components/ChatListView'
import ChatView from './components/ChatView'

export const metadata: Metadata = { title: 'Messenger & Chat' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Messenger & Chat'}
          subTitle1={'Communication'}
          subTitle2={'SmartAdmin'}
          subText="Can be the starting page for your application..."
        />
        <div className="main-content layout-trimmed">
          <div className="d-flex flex-grow-1 p-0 w-100 h-100">
            <ChatView />
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
