import cover1 from '@/assets/img/cardcovers/cover-1-lg.png';
import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardText, CardTitle, Col, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import BackgroundBorderCard, { CardColumns, CollapseExample } from './components/BackgroundBorderCard';
export const metadata = {
  title: 'Cards'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Cards'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Cards provide a flexible and extensible content container with multiple variants and options.'} />
        <div className="main-content">
          <div className="info-container">
            <div className="d-flex flex-start w-100">
              <div className="d-flex flex-fill">
                <div className="flex-fill">
                  <p className="mb-0">
                    Cards are built with as little markup and styles as possible, but still manage to deliver a ton of control and customization.
                    Built with flexbox, they offer easy alignment and mix well with other Bootstrap components. They have no <code>margin</code> by
                    default, so use spacing utilities as needed. Although cards are a lightweight solution for 'widget' or 'panel', we recommend you
                    check out SmartAdmin's
                    <Link href="/" title="Components Panels" target="_blank">
                      panels page
                    </Link>
                    for further flexible and an alternative option.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Row>
            <Col xl={6}>
              <KitchenSinkExample />
              <ListGroup />
              <Quote />
              <HeaderAndFooter />
              <BackgroundBorderCard />
            </Col>
            <Col xl={6}>
              <CollapseExample />
              <NavigationTabs />
              <NavigationPills />
              <HeaderOptions />
              <CardGroup />
              <CardDecks />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <CardColumns />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const KitchenSinkExample = () => {
  return <ComponentCard title={<h2>
          Kitchen
          <span className="fw-300">
            <i>sink example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">The most basic example of cards with enforced width</div>
          <Card className="m-auto m-lg-0" style={{
          maxWidth: '18rem'
        }}>
            <Image src={cover1} className="card-img-top" alt="..." />
            <CardBody>
              <CardTitle as={'h5'}>Card title</CardTitle>
              <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
              <Link href="" className="btn btn-primary">
                Go somewhere
              </Link>
            </CardBody>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Cras justo odio</li>
              <li className="list-group-item">Dapibus ac facilisis in</li>
              <li className="list-group-item">Vestibulum at eros</li>
            </ul>
            <CardBody>
              <CardLink href="">Card link</CardLink>
              <CardLink href="">Another link</CardLink>
            </CardBody>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};
const ListGroup = () => {
  return <ComponentCard title={<h2>
          List
          <span className="fw-300">
            <i>group</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Create lists of content in a card with a flush list group.</div>
          <Card className="m-auto m-lg-0" style={{
          width: '18rem'
        }}>
            <CardHeader>Featured</CardHeader>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Cras justo odio</li>
              <li className="list-group-item">Dapibus ac facilisis in</li>
              <li className="list-group-item">Vestibulum at eros</li>
            </ul>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};
const Quote = () => {
  return <ComponentCard title={<h2>
          Quote
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Here we adjust <code>card-header</code> padding using provided
            <Link href="" title="utility classes">
              utility classes
            </Link>
          </div>
          <Card className="m-auto border">
            <CardHeader className="py-2">
              <CardTitle>Quote</CardTitle>
            </CardHeader>
            <CardBody>
              <blockquote className="blockquote mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer className="blockquote-footer">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>
            </CardBody>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};
const HeaderAndFooter = () => {
  return <ComponentCard title={<h2>
          Header
          <span className="fw-300">
            <i>and footer</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Add an optional header and/or footer within a card.</div>
          <Card className="m-auto border">
            <CardHeader>Featured</CardHeader>
            <CardBody>
              <CardTitle as={'h5'}>Special title treatment</CardTitle>
              <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
              <Link href="" className="btn btn-primary">
                Go somewhere
              </Link>
            </CardBody>
            <CardFooter className="text-muted py-2">2 days ago</CardFooter>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};
const NavigationTabs = () => {
  return <ComponentCard title={<h2>
          Navigation
          <span className="fw-300">
            <i>tabs</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Add some navigation to a card's header (or block) with built-in nav components.</div>
          <Card className="border">
            <CardHeader>
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    Active
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">
                    Disabled
                  </a>
                </li>
              </ul>
            </CardHeader>
            <CardBody>
              <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            </CardBody>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};
const NavigationPills = () => {
  return <ComponentCard title={<h2>
          Navigation
          <span className="fw-300">
            <i>pills</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Add some navigation to a card's header (or block) with built-in nav components.</div>
          <Card className="border">
            <CardHeader>
              <ul className="nav nav-pills card-header-pills">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    Active
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">
                    Disabled
                  </a>
                </li>
              </ul>
            </CardHeader>
            <CardBody>
              <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            </CardBody>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};
const HeaderOptions = () => {
  return <ComponentCard title={<h2>
          Header
          <span className="fw-300">
            <i>Options</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Display of some example optional "stuff" you can add to <code>.card-header</code>
          </div>
          <Row>
            <Col xl={6}>
              <Card className="mb-4">
                <CardHeader className="bg-fusion-500 d-flex align-items-center justify-content-between">
                  <CardTitle>Dropdowns</CardTitle>
                  <Dropdown>
                    <DropdownToggle as={'button'} className="btn btn-icon btn-danger btn-sm waves-effect content-none">
                      <i className="fal fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <DropdownItem>Option 1</DropdownItem>
                      <DropdownItem>Option 2</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Refresh</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardHeader>
                <CardBody>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
              </Card>
              <Card className="mb-4">
                <CardHeader className="d-flex align-items-center justify-content-between bg-trans-gradient py-2 pe-2">
                  <CardTitle className="text-white">Input</CardTitle>
                  <div className="d-flex position-relative" style={{
                  maxWidth: '10rem'
                }}>
                    <i className="fal fa-search position-absolute" style={{
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }} />
                    <input type="text" className="form-control bg-white" style={{
                    paddingLeft: '2rem'
                  }} placeholder="Search" />
                  </div>
                </CardHeader>
                <CardBody>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="mb-4">
                <CardHeader className="d-flex align-items-center justify-content-between bg-warning py-2 pe-2">
                  <CardTitle className="text-white">Buttons</CardTitle>
                  <div>
                    <Button variant="info" size="sm" className="waves-effect">
                      Add new
                    </Button>&nbsp;
                    <Button variant="success" size="sm" className="waves-effect">
                      <i className="fal fa-arrow-down" />
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
              </Card>
              <Card>
                <CardHeader className="d-flex align-items-center justify-content-between bg-success">
                  <CardTitle className="text-white">Checkbox</CardTitle>
                  <div className="form-check form-switch form-check-reverse">
                    <input id="demo-switch" type="checkbox" className="form-check-input" defaultChecked />
                    <label className="form-check-label" htmlFor="demo-switch" />
                  </div>
                </CardHeader>
                <CardBody>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};
const CardGroup = () => {
  return <ComponentCard title={<h2>
          Card
          <span className="fw-300">
            <i>Group</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Use card groups to render cards as a single, attached element with equal width and height columns. Card groups use{' '}
            <code>display: flex;</code> to achieve their uniform sizing.
          </div>
          <div className="card-group">
            <Card>
              <div className="w-100 bg-fusion-50 rounded-top border-top-right-radius-0" style={{
              padding: '40px 0 40px'
            }} />
              <CardBody>
                <CardTitle as={'h5'}>Card title</CardTitle>
                <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
                <small className="text-muted">Last updated 3 mins ago</small>
              </CardBody>
            </Card>
            <Card>
              <div className="w-100 bg-fusion-50" style={{
              padding: '40px 0 40px'
            }} />
              <CardBody>
                <CardTitle as={'h5'}>Card title</CardTitle>
                <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
                <small className="text-muted">Last updated 3 mins ago</small>
              </CardBody>
            </Card>
            <Card>
              <div className="w-100 bg-fusion-50 rounded-top border-top-left-radius-0 " style={{
              padding: '40px 0 40px'
            }} />
              <CardBody>
                <CardTitle as={'h5'}>Card title</CardTitle>
                <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
                <small className="text-muted">Last updated 3 mins ago</small>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const CardDecks = () => {
  return <ComponentCard title={<h2>
          Card
          <span className="fw-300">
            <i>Decks</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Need a set of equal width and height cards that aren't attached to one another? Use card decks.</div>
          <Row className="row-cols-1 row-cols-md-3 g-4">
            <Col>
              <Card className="h-100">
                <div className="w-100 bg-fusion-50 rounded-top" style={{
                padding: '40px 0 40px'
              }} />
                <CardBody>
                  <CardTitle as={'h5'}>Card title</CardTitle>
                  <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
                <CardFooter>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </CardFooter>
              </Card>
            </Col>
            <Col>
              <Card className="h-100">
                <div className="w-100 bg-fusion-50 rounded-top" style={{
                padding: '40px 0 40px'
              }} />
                <CardBody>
                  <CardTitle as={'h5'}>Card title</CardTitle>
                  <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
                <CardFooter>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </CardFooter>
              </Card>
            </Col>
            <Col>
              <Card className="h-100">
                <div className="w-100 bg-fusion-50 rounded-top" style={{
                padding: '40px 0 40px'
              }} />
                <CardBody>
                  <CardTitle as={'h5'}>Card title</CardTitle>
                  <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
                <CardFooter>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};