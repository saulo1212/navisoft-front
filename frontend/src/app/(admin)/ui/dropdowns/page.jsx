import admin from '@/assets/img/demo/avatars/avatar-admin.png';
import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { basePath } from '@/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Col, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle, FormLabel, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Dropdowns'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Dropdowns'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Toggle contextual overlays for displaying lists of links and more with the Bootstrap dropdown plugin.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Dropdowns are toggleable, contextual overlays for displaying lists of links and more. They're made interactive with the included
              Bootstrap dropdown JavaScript plugin. They're toggled by clicking, not by hovering; this is an intentional design decision. Dropdowns
              are built on a third party library, Popper.js, which provides dynamic positioning and viewport detection.
            </p>
            <p className="mb-0">
              Find more facts and uses at the bootstrap
              <Link href="https://getbootstrap.com/docs/5.3/components/dropdowns/" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <KitchenSink />
              <LinksAndButtons />
              <DropdownButtons />
              <Multilevel />
              <Content />
              <Sizing />
            </Col>
            <Col xl={6}>
              <NoArrow />
              <Animated />
              <Directions />
              <ContainerExamples />
              <Headers />
              <ResponsiveAlignment />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const KitchenSink = () => {
  return <ComponentCard title={<h2>
          Kitchen
          <span className="fw-300">
            <i>Sink example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">A composition of all working elements</div>
          <Dropdown show>
            <DropdownMenu className="d-block position-relative float-none" style={{
            width: '14rem',
            zIndex: 2
          }}>
              <DropdownItem>
                Action<span className="badge bg-success float-end width-2">17</span>
              </DropdownItem>
              <DropdownItem>
                Another action<span className="badge badge-pill bg-primary float-end width-2">29</span>
              </DropdownItem>
              <DropdownItem className="disabled" href="">
                Disabled link
              </DropdownItem>
              <DropdownDivider />
              <DropdownHeader>Dropdown header</DropdownHeader>
              <DropdownItem className="active" href="">
                <i className="sa sa-big-plus" /> &nbsp;Has icon
              </DropdownItem>
              <div className="dropdown-multilevel">
                <DropdownItem className="d-flex align-items-center justify-content-between">
                  Multilevel
                  <i className="sa sa-chevron-right" />
                </DropdownItem>
                <DropdownMenu>
                  <DropdownItem>Menu Item</DropdownItem>
                  <DropdownItem>Another Item</DropdownItem>
                  <DropdownItem className="disabled">Disabled</DropdownItem>
                  <div className="dropdown-multilevel">
                    <DropdownItem className="d-flex align-items-center justify-content-between">
                      Second Level
                      <i className="sa sa-chevron-right" />
                    </DropdownItem>
                    <DropdownMenu>
                      <DropdownItem>Menu Item</DropdownItem>
                      <DropdownItem>Another Item</DropdownItem>
                      <div className="dropdown-multilevel dropdown-multilevel-left">
                        <DropdownItem className="d-flex align-items-center justify-content-between">
                          Third Level
                          <i className="sa sa-chevron-right" />
                        </DropdownItem>
                        <DropdownMenu>
                          <DropdownItem>Menu Item</DropdownItem>
                          <DropdownItem disabled>Disabled</DropdownItem>
                        </DropdownMenu>
                      </div>
                    </DropdownMenu>
                  </div>
                </DropdownMenu>
              </div>
              <DropdownItem>Another action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </ComponentCard>;
};
const LinksAndButtons = () => {
  return <ComponentCard title={<h2>
          Links
          <span className="fw-300">
            <i>& buttons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Dropdown menus can be triggered from <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> elements to better fit your potential needs.
          </div>
          <h5 className="frame-heading">Button</h5>
          <div className="frame-wrap">
            <div className="demo demo-h-spacing">
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-outline-secondary " type="button">
                  Dropdown button
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-info rounded-circle btn-icon content-none" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg className="sa-icon sa-bold sa-icon-light">
                    <use href={`${basePath}/icons/sprite.svg#plus-circle`} />
                  </svg>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-danger rounded-circle btn-icon content-none" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg className="sa-icon sa-bold sa-icon-light">
                    <use href={`${basePath}/icons/sprite.svg#plus-circle`} />
                  </svg>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-success btn-icon rounded content-none" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg className="sa-icon sa-bold sa-icon-light">
                    <use href={`${basePath}/icons/sprite.svg#plus-circle`} />
                  </svg>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <h5 className="frame-heading">Link</h5>
          <div className="frame-wrap">
            <div className="demo demo-h-spacing d-flex">
              <Dropdown>
                <DropdownToggle as={'button'} className="btn btn-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown link
                </DropdownToggle>
                <DropdownMenu aria-labelledby="dropdownMenuLink">
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle as={'button'} className="btn btn-warning rounded-circle btn-icon content-none" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg className="sa-icon sa-bold sa-icon-light">
                    <use href={`${basePath}/icons/sprite.svg#plus-circle`} />
                  </svg>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle as={'button'} className="btn btn-primary rounded-circle btn-icon content-none" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg className="sa-icon sa-bold sa-icon-light">
                    <use href={`${basePath}/icons/sprite.svg#plus-circle`} />
                  </svg>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle as={'button'} className="btn btn-default btn-icon content-none">
                  <svg className="sa-icon sa-bold sa-icon-dark">
                    <use href={`${basePath}/icons/sprite.svg#plus-circle`} />
                  </svg>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const DropdownButtons = () => {
  return <ComponentCard title={<h2>
          Dropdown
          <span className="fw-300">
            <i>buttons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <h5 className="frame-heading">Variations</h5>
          <div className="frame-wrap w-100">
            <div className="demo">
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-primary waves-effect">
                  Primary
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-success waves-effect">
                  Success
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-info waves-effect">
                  Info
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-warning waves-effect">
                  Warning
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-danger waves-effect">
                  Danger
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-dark waves-effect">
                  Dark
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <h5 className="frame-heading">Split button</h5>
          <div className="frame-wrap w-100 mb-0">
            <div className="demo">
              <Dropdown className="btn-group">
                <Button variant="primary" className="waves-effect">
                  Primary
                </Button>
                <DropdownToggle as={'button'} className="btn btn-primary dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <Button variant="success" className="waves-effect">
                  Success
                </Button>
                <DropdownToggle as={'button'} className="btn btn-success dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <Button variant="info" className="waves-effect">
                  Info
                </Button>
                <DropdownToggle as={'button'} className="btn btn-info dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu">
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <Button variant="warning" className="waves-effect">
                  Warning
                </Button>
                <DropdownToggle as={'button'} className="btn btn-warning dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <Button variant="danger" className="waves-effect">
                  Danger
                </Button>
                <DropdownToggle as={'button'} className="btn btn-danger dropdown-toggle-split waves-effect" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <Button variant="dark" className="waves-effect">
                  Dark
                </Button>
                <DropdownToggle as={'button'} className="btn btn-dark dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const Multilevel = () => {
  return <ComponentCard title={<h2>
          Multilevel
          <span className="fw-300">
            <i>dropdown</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add multilevel menu by wrapping the child node selectors with <code>.dropdown-multilevel</code>, change direction of by adding
            <code>.dropdown-multilevel-left</code> (right by default)
          </div>
          <Dropdown className="btn-group">
            <DropdownToggle className="btn btn-danger" type="button">
              <i className="sa sa-energy me-1" /> Multilevel default
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Action</DropdownItem>
              <div className="dropdown-multilevel">
                <DropdownItem className="d-flex align-items-center justify-content-between">
                  Multilevel
                  <i className="sa sa-chevron-right" />
                </DropdownItem>
                <DropdownMenu>
                  <DropdownItem>First level</DropdownItem>
                  <div className="dropdown-multilevel">
                    <DropdownItem className="d-flex align-items-center justify-content-between">
                      Second Level
                      <i className="sa sa-chevron-right" />
                    </DropdownItem>
                    <DropdownMenu>
                      <DropdownItem>Level two</DropdownItem>
                      <DropdownItem disabled>Disabled menu</DropdownItem>
                      <div className="dropdown-multilevel dropdown-multilevel-left d-flex align-items-center justify-content-between">
                        <DropdownItem>
                          Third Level (left)
                          <i className="sa sa-chevron-right" />
                        </DropdownItem>
                        <DropdownMenu>
                          <DropdownItem>Menu Item</DropdownItem>
                          <DropdownItem disabled>Disabled</DropdownItem>
                        </DropdownMenu>
                      </div>
                    </DropdownMenu>
                  </div>
                </DropdownMenu>
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </ComponentCard>;
};
const Content = () => {
  return <ComponentCard title={<h2>
          Content
          <span className="fw-300">
            <i>types</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo demo-no-mb">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary" type="button">
                Text
              </DropdownToggle>
              <DropdownMenu className="p-4 text-muted">
                <p>Some example text that's free-flowing within the dropdown menu.</p>
                <p className="mb-0">And this is more example text.</p>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary" type="button">
                Forms
              </DropdownToggle>
              <DropdownMenu className="dropdown-xl">
                <form className="p-4 needs-validation" noValidate>
                  <div className="mb-3">
                    <FormLabel>Username</FormLabel>
                    <input type="email" id="username" className="form-control" placeholder="your id or email" defaultValue="drlantern@getwebora.com" required />
                    <div className="invalid-feedback">No, you missed this one.</div>
                    <div className="form-text">Your unique username to app</div>
                  </div>
                  <div className="mb-3">
                    <FormLabel>Password</FormLabel>
                    <input type="password" id="password" className="form-control" placeholder="password" defaultValue="password123" required />
                    <div className="invalid-feedback">Sorry, you missed this one.</div>
                    <div className="form-text">Your password</div>
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberme" />
                    <label className="form-check-label" htmlFor="rememberme">
                      Remember me for the next 30 days
                    </label>
                  </div>
                  <Button variant="info" type="submit" className="w-100 waves-effect waves-themed">
                    Sign in
                  </Button>
                </form>
                <DropdownDivider />
                <DropdownItem>New around here? Sign up</DropdownItem>
                <DropdownItem>Forgot password?</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const Sizing = () => {
  return <ComponentCard title={<h2>
          Sizing
          <span className="fw-300">
            <i>dropdowns</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Button dropdowns work with buttons of all sizes, including default and split dropdown buttons</div>
          <div className="demo mb-2">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary btn-lg waves-effect" type="button">
                Large button
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <Button variant="secondary" size="lg" className="waves-effect">
                Large split button
              </Button>
              <DropdownToggle as="button" className="btn btn-lg btn-secondary dropdown-toggle-split waves-effect">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="demo mb-2">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary waves-effect" type="button">
                Default size
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <Button variant="secondary" className="waves-effect">
                Split button
              </Button>
              <DropdownToggle as={'button'} className="btn btn-secondary dropdown-toggle-split waves-effect">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="demo mb-2">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary btn-sm waves-effect">
                Small button
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <Button variant="secondary" size="sm" className="waves-effect">
                Small split button
              </Button>
              <DropdownToggle as={'button'} className="btn btn-sm btn-secondary dropdown-toggle-split waves-effect" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="demo mb-0">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary btn-xs waves-effect" type="button">
                Extra small
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <Button variant="secondary" className="btn-xs waves-effect">
                Extra small
              </Button>
              <DropdownToggle as={'button'} className="btn btn-xs btn-secondary dropdown-toggle-split waves-effect" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const NoArrow = () => {
  return <ComponentCard title={<h2>
          No
          <span className="fw-300">
            <i>arrow</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Remove directional arrow from dropdown button by adding <code>.no-arrow</code> to <code>.dropdown-toggle</code>
          </div>
          <Dropdown className="btn-group">
            <DropdownToggle as={'button'} className="btn btn-info no-arrow waves-effect">
              No arrow
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </ComponentCard>;
};
const Animated = () => {
  return <ComponentCard title={<h2>
          Animated
          <span className="fw-300">
            <i>dropdowns</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add animations to dropdowns by adding <code>.dropdown-menu-animated</code>, <code>.fadeup</code>, <code>.fadedown</code>,
            <code>.faderight</code>, <code>.fadeleft</code> to <code>.dropdown-menu</code>
          </div>
          <div className="demo">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary bg-trans-gradient waves-effect" data-bs-toggle="dropdown" aria-expanded="false" data-bs-animation="false">
                Custom
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-animated">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary bg-brand-gradient waves-effect" data-bs-toggle="dropdown" aria-expanded="true" data-bs-animation="false">
                Fadeinup
              </DropdownToggle>
              <DropdownMenu className="fadeup">
                <DropdownHeader as={'h6'}>Fade in from bottom</DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary bg-brand-gradient waves-effect" data-bs-toggle="dropdown" aria-expanded="true" data-bs-animation="false">
                Fadeindown
              </DropdownToggle>
              <DropdownMenu className="fadedown">
                <DropdownHeader as={'h6'}>Fade in from top</DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary bg-brand-gradient waves-effect" data-bs-toggle="dropdown" aria-expanded="true" data-bs-animation="false">
                Fadeinright
              </DropdownToggle>
              <DropdownMenu className="fadeinright">
                <DropdownHeader as={'h6'}>Fade in from right</DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary bg-brand-gradient waves-effect" data-bs-toggle="dropdown" aria-expanded="true" data-bs-animation="false">
                Fadeinleft
              </DropdownToggle>
              <DropdownMenu className="fadeleft">
                <DropdownHeader as={'h6'}>Fade in from left</DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const Directions = () => {
  return <ComponentCard title={<h2>
          Directional
          <span className="fw-300">
            <i>Arrows</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Trigger dropdown menus above elements by adding <code>.dropup</code>, <code>.dropright</code>, and <code>.dropleft</code> to the parent
            element.
          </div>
          <h5 className="frame-heading">Dropup</h5>
          <div className="frame-wrap">
            <div className="demo demo-no-mb">
              <Dropdown className="btn-group dropup">
                <DropdownToggle as={'button'} className="btn btn-secondary waves-effect">
                  Dropup
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group dropup">
                <Button variant="secondary" className="waves-effect">
                  Split dropup
                </Button>
                <DropdownToggle as={'button'} className="btn btn-secondary dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <h5 className="frame-heading">Dropend</h5>
          <div className="frame-wrap">
            <div className="demo demo-no-mb">
              <Dropdown className="btn-group dropend">
                <DropdownToggle as={'button'} className="btn btn-secondary waves-effect">
                  Dropend
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group dropend">
                <Button variant="secondary" className="waves-effect">
                  Split dropend
                </Button>
                <DropdownToggle as={'button'} className="btn btn-secondary dropdown-toggle-split waves-effect">
                  <span className="visually-hidden">Toggle Dropend</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <h5 className="frame-heading">Dropstart</h5>
          <div className="frame-wrap">
            <div className="demo demo-no-mb">
              <Dropdown className="btn-group dropstart">
                <DropdownToggle as={'button'} className="btn btn-secondary waves-effect">
                  Dropstart
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <div className="btn-group">
                <Dropdown className="btn-group dropstart" role="group">
                  <DropdownToggle as={'button'} className="btn btn-secondary dropdown-toggle-split waves-effect">
                    <span className="visually-hidden">Toggle Dropstart</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                    <DropdownItem>Something else here</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem>Separated link</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button variant="secondary" className="waves-effect">
                  Split dropstart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ContainerExamples = () => {
  return <ComponentCard title={<h2>
          Container
          <span className="fw-300">
            <i>examples</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            You can add any content to dropdown containers and change its width by adding the class <code>.dropdown-sm</code>,
            <code>.dropdown-md</code>, <code>.dropdown-lg</code>, and <code>.dropdown-xl</code>
          </div>
          <div className="demo">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary waves-effect">
                dropdown-sm
              </DropdownToggle>
              <DropdownMenu className="dropdown-sm">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary waves-effect">
                dropdown-md
              </DropdownToggle>
              <DropdownMenu className="dropdown-md">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-primary waves-effect">
                dropdown-lg
              </DropdownToggle>
              <DropdownMenu className="dropdown-lg">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} type="button" className="btn btn-primary waves-effect">
                dropdown-xl
              </DropdownToggle>
              <DropdownMenu className="dropdown-xl">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const Headers = () => {
  return <ComponentCard title={<h2>
          Headers
          <span className="fw-300">
            <i>examples</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Customize <code>.dropdown-header</code> using utility classes. Change
            <Link href="" target="_blank">
              backgrounds
            </Link>
            ,
            <Link href="" target="_blank">
              colors
            </Link>
            , and paddings using various
            <Link href="" target="_blank">
              helpers
            </Link>
          </div>
          <div className="demo">
            <Dropdown className="btn-group">
              <DropdownToggle as="button" className="btn btn-outline-primary waves-effect">
                Custom header 1
              </DropdownToggle>
              <DropdownMenu className="p-0">
                <DropdownHeader className="bg-trans-gradient d-flex flex-row px-4 py-3 rounded-top text-white width-lg">
                  <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                    <span className="me-2">
                      <Image src={admin} className="rounded-circle profile-image" alt="Dr. Codex Lantern" />
                    </span>
                    <div className="info-card-text">
                      <div className="fs-lg text-truncate text-truncate-lg">Sunny A.</div>
                      <span className="text-truncate text-truncate-md opacity-80">admin@smartadmin.ai</span>
                    </div>
                  </div>
                </DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-outline-primary waves-effect">
                Custom header 2
              </DropdownToggle>
              <DropdownMenu className="p-0">
                <DropdownHeader className="bg-fusion-500 d-flex flex-row px-4 py-3 rounded-top text-white">
                  <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                    <span className="me-2">
                      <Image src={admin} className="rounded-circle profile-image" alt="Dr. Codex Lantern" />
                    </span>
                    <div className="info-card-text">
                      <div className="fs-lg text-truncate text-truncate-lg">Sunny A.</div>
                      <span className="text-truncate text-truncate-md opacity-80">admin@smartadmin.ai</span>
                    </div>
                  </div>
                </DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-outline-primary waves-effect">
                Custom header 3
              </DropdownToggle>
              <DropdownMenu className="p-0">
                <DropdownHeader className="bg-danger-900 bg-info-gradient d-flex flex-row px-4 py-3 rounded-top text-white">
                  <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                    <span className="me-2">
                      <Image src={admin} className="rounded-circle profile-image" alt="Dr. Codex Lantern" />
                    </span>
                    <div className="info-card-text">
                      <div className="fs-lg text-truncate text-truncate-lg">Sunny A.</div>
                      <span className="text-truncate text-truncate-md opacity-80">admin@smartadmin.ai</span>
                    </div>
                  </div>
                </DropdownHeader>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ResponsiveAlignment = () => {
  return <ComponentCard title={<h2>
          Responsive
          <span className="fw-300">
            <i>alignment</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            If you want to use responsive alignment, disable dynamic positioning by adding the <code>data-display="static"</code> attribute and use
            the responsive variation classes. To align left/right the dropdown menu with the given breakpoint or larger, add
            <code>
              .dropdown-menu{'{'}-sm|-md|-lg|-xl{'}'}-right
            </code>
            or
            <code>
              .dropdown-menu{'{'}-sm|-md|-lg|-xl{'}'}-left
            </code>
          </div>
          <h5 className="frame-heading">Left-aligned but right aligned when large screen</h5>
          <div className="frame-wrap">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary waves-effect">
                Left aligned large screens
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg-right">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <h5 className="frame-heading">Right-aligned but left aligned when large screen</h5>
          <div className="frame-wrap mb-0">
            <Dropdown className="btn-group">
              <DropdownToggle as={'button'} className="btn btn-secondary waves-effect">
                Right aligned large screens
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-right dropdown-menu-lg-left">
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>;
};