import admin from '@/assets/img/demo/avatars/avatar-admin.png';
import logo from '@/assets/img/logo.png';
import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Col, Container, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavbarToggle, NavItem, NavLink, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Navbars'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Navbars'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Navbars can be styled using Bootstrap classes, such as <code>.navbar-light</code> and <code>.navbar-dark</code>, to match different
              themes. Additionally, Bootstrap allows <strong>toggling the navbar</strong> for mobile views, ensuring an optimal user experience. By
              utilizing built-in utilities like <code>.fixed-top</code> or <code>.sticky-top</code>, developers can create <strong>fixed</strong> or
              <strong>sticky</strong> navbars that remain visible while scrolling.
            </p>
            <p className="mb-0">
              Learn more about this component on bootstrap's
              <Link href="https://getbootstrap.com/docs/5.3/components/navbar/" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>
          <Row>
            <Col xl={6}>
              <SupportedElements />
              <NavbarBrand />
              <NavbarLink />
              <NavbarLinksUsingUtilities />
            </Col>
            <Col xl={6}>
              <ColorVariations />
              <HeaderPosition />
              <NavbarIcons />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const SupportedElements = () => {
  return <ComponentCard title={<h2>
          Supported
          <span className="fw-300">
            <i>content</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>Navbars come with built-in support for a handful of sub-components. Choose from the following as needed:</p>
            <ul className="d-grid gap-2">
              <li>
                <code>.navbar-brand</code> for your company, product, or project name.
              </li>
              <li>
                <code>.navbar-nav</code> for a full-height and lightweight navigation (including support for dropdowns).
              </li>
              <li>
                <code>.navbar-toggler</code> for use with our collapse plugin and other <Link href="#responsive-behaviors">navigation toggling</Link>
                behaviors.
              </li>
              <li>
                <code>.form-inline</code> for any form controls and actions.
              </li>
              <li>
                <code>.navbar-text</code> for adding vertically centered strings of text.
              </li>
              <li>
                <code>.collapse.navbar-collapse</code> for grouping and hiding navbar contents by a parent breakpoint.
              </li>
            </ul>
          </div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Container fluid>
              <Link className="navbar-brand" href="">
                Navbar
              </Link>
              <NavbarToggle type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </NavbarToggle>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <Nav className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem>
                    <NavLink active>Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Link</NavLink>
                  </NavItem>
                  <Dropdown className="nav-item">
                    <DropdownToggle as={'button'} className="nav-link">
                      Dropdown
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <NavItem>
                    <NavLink disabled>Disabled</NavLink>
                  </NavItem>
                </Nav>
                <form className="d-flex">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  <Button variant="outline-success" className="waves-effect rounded-3 width-4 d-flex align-items-center justify-content-center px-1" type="submit">
                    <i className="sa sa-magnifier" />
                  </Button>
                </form>
              </div>
            </Container>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};
const NavbarBrand = () => {
  return <ComponentCard title={<h2>
          Navbar
          <span className="fw-300">
            <i>Brand</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The <code>.navbar-brand</code> can be applied to most elements, but an anchor works best as some elements might require utility classes or
            custom styles.
          </div>
          <nav className="navbar navbar-light bg-light">
            <Container fluid>
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-text-top me-2" alt="logo" /> SmartAdmin
              </Link>
            </Container>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};
const NavbarLink = () => {
  return <ComponentCard title={<h2>
          Navbar
          <span className="fw-300">
            <i>Links</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Navbar navigation links build on our <code>.nav</code> options with their own modifier class and require the use of
              <a href="#toggler">toggler classes</a> for proper responsive styling.
              <strong>Navigation in navbars will also grow to occupy as much horizontal space as possible</strong> to keep your navbar contents
              securely aligned.
            </p>
          </div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Container fluid>
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-text-top me-2" alt="logo" /> SmartAdmin
              </Link>
              <Button className="navbar-toggler waves-effect" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
                <span className="navbar-toggler-icon" />
              </Button>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <Nav className="navbar-nav">
                  <NavItem>
                    <NavLink active>Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Features</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Pricing</NavLink>
                  </NavItem>
                  <Dropdown className="nav-item">
                    <DropdownToggle className="nav-link" as={'button'}>
                      Dropdown link
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Nav>
              </div>
            </Container>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};
const NavbarLinksUsingUtilities = () => {
  return <ComponentCard title={<h2>
          Navbar
          <span className="fw-300">
            <i>Links using utilities</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Mix and match with other components and utilities as needed.</div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Container fluid>
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-text-top me-2" alt="logo" /> SmartAdmin
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem>
                    <NavLink className="active">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Features</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Pricing</NavLink>
                  </NavItem>
                </ul>
                <span className="navbar-text">Navbar text with an inline element</span>
              </div>
            </Container>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};
const ColorVariations = () => {
  return <ComponentCard title={<h2>
          Color
          <span className="fw-300">
            <i>Variations</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Change navbar colors with these utilities. Note that the <code>.navbar-brand</code> and <code>.navbar-toggler</code> will adapt to blend
            in with their container.
          </div>

          <nav className="navbar navbar-expand-lg navbar-dark bg-fusion-500 mb-2">
            <Container fluid>
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-text-top me-2" alt="logo" /> SmartAdmin
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem>
                    <NavLink className="active">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Features</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Pricing</NavLink>
                  </NavItem>
                </ul>
                <button type="button" className="btn btn-primary btn-icon" data-bs-toggle="popover" data-bs-container="#navbarColor01" data-bs-placement="top" data-bs-html="true" data-bs-content="<form class='d-flex'><input class='form-control me-2' type='search' placeholder='Search' aria-label='Search'></form>">
                  <i className="sa sa-magnifier" />
                </button>
              </div>
            </Container>
          </nav>
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-primary-gradient mb-2">
            <Container fluid>
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-text-top me-2" alt="logo" /> SmartAdmin
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem>
                    <NavLink className="active">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Features</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Pricing</NavLink>
                  </NavItem>
                </ul>
              </div>
            </Container>
          </nav>

          <nav className="navbar navbar-expand-lg navbar-light">
            <Container fluid>
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-text-top me-2" alt="logo" /> SmartAdmin
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem>
                    <NavLink className="active">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Features</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Pricing</NavLink>
                  </NavItem>
                </ul>
              </div>
            </Container>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};
const HeaderPosition = () => {
  return <ComponentCard title={<h2>
          Header
          <span className="fw-300">
            <i>position</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Use <Link href="">position utilities</Link> to place navbars in non-static positions. Choose from fixed to the top, fixed to the bottom,
              or stickied to the top (scrolls with the page until it reaches the top, then stays there). Fixed navbars use{' '}
              <code>position: fixed</code>, meaning they're pulled from the normal flow of the DOM and may require custom CSS (e.g.,{' '}
              <code>padding-top</code> on the
              <code>&lt;body&gt;</code>) to prevent overlap with other elements.
            </p>
            Also note that
            <strong>
              <code>.sticky-top</code> uses <code>position: sticky</code>, which
              <Link href="https://caniuse.com/#feat=css-sticky" target="_blank">
                isn't fully supported in every browser
              </Link>
            </strong>
          </div>
          <div className="position-relative overflow-auto" style={{
          height: 300
        }}>
            <h5 className="fw-500">
              Sticky Element: Scroll Down to See the Effect
              <small>Scroll down this page to see how sticky positioning works</small>
            </h5>
            <nav className="navbar navbar-expand-lg navbar-light bg-warning-500 sticky-top">
              <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                <Image src={logo} className="d-inline-block align-top mx-2" alt="logo" /> SmartAdmin
              </Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSticky" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarSticky">
                <Nav className="navbar-nav me-auto">
                  <NavItem className="active">
                    <NavLink>
                      Home
                      <span className="sr-only">(current)</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Features</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>Pricing</NavLink>
                  </NavItem>
                </Nav>
              </div>
            </nav>
            <br />
            <p className="lead">
              SmartAdmin is a <strong>powerful, feature-rich admin template</strong> designed for developers who want to build professional and
              scalable dashboards. Unlike traditional admin panels, SmartAdmin provides a <strong>fully responsive</strong>, modern design with a
              <strong>clean UI</strong>, making it a perfect choice for applications that require a smooth user experience.
            </p>
            <p>
              One of SmartAdmin’s biggest advantages is its <strong>jQuery-free</strong> structure in the latest versions, making it future-proof and
              optimized for <strong>modern JavaScript frameworks</strong> like React, Vue, and Angular. This means developers can integrate it easily
              with their preferred stack without dealing with legacy dependencies. Additionally, it comes packed with
              <strong>ready-to-use components</strong>, such as form elements, charts, widgets, and pre-built pages, reducing development time.
            </p>
            <p>
              Another key feature of SmartAdmin is its <strong>modular architecture</strong>, allowing developers to customize and extend
              functionalities effortlessly. Whether you're building a simple dashboard or a complex enterprise solution, SmartAdmin's
              <strong>scalable design</strong> ensures that you can add new components without affecting performance. The template also includes a
              <strong>dark mode</strong>, which improves accessibility and enhances the user experience in different environments.
            </p>
            <p>
              Security is another major concern in web development, and SmartAdmin is built with best practices in mind. With
              <strong>role-based access control (RBAC)</strong>, developers can define user permissions and restrict access to sensitive data. This is
              crucial for applications requiring different levels of authentication, such as
              <strong>admin panels, financial dashboards, and analytics tools</strong>.
            </p>
            <p>
              SmartAdmin is also well-documented and actively maintained, ensuring developers have access to updates, bug fixes, and new features. The
              template includes a <strong>detailed documentation guide</strong>, helping developers quickly integrate and customize it for their
              needs. Additionally, the SmartAdmin community is growing, offering support through
              <strong>forums, GitHub discussions, and dedicated customer service</strong>.
            </p>
            <p className="mb-4">
              Overall, SmartAdmin is an <strong>all-in-one solution</strong> for building modern, responsive, and scalable admin dashboards. With its
              <strong>clean design, lightweight architecture, and rich feature set</strong>, it’s an excellent choice for startups, enterprises, and
              developers looking for a robust UI framework. Whether you're working on a SaaS product, internal tool, or data-driven application,
              SmartAdmin provides everything you need to create a professional and efficient user interface.
            </p>
            <Link href="https://wrapbootstrap.com/theme/smartadmin-responsive-webapp-WB0573SK0" className="btn btn-primary btn-lg" target="_blank">
              Learn More About SmartAdmin
            </Link>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const NavbarIcons = () => {
  return <ComponentCard title={<h2>
          Navbar
          <span className="fw-300">
            <i>Icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Adding profile pictures and dropdowns to nav bars</div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <Link className="navbar-brand" href="">
              Navbar
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
              <Nav className="navbar-nav me-auto mt-3 mt-lg-0">
                <NavItem className="active">
                  <NavLink>
                    Home <span className="sr-only">(current)</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>Link</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink disabled>Disabled</NavLink>
                </NavItem>
              </Nav>
              <Link href="" className="width-3 height-2 d-inline-flex align-items-center justify-content-center position-relative h1 me-2 mb-0 fs-xxl">
                <i className="sa sa-bell" />
                <span className="badge badge-icon pos-top pos-right">99</span>
              </Link>
              <a href="" data-bs-toggle="dropdown" title="sunnya@getwebora.com" className="d-flex align-items-center justify-content-center ms-2">
                <Image src={admin} className="profile-image profile-image-md rounded-circle" alt="sunnya@getwebora.com" />
                <span className="ms-1 me-1 text-truncate text-truncate-header hidden-xs-down">Sunny A.</span>
                <i className="sa sa-chevron-down hidden-xs-down" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};