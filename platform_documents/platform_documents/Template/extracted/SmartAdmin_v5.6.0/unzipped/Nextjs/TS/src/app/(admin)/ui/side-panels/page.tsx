import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import Utilities from './components/Utilities'

export const metadata: Metadata = { title: 'Side Panels' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Side Panels'}
          subTitle1={'Design'}
          subTitle2={'UI Components'}
          subText={'These side panels slide out on mobile viewports and can be toggled using a button in slide in/out mode.'}
        />
        <div className="info-container">
          <p className="mb-0">
            <strong>Tip:</strong> Control the width of the side panel by setting the <code>--sidepanel-width</code> variable in the{' '}
            <code>_sidepanels.scss</code> file, or by using the
            <code>style="--sidepanel-width: 20rem;"</code> attribute on the <code>.slide-on-mobile</code> element.
          </p>
        </div>

        <Utilities />
      </div>
    </>
  )
}

export default Page
