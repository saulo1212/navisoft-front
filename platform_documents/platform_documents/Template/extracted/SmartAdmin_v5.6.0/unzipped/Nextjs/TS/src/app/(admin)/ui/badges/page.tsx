import avatars from '@/assets/img/demo/avatars/avatar-c.png'
import ComponentCard from '@/components/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Col, Row } from 'react-bootstrap'
import { FaDownload, FaPrint } from 'react-icons/fa'

export const metadata: Metadata = { title: 'Badges' }

const ScalingBadges = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Badge
          <span className="fw-300">
            <i>scaling</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Badges scale to match the size of the immediate parent element by using relative font sizing and <code>em</code> units
          </div>
          <h5 className="frame-heading">Badge Scaling Examples</h5>
          <div className="frame-wrap">
            <div className="demo">
              <h1>
                Example heading <span className="badge bg-primary">New</span>
              </h1>
              <h2>
                Example heading <span className="badge bg-secondary">New</span>
              </h2>
              <h3>
                Example heading <span className="badge bg-success">New</span>
              </h3>
              <h4>
                Example heading <span className="badge bg-info">New</span>
              </h4>
              <h5>
                Example heading <span className="badge bg-warning">New</span>
              </h5>
              <h6>
                Example heading <span className="badge bg-danger">New</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const BadgesInButtons = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Badge
            <span className="fw-300">
              <i>in buttons</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <div className="panel-tag">
              Badges scale to match the size of the immediate parent element by using relative font sizing and <code>em</code> units
            </div>
            <h5 className="frame-heading">Regular buttons</h5>
            <div className="frame-wrap">
              <div className="demo">
                <Button variant="primary" size="lg" className="waves-effect">
                  Messages
                  <span className="badge bg-primary-300 ms-1">4</span>
                </Button>
                <Button variant="secondary" size="lg" className="waves-effect">
                  Messages
                  <span className="badge bg-fusion-500 ms-1">4</span>
                </Button>
                <Button size="lg" variant="default" className="waves-effect">
                  Messages
                  <span className="badge bg-primary-500 ms-1">4</span>
                </Button>
              </div>
              <div className="demo">
                <Button variant="default" className="waves-effect">
                  Messages
                  <span className="badge bg-primary-500 ms-1">4</span>
                </Button>
                <Button variant="success" className="waves-effect">
                  Messages
                  <span className="badge bg-success-700 ms-1">4</span>
                </Button>
                <Button variant="warning" className="waves-effect">
                  Messages
                  <span className="badge bg-warning-200 ms-1">4</span>
                </Button>
              </div>
              <div className="demo">
                <Button size="sm" variant="info" className="waves-effect">
                  Messages
                  <span className="badge bg-info-700 ms-1">4</span>
                </Button>
                <Button size="sm" variant="danger" className="waves-effect">
                  Messages
                  <span className="badge bg-danger-800 ms-1">4</span>
                </Button>
                <Button size="sm" variant="dark" className="waves-effect">
                  Messages
                  <span className="badge bg-fusion-300 ms-1">4</span>
                </Button>
              </div>
            </div>
            <h5 className="frame-heading">Outline buttons</h5>
            <div className="frame-wrap">
              <div className="demo">
                <Button variant="outline-primary" size="lg" className="waves-effect">
                  Messages
                  <span className="badge bg-primary-300 ms-1">4</span>
                </Button>
                <Button variant="outline-secondary" size="lg" className="waves-effect">
                  Messages
                  <span className="badge bg-fusion-500 ms-1">4</span>
                </Button>
                <Button variant="outline-default" size="lg" className="waves-effect">
                  Messages
                  <span className="badge bg-primary-500 ms-1">4</span>
                </Button>
              </div>
              <div className="demo">
                <Button variant="outline-default" className="waves-effect">
                  Messages
                  <span className="badge bg-primary-500 ms-1">4</span>
                </Button>
                <Button variant="outline-success" className="waves-effect">
                  Messages
                  <span className="badge bg-success-700 ms-1">4</span>
                </Button>
                <Button variant="outline-warning" className="waves-effect">
                  Messages
                  <span className="badge bg-warning-200 ms-1">4</span>
                </Button>
              </div>
              <div className="demo">
                <Button variant="outline-info" size="sm" className="waves-effect">
                  Messages
                  <span className="badge bg-info-700 ms-1">4</span>
                </Button>
                <Button variant="outline-danger" size="sm" className="waves-effect">
                  Messages
                  <span className="badge bg-danger-800 ms-1">4</span>
                </Button>
                <Button variant="outline-dark" size="sm" className="waves-effect">
                  Messages
                  <span className="badge bg-fusion-300 ms-1">4</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

