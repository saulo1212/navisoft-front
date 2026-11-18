import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { basePath } from '@/helpers';
import Link from 'next/link';
import { Col, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Breadcrumbs'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Breadcrumbs'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Breadcrumbs are a way to navigate through a website.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Breadcrumbs are a way to navigate through a website. They are a series of links that are used to navigate through a website. They are a
              series of links that are used to navigate through a website. They are a series of links that are used to navigate through a website.
            </p>
            <p className="mb-0">
              Learn more about this component on bootstrap's{' '}
              <Link href="https://getbootstrap.com/docs/5.3/components/breadcrumb/" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <Default />
              <DifferentSizes />
              <DifferentSeparators />
              <WithDropdown />
              <WithIcons />
            </Col>
            <Col xl={6}>
              <BackgroundsOutlines />
              <CleanStyle />
              <OtherStyles />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const Default = () => {
  return <ComponentCard title={<h2>
          Default
          <span className="fw-300">
            <i>Breadcrumb</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo-v-spacing">
            <ol className="breadcrumb bg-faded px-3 py-2 rounded">
              <li className="breadcrumb-item active">Home</li>
            </ol>
            <ol className="breadcrumb bg-faded px-3 py-2 rounded">
              <li className="breadcrumb-item">
                <Link href="">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
            <ol className="breadcrumb bg-faded px-3 py-2 rounded">
              <li className="breadcrumb-item">
                <Link href="">This is a big text</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Hovering reveals the text</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Can be big as you like</Link>
              </li>
              <li className="breadcrumb-item active">Cool right?</li>
            </ol>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const DifferentSizes = () => {
  return <ComponentCard title={<h2>
          Different
          <span className="fw-300">
            <i>Sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo-v-spacing">
            <ol className="breadcrumb bg-faded px-3 py-2 rounded fs-xs">
              <li className="breadcrumb-item">
                <Link href="">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
            <ol className="breadcrumb bg-faded px-3 py-2 rounded fs-sm">
              <li className="breadcrumb-item">
                <Link href="">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
            <ol className="breadcrumb bg-faded px-3 py-2 rounded fs-lg">
              <li className="breadcrumb-item">
                <Link href="">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const DifferentSeparators = () => {
  return <ComponentCard title={<h2>
          Different
          <span className="fw-300">
            <i>Separators</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo-v-spacing">
            <ol className="breadcrumb">
              <li className="breadcrumb-item text-muted" data-breadcrumb-seperator="•">
                <Link href="">Home</Link>
              </li>
              <li className="breadcrumb-item text-muted" data-breadcrumb-seperator="•">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item text-muted" data-breadcrumb-seperator="•">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active text-muted" data-breadcrumb-seperator="•">
                Seperators using data attributes
              </li>
            </ol>
            <ol className="breadcrumb">
              <li className="breadcrumb-item text-dark" data-breadcrumb-seperator=">">
                <Link href="" className="text-primary">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item text-dark" data-breadcrumb-seperator=">">
                <Link href="" className="text-primary">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-dark" data-breadcrumb-seperator=">">
                <Link href="" className="text-primary">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-dark" data-breadcrumb-seperator=">">
                Data
              </li>
            </ol>
            <ol className="breadcrumb breadcrumb-seperator-3 mb-0">
              <li className="breadcrumb-item" data-breadcrumb-seperator="⇨">
                <Link href="" className="text-info">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item" data-breadcrumb-seperator="⇨">
                <Link href="" className="text-info">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item" data-breadcrumb-seperator="⇨">
                <Link href="" className="text-info">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active" data-breadcrumb-seperator="⇨">
                Data
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const WithDropdown = () => {
  return <ComponentCard title={<h2>
          With
          <span className="fw-300">
            <i>Dropdown</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <Dropdown as="span">
                <DropdownToggle as="a" className="text-decoration-none">
                  Home <i className="sa sa-chevron-down" />
                </DropdownToggle>

                <DropdownMenu x-placement="bottom-start" style={{
                position: 'absolute',
                willChange: 'top, left',
                top: 114,
                left: 40
              }}>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>

            <li className="breadcrumb-item">
              <Dropdown as="span">
                <DropdownToggle as="a" className="text-decoration-none">
                  Library <i className="sa sa-chevron-down" />
                </DropdownToggle>

                <DropdownMenu x-placement="bottom-start" style={{
                position: 'absolute',
                willChange: 'top, left',
                top: 114,
                left: 40
              }}>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>

            <li className="breadcrumb-item">
              <a href="#">Web</a>
            </li>
            <li className="breadcrumb-item active">Data</li>
          </ol>
        </div>
      </div>
    </ComponentCard>;
};
const WithIcons = () => {
  return <ComponentCard title={<h2>
          With
          <span className="fw-300">
            <i>Icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <Link href="">
                <i className="sa sa-grid me-1 fs-md" />
                Application
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="">
                <i className="sa sa-book-open me-1 fs-md" />
                Library
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="">
                <i className="sa sa-globe me-1 fs-md" />
                Web
              </Link>
            </li>
            <li className="breadcrumb-item active">
              <i className="sa sa-lock me-1 fs-md" />
              Passwords
            </li>
          </ol>
        </div>
      </div>
    </ComponentCard>;
};
const BackgroundsOutlines = () => {
  return <ComponentCard title={<h2>
          Backgrounds
          <span className="fw-300">
            <i>Outlines</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo-v-spacing">
            <ol className="breadcrumb bg-fusion-300 px-3 py-2 rounded">
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">Data</li>
            </ol>
            <ol className="breadcrumb bg-primary-300 px-3 py-2 rounded">
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">Data</li>
            </ol>
            <ol className="breadcrumb bg-info-400 px-3 py-2 rounded">
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">Data</li>
            </ol>
            <ol className="breadcrumb bg-danger-300 px-3 py-2 rounded">
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-white">
                <Link href="" className="text-white">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">Data</li>
            </ol>
            <ol className="breadcrumb bg-transparent border border-primary px-3 py-2 rounded">
              <li className="breadcrumb-item text-primary">
                <Link href="">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-primary">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item text-primary">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active text-primary">Data</li>
            </ol>
            <ol className="breadcrumb bg-transparent border border-success px-3 py-2 rounded">
              <li className="breadcrumb-item text-success">
                <Link href="" className="text-success">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-success">
                <Link href="" className="text-success">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-success">
                <Link href="" className="text-success">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-success">Data</li>
            </ol>
            <ol className="breadcrumb bg-transparent border border-info px-3 py-2 rounded">
              <li className="breadcrumb-item text-info">
                <Link href="" className="text-info">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-info">
                <Link href="" className="text-info">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-info">
                <Link href="" className="text-info">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-info">Data</li>
            </ol>
            <ol className="breadcrumb bg-transparent border border-danger px-3 py-2 rounded mb-0">
              <li className="breadcrumb-item text-danger">
                <Link href="" className="text-danger">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item text-danger">
                <Link href="" className="text-danger">
                  Library
                </Link>
              </li>
              <li className="breadcrumb-item text-danger">
                <Link href="" className="text-danger">
                  Web
                </Link>
              </li>
              <li className="breadcrumb-item active text-danger">Data</li>
            </ol>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const CleanStyle = () => {
  return <ComponentCard title={<h2>
          Clean
          <span className="fw-300">
            <i>Style</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo-v-spacing">
            <ol className="breadcrumb bg-transparent breadcrumb-sm pl-0 pr-0 fs-xs">
              <li className="breadcrumb-item">
                <Link href="">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
            <ol className="breadcrumb bg-transparent pl-0 pr-0">
              <li className="breadcrumb-item">
                <Link href="">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
            <ol className="breadcrumb bg-transparent breadcrumb-lg pl-0 pr-0 m-0 fs-xl">
              <li className="breadcrumb-item">
                <Link href="">
                  <i className="sa sa-home me-1" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Library</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="">Web</Link>
              </li>
              <li className="breadcrumb-item active">Data</li>
            </ol>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const OtherStyles = () => {
  return <ComponentCard title={<h2>
          Other
          <span className="fw-300">
            <i>Styles</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="demo-v-spacing">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" data-breadcrumb-seperator="→">
                <Link href="">
                  <span className="badge bg-primary">Application</span>
                </Link>
              </li>
              <li className="breadcrumb-item" data-breadcrumb-seperator="→">
                <Link href="">
                  <span className="badge bg-primary">Projects</span>
                </Link>
              </li>
              <li className="breadcrumb-item" data-breadcrumb-seperator="→">
                <Link href="">
                  <span className="badge bg-primary">Library</span>
                </Link>
              </li>
              <li className="breadcrumb-item active" data-breadcrumb-seperator="→">
                <Link href="">
                  <span className="badge bg-primary">DATA</span>
                </Link>
              </li>
            </ol>
            <ol className="breadcrumb">
              <li className="breadcrumb-item" data-breadcrumb-seperator="›">
                <a href="" className="btn btn-icon btn-sm btn-outline-default rounded-circle overflow-hidden">
                  <svg className="sa-icon sa-icon-dark sa-bold">
                    <use href={`${basePath}/icons/sprite.svg#eye`} />
                  </svg>
                </a>
              </li>
              <li className="breadcrumb-item" data-breadcrumb-seperator="›">
                <a href="" className="btn btn-icon btn-sm btn-outline-default rounded-circle overflow-hidden">
                  <svg className="sa-icon sa-icon-dark sa-bold">
                    <use href={`${basePath}/icons/sprite.svg#heart`} />
                  </svg>
                </a>
              </li>
              <li className="breadcrumb-item" data-breadcrumb-seperator="›">
                <a href="" className="btn btn-icon btn-sm btn-outline-default rounded-circle overflow-hidden">
                  <svg className="sa-icon sa-icon-dark sa-bold">
                    <use href={`${basePath}/icons/sprite.svg#layers`} />
                  </svg>
                </a>
              </li>
              <li className="breadcrumb-item active" data-breadcrumb-seperator="›">
                <a href="" className="btn btn-icon btn-sm btn-outline-default rounded-circle overflow-hidden">
                  <svg className="sa-icon sa-icon-dark sa-bold">
                    <use href={`${basePath}/icons/sprite.svg#edit`} />
                  </svg>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ComponentCard>;
};