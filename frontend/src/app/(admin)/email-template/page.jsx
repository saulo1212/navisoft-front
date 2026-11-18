import emailorder from '@/assets/img/demo/pages/email-order.webp';
import newdevice from '@/assets/img/demo/pages/new-device.webp';
import verifyemail from '@/assets/img/demo/pages/verify-email.webp';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Image from 'next/image';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import passrequest from '@/assets/img/demo/pages/password-request.webp';
import passreset from '@/assets/img/demo/pages/password-reset.webp';
export const metadata = {
  title: 'Email Design'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Email Design'} subTitle1={'Layouts'} subTitle2={'Authentication'} subText="Variety of email designs for different scenarios." />

        <div className="main-content">
          <div className="info-container">
            <p className="mb-0">
              You can find your email templates inside the source directory <code>SmartAdmin/src/e-templates</code>
            </p>
          </div>

          <Row>
            <Col sm={6}>
              <Card className="m-auto border mb-g">
                <CardHeader className="d-flex align-items-center justify-content-between">Order Confirmation</CardHeader>
                <CardBody>
                  <Image src={emailorder} alt="Login Page" className="img-fluid inverse-color" />
                </CardBody>
              </Card>
              <Card className="m-auto border  mb-g">
                <CardHeader className="d-flex align-items-center justify-content-between">New Device Detected</CardHeader>
                <CardBody>
                  <Image src={newdevice} alt="New Device Detected" className="img-fluid inverse-color" />
                </CardBody>
              </Card>
              <Card className="m-auto border">
                <CardHeader className="d-flex align-items-center justify-content-between">Verify Email</CardHeader>
                <CardBody>
                  <Image src={verifyemail} alt="Verify Email" className="img-fluid inverse-color" />
                </CardBody>
              </Card>
            </Col>

            <Col sm={6}>
              <Card className="m-auto border mb-g">
                <CardHeader className="d-flex align-items-center justify-content-between">Password Change Request</CardHeader>
                <CardBody>
                  <Image src={passrequest} alt="Password Change Request" className="img-fluid inverse-color" />
                </CardBody>
              </Card>
              <Card className="m-auto border">
                <CardHeader className="d-flex align-items-center justify-content-between">One Time Code</CardHeader>
                <CardBody>
                  <Image src={passreset} alt="Password Reset" className="img-fluid inverse-color" />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;