const IconBadges = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Icon
          <span className="fw-300">
            <i>badges</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Use utility classes with <code>.btn-icon</code> to place the badge
          </div>
          <div className="demo demo-h-spacing mb-4">
            <Button variant="primary" size="lg" className="btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-print" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2">
                9 <span className="visually-hidden">unread messages</span>
              </span>
            </Button>
            <Button variant="secondary" size="lg" className="btn-icon position-relative js-waves-off">
              <i className="fal fa-volume-mute" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success mt-2">
                18 <span className="visually-hidden">unread messages</span>
              </span>
            </Button>
            <a href="" className="btn btn-default btn-lg btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-envelope" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning-700 mt-2 p-1">
                99 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <Button variant="outline-success" size="lg" className="btn-icon rounded-circle position-relative js-waves-off">
              <FaDownload className="fal fa-download" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary mt-2">
                100.. <span className="visually-hidden">unread messages</span>
              </span>
            </Button>
          </div>
          <div className="demo demo-h-spacing mb-4">
            <a href="" className="btn btn-primary btn-icon rounded-circle position-relative js-waves-off">
              <FaPrint className="fal fa-print" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1">
                16 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <a href="" className="btn btn-secondary btn-icon position-relative js-waves-off">
              <i className="fal fa-volume-mute fs-md" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success mt-1">
                4 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <a href="" className="btn btn-default btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-envelope" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning mt-1">
                4 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <a href="" className="btn btn-outline-success btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-download" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary mt-1">
                99+ <span className="visually-hidden">unread messages</span>
              </span>
            </a>
          </div>
          <div className="demo demo-h-spacing mb-4">
            <a href="" className="btn btn-sm btn-primary btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-print" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                4 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <a href="" className="btn btn-sm btn-secondary btn-icon position-relative js-waves-off">
              <i className="fal fa-volume-mute fs-md" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                0 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <a href="" className="btn btn-sm btn-default btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-envelope" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                7 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
            <a href="" className="btn btn-sm btn-outline-success btn-icon rounded-circle position-relative js-waves-off">
              <i className="fal fa-download" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                4 <span className="visually-hidden">unread messages</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const StatusBadges = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Status
          <span className="fw-300">
            <i>badges</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            These badges are unique and triggered by wrapping an element with <code>.status</code> class. Comes with three badge sizes
            <code>.status-sm</code>, <code>.status-xs</code> and the default <code>.status</code>. Comes in 3 colors, <code>.status-danger</code>,
            <code>.status-warning</code>, and <code>.status-success</code>
          </div>
          <div className="demo">
            <span className="status d-inline-block">
              <Image src={avatars} className="profile-image rounded-circle" alt="..." />
            </span>
            <span className="status status-danger d-inline-block">
              <Image src={avatars} className="profile-image rounded-circle" alt="..." />
            </span>
            <span className="status status-success d-inline-block">
              <Image src={avatars} className="profile-image rounded-circle" alt="..." />
            </span>
            <span className="status status-warning d-inline-block">
              <Image src={avatars} className="profile-image rounded-circle" alt="..." />
            </span>
          </div>
          <div className="demo">
            <span className="status status-sm d-inline-block">
              <Image src={avatars} className="profile-image profile-image-md rounded-circle" alt="..." />
            </span>
            <span className="status status-sm status-danger d-inline-block">
              <Image src={avatars} className="profile-image profile-image-md rounded-circle" alt="..." />
            </span>
            <span className="status status-sm status-success d-inline-block">
              <Image src={avatars} className="profile-image profile-image-md rounded-circle" alt="..." />
            </span>
            <span className="status status-sm status-warning d-inline-block">
              <Image src={avatars} className="profile-image profile-image-md rounded-circle" alt="..." />
            </span>
          </div>
          <div className="demo">
            <span className="status status-xs d-inline-block">
              <Image src={avatars} className="profile-image profile-image-sm rounded-circle" alt="..." />
            </span>
            <span className="status status-xs status-danger d-inline-block">
              <Image src={avatars} className="profile-image profile-image-sm rounded-circle" alt="..." />
            </span>
            <span className="status status-xs status-success d-inline-block">
              <Image src={avatars} className="profile-image profile-image-sm rounded-circle" alt="..." />
            </span>
            <span className="status status-xs status-warning d-inline-block">
              <Image src={avatars} className="profile-image profile-image-sm rounded-circle" alt="..." />
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const ContextualVariations = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Contextual
          <span className="fw-300">
            <i>variations</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">Add any of the below mentioned modifier classes to change the appearance of a badge.</div>
          <div className="frame-wrap">
            <div className="demo">
              <span className="badge bg-primary">Primary</span>
              <span className="badge bg-secondary">Secondary</span>
              <span className="badge bg-success">Success</span>
              <span className="badge bg-danger">Danger</span>
              <span className="badge bg-warning text-dark">Warning</span>
              <span className="badge bg-info">Info</span>
              <span className="badge bg-light text-dark">Light</span>
              <span className="badge bg-dark">Dark</span>
            </div>
          </div>
          <div className="frame-heading">Border utility</div>
          <div className="frame-wrap">
            <div className="demo">
              <span className="badge border border-primary text-primary">Primary</span>
              <span className="badge border border-secondary text-secondary">Secondary</span>
              <span className="badge border border-success text-success">Success</span>
              <span className="badge border border-danger text-danger">Danger</span>
              <span className="badge border border-warning text-warning">Warning</span>
              <span className="badge border border-info text-info">Info</span>
              <span className="badge border border-light text-light">Light</span>
              <span className="badge border border-dark text-dark">Dark</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const PillBadges = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Pill
          <span className="fw-300">
            <i>badges</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Use the <code>.badge-pill</code> modifier class to make badges more rounded (with a larger border-radius and additional horizontal
            padding).
          </div>
          <div className="frame-wrap">
            <div className="demo">
              <span className="badge rounded-pill bg-primary">Primary</span>
              <span className="badge rounded-pill bg-secondary">Secondary</span>
              <span className="badge rounded-pill bg-success">Success</span>
              <span className="badge rounded-pill bg-danger">Danger</span>
              <span className="badge rounded-pill bg-warning">Warning</span>
              <span className="badge rounded-pill bg-info">Info</span>
              <span className="badge rounded-pill bg-light">Light</span>
              <span className="badge rounded-pill bg-dark">Dark</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const LinksBadges = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Links
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Add <code>.badge-*</code> class on a hyperlink element to convert it to actionable badges with hover and focus states
          </div>
          <div className="demo">
            <Link href="" className="badge bg-primary">
              Link Badge - Primary
            </Link>
            <Link href="" className="badge bg-secondary">
              Link Badge - Secondary
            </Link>
            <Link href="" className="badge bg-success">
              Link Badge - Success
            </Link>
            <Link href="" className="badge bg-danger">
              Link Badge - Danger
            </Link>
            <Link href="" className="badge bg-warning">
              Link Badge - Warning
            </Link>
            <Link href="" className="badge bg-info">
              Link Badge - Info
            </Link>
            <Link href="" className="badge bg-light">
              Link Badge - Light
            </Link>
            <Link href="" className="badge bg-dark">
              Link Badge - Dark
            </Link>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const NestedBadge = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Links
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Use the included{' '}
            <Link href="/utilities/colorpalette" target="_blank">
              color utilities
            </Link>{' '}
            to change background and text colors. Below are examples of nested badge with different background colors
          </div>
          <div className="frame-wrap">
            <div className="demo">
              <span className="badge bg-primary-100">
                <span className="badge bg-primary-200">
                  <span className="badge bg-primary-300">
                    <span className="badge bg-primary-400">
                      <span className="badge bg-primary-500">
                        <span className="fs-xl fw-300">Nested Badge 1</span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <span className="badge bg-primary-400">
                <span className="badge bg-info-500">
                  <span className="badge bg-success-500">
                    <span className="badge bg-warning-500">
                      <span className="badge bg-danger-500">
                        <span className="fs-xl fw-300">Nested Badge 2</span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <span className="badge bg-danger-400 badge-pill">
                <span className="badge bg-warning-500 badge-pill">
                  <span className="badge bg-info-500 badge-pill">
                    <span className="badge bg-success-500 badge-pill">
                      <span className="badge bg-primary-500 badge-pill">
                        <span className="fs-xl fw-300">99+</span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const HeaderBadge = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Badge
          <span className="fw-300">
            <i>header</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            We use <code>.badge-icon</code> with a combination of other utility classes to create a link badge. This class will auto turncate overflow
            giving you a nice clean look without any hassle
          </div>
          <div className="demo">
            <Link href="" className="height-2 d-inline-flex align-items-center justify-content-center position-relative m-0 text-primary h2">
              I am a large text
              <span className="badge badge-icon position-relative ms-1">9999</span>
            </Link>
            <br />
            <Link
              href=""
              className="width-auto height-2 d-inline-flex align-items-center justify-content-center position-relative m-0 h4 text-primary">
              I am smaller text
              <span className="badge badge-icon position-relative ms-1">9999</span>
            </Link>
            <br />
            <Link href="" className="width-auto height-2 d-inline-flex align-items-center justify-content-center position-relative m-0 text-primary">
              I am normal text
              <span className="badge badge-icon position-relative ms-1">9999</span>
            </Link>
          </div>
          <div className="demo">
            <Link href="" className="width-3 height-2 d-inline-flex align-items-center justify-content-center position-relative h1 text-primary">
              <i className="fal fa-bell" />
              <span className="badge badge-icon top-0 end-0">11</span>
            </Link>
            <Link href="" className="width-3 height-2 d-inline-flex align-items-center justify-content-center position-relative h1 text-primary">
              <i className="fal fa-envelope" />
              <span className="badge badge-icon top-0 end-0">17</span>
            </Link>
            <Link href="" className="width-3 height-2 d-inline-flex align-items-center justify-content-center position-relative h3 text-primary">
              <i className="fal fa-bell" />
              <span className="badge badge-icon top-0 end-0">11</span>
            </Link>
            <Link href="" className="width-3 height-2 d-inline-flex align-items-center justify-content-center position-relative h3 text-primary">
              <i className="fal fa-envelope" />
              <span className="badge badge-icon top-0 end-0">17</span>
            </Link>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Badges'}
          subTitle1={'Design'}
          subTitle2={'UI Components'}
          subText={'Small and adaptive tag for adding context to just about any content.'}
        />
        <div className="main-content">
          <div className="info-container">
            <p>
              Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies – such as
              screen readers. Ensure that information denoted by the color is either obvious from the content itself (e.g. the visible text), or is
              included through alternative means, such as additional text hidden with the <code>.visually-hidden</code> class.
            </p>
            <p className="mb-0">
              Learn more about this component on bootstrap's
              <Link href="https://getbootstrap.com/docs/{{bs4v}}/components/badge/" target="_blank">
                official documentation
              </Link>
            </p>
          </div>
          <Row>
            <Col xl="6">
              <ScalingBadges />
              <BadgesInButtons />
              <IconBadges />
              <StatusBadges />
            </Col>
            <Col xl="6">
              <ContextualVariations />
              <PillBadges />
              <LinksBadges />
              <NestedBadge />
              <HeaderBadge />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
