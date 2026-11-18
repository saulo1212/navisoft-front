import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Alert, Row } from 'react-bootstrap'
import VisibilityPage from './components/VisibilityMode'

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Visibility Generator'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={'Create responsive visibility classes for elements across screen sizes.'}
        />
        <div className="main-content">
          <Alert variant="info">
            <h5 className="alert-heading d-flex align-items-center">
              <i className="sa sa-info me-2" />
              About Visibility Classes
            </h5>
            <p className="mb-0">
              Bootstrap provides utility classes to control the visibility and display properties of elements based on screen size. This tool helps
              you generate the classes you need for responsive design. Combine display types with breakpoints to create elements that show or hide at
              specific screen sizes.
            </p>
          </Alert>
          <Row className="g-3">
            <VisibilityPage />
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
