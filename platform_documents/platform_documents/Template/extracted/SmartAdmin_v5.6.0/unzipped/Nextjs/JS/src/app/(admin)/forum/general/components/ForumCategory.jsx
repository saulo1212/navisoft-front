'use client';

import Link from 'next/link';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
const threads = [{
  id: 'sec_1',
  title: 'Account information & Security',
  description: 'Fusce at velit viverra, luctus augue nec, dapibus urna',
  link: '/forum/threads',
  isSticky: true,
  topicsCount: 243,
  postsCount: 407,
  lastPost: {
    text: 'Duis vitae sapien urna. Proin pellentesque laoreet ligula pharetra semper.',
    time: 'Today, 12:12',
    author: 'katty60',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-2', 'stack-3x', 'alpha-7', 'text-primary'], ['sa', 'sa-base-10', 'text-light', 'stack-2x'], ['sa', 'sa-profile', 'stack-2x', 'text-primary']]
}, {
  id: 'sec_2',
  title: 'Global Stats',
  description: 'Sed felis eros, facilisis eu cursus at, efficitur et felis',
  link: '/forum/threads',
  topicsCount: 64,
  postsCount: 102,
  lastPost: {
    text: 'Nunc id varius nisl, a feugiat eros',
    time: 'Today, 05:01',
    author: 'gsnoopy520',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-7', 'stack-3x', 'text-primary', 'alpha-7'], ['sa', 'sa-base-7', 'text-primary', 'stack-1x'], ['sa', 'sa-graph', 'text-light', 'stack-1x']]
}, {
  id: 'sec_3',
  title: 'Global Announcements',
  description: 'Curabitur scelerisque ipsum nec dui lacinia bibendum',
  link: '/forum/threads',
  topicsCount: 124,
  postsCount: 314,
  lastPost: {
    text: 'Integer id eros vitae leo semper sodales vel a est.',
    time: 'Today, 02:25',
    author: 'lerem03',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-19', 'stack-3x', 'text-primary', 'alpha-7'], ['sa', 'sa-base-7', 'stack-2x', 'text-dark', 'alpha-2'], ['sa', 'sa-base-7', 'stack-1x', 'text-primary'], ['sa', 'sa-globe', 'stack-1x', 'text-light']]
}];
const policyThreads = [{
  id: 'p_thread_1',
  title: 'Clients & Staff',
  description: 'Fusce at velit viverra, luctus augue nec, dapibus urna',
  threadUrl: '/forum/threads',
  topicsCount: 72,
  postsCount: 89,
  lastPost: {
    text: 'Nam at justo magna. Aenean facilisis ultricies turpis',
    time: 'Today, 08:13',
    author: 'erakalambert',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-2', 'stack-3x', 'text-primary'], ['sa', 'sa-base-3', 'stack-1x', 'text-light', 'alpha-2'], ['fal', 'fa-user-md', 'stack-1x', 'text-light']]
}, {
  id: 'p_thread_2',
  title: 'Software & Hardware Equipments',
  description: 'Nulla laoreet dignissim justo, id viverra nibh suscipit in.',
  threadUrl: '/forum/threads',
  topicsCount: 99,
  postsCount: 72,
  lastPost: {
    text: 'Integer felis justo, condimentum vitae pharetra vel, hendrerit eget orci.',
    time: 'Today, 06:01',
    author: 'elisamury',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-7', 'stack-3x', 'text-success'], ['sa', 'sa-base-4', 'alpha-1', 'stack-2x', 'text-light'], ['fal', 'fa-briefcase-medical', 'text-light', 'stack-1x']]
}, {
  id: 'p_thread_3',
  title: 'Billing Department',
  description: 'Curabitur scelerisque ipsum nec dui lacinia bibendum',
  threadUrl: '/forum/threads',
  topicsCount: 88,
  postsCount: 109,
  lastPost: {
    text: 'Duis placerat in sapien et placerat. Duis quis feugiat leo. Curabitur laoreet ex nec odio interdum',
    time: 'Today, 12:25',
    author: 'josekras_alma',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-15', 'stack-3x', 'text-success'], ['sa', 'sa-base-10', 'stack-2x', 'alpha-2', 'text-dark'], ['fal', 'fa-dollar-sign', 'stack-1x', 'text-light']]
}, {
  id: 'p_thread_4',
  title: 'Miscellaneous, Lost & Found',
  description: 'Phasellus pharetra felis et leo malesuada',
  threadUrl: '/forum/threads',
  topicsCount: 50,
  postsCount: 66,
  lastPost: {
    text: 'Nunc id varius nisl, a feugiat eros. Nulla laoreet dignissim justo, id viverra nibh suscipit in. Curabitur scelerisque ipsum nec dui lacinia bibendum',
    time: 'Today, 05:25',
    author: 'kraluakosh',
    authorLink: ''
  },
  iconLayers: [['sa', 'sa-base-3', 'stack-3x', 'text-warning'], ['sa', 'sa-base-3', 'stack-2x', 'text-light', 'alpha-3'], ['fal', 'fa-question', 'stack-1x', 'text-dark']]
}];
const protectedThreads = [{
  id: 'pt_1',
  title: 'Design Interns (UI/UX, Visual, Interaction)',
  description: 'Proin pellentesque laoreet ligula pharetra semper',
  link: '/forum/threads',
  accessType: 'Has Access',
  topicsCount: 1024,
  postsCount: 5431,
  lastPost: {
    text: 'Nam at justo magna. Aenean facilisis ultricies turpis',
    time: 'Today, 12:13',
    author: 'c_lantern',
    authorLink: ''
  }
}, {
  id: 'pt_2',
  title: 'Frontend Developers (React, Vue, Angular)',
  description: 'Nulla laoreet dignissim justo, id viverra nibh suscipit in.',
  link: '/forum/threads',
  accessType: 'Has Access',
  topicsCount: 1205,
  postsCount: 4314,
  lastPost: {
    text: 'Morbi id enim a ex gravida dignissim nec eu massa',
    time: 'Today, 06:01',
    author: 'jamie',
    authorLink: ''
  }
}, {
  id: 'pt_3',
  title: 'Backend Developers (Node.js, Python, Ruby)',
  description: 'Curabitur scelerisque ipsum nec dui lacinia bibendum',
  link: '/forum/threads',
  accessType: 'Password',
  topicsCount: 764,
  postsCount: 534,
  lastPost: {
    text: 'Duis placerat in sapien et placerat. Duis quis feugiat leo. Curabitur laoreet ex nec odio interdum',
    time: 'Today, 12:25',
    author: 'josekras_alma',
    authorLink: ''
  }
}, {
  id: 'pt_4',
  title: 'UX Researchers',
  description: 'Duis placerat in sapien et placerat',
  link: '/forum/threads',
  accessType: 'Password',
  topicsCount: 87,
  postsCount: 674,
  lastPost: {
    text: 'Praesent mollis congue bibendum. Etiam ipsum augue, sodales id metus a, molestie hendrerit felis.',
    time: 'Today, 05:25',
    author: 'lambert',
    authorLink: ''
  }
}, {
  id: 'pt_5',
  title: 'Product Designers',
  description: 'Duis placerat in sapien et placerat',
  link: '/forum/threads',
  accessType: 'Has Access',
  topicsCount: 731,
  postsCount: 1246,
  lastPost: {
    text: 'Proin non felis lobortis, porta arcu a, iaculis arcu. Morbi tincidunt non ante et fermentum',
    time: 'Today, 05:25',
    author: 'elmo',
    authorLink: ''
  }
}, {
  id: 'pt_6',
  title: 'DevOps & QA Engineers',
  description: 'Sit amet luctus nulla suscipit. Phasellus pharetra felis',
  link: '/forum/threads',
  accessType: 'Has Access',
  topicsCount: 3943,
  postsCount: 9843,
  lastPost: {
    text: 'Sed felis eros, facilisis eu cursus at, efficitur et felis',
    time: 'Today, 05:25',
    author: 'katty60',
    authorLink: ''
  }
}];
const General = () => {
  return <Card className="mb-g border shadow-0">
      <CardHeader>
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <span className="h6 fw-bold text-uppercase">General</span>
          </div>
          <div className="d-flex align-items-center">
            <Link href="" className="btn btn-outline-success btn-sm ms-auto me-2 flex-shrink-0 waves-effect waves-themed">
              Add
            </Link>
            <Link href="" className="btn btn-outline-danger btn-sm flex-shrink-0 waves-effect waves-themed">
              Edit
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardHeader className="p-0">
        <Row className="g-0 row-grid align-items-stretch">
          <Col xs={12} md>
            <div className="text-uppercase text-muted py-2 px-3">Title</div>
          </Col>
          <Col xs={12} md={2} xl={1} className="d-none d-md-block">
            <div className="text-uppercase text-muted py-2 px-3">Status</div>
          </Col>
          <Col sm={6} md={3} className="d-none d-md-block">
            <div className="text-uppercase text-muted py-2 px-3">Last posts</div>
          </Col>
        </Row>
      </CardHeader>

      <CardBody className="p-0">
        <Row className="g-0 row-grid">
          {threads.map(thread => <Col xs={12} key={thread.id}>
              <Row className="g-0 row-grid align-items-stretch">
                <Col md>
                  <div className="p-3">
                    <div className="d-flex">
                      <span className="d-flex me-3 flex-shrink-0" style={{
                    fontSize: '2.1rem'
                  }}>
                        <div className="stack-icon">
                          {thread.iconLayers.map((layerClasses, index) => <div key={index} className="icon-layers">
                              <i className={layerClasses.join(' ')} />
                            </div>)}
                        </div>
                      </span>
                      <div className="d-inline-flex flex-column">
                        <Link href={thread.link} className="fs-lg fw-500 d-block text-decoration-none">
                          {thread.title}
                          {thread.isSticky && <Badge bg="warning" className="rounded ms-1">
                              Sticky
                            </Badge>}
                        </Link>
                        <div className="d-block text-muted fs-sm">{thread.description}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      {thread.topicsCount} <i>Topics</i>
                    </span>
                    <span className="d-block text-muted">
                      {thread.postsCount} <i>Posts</i>
                    </span>
                  </div>
                </Col>

                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 min-width-0 fs-sm">
                        <Link href="#" className="d-block text-truncate text-decoration-none">
                          {thread.lastPost.text}
                        </Link>
                        <div className="text-muted small text-truncate">
                          {thread.lastPost.time}
                          <Link href={thread.lastPost.authorLink} className="text-decoration-none">
                            {thread.lastPost.author}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>)}
        </Row>
      </CardBody>
    </Card>;
};
const Policy = () => {
  return <Card className="mb-g border shadow-0">
      <CardHeader>
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <span className="h6 fw-bold text-uppercase">Policy</span>
          </div>
          <div className="d-flex align-items-center">
            <Link href="#" className="btn btn-outline-success btn-sm ms-auto me-2 flex-shrink-0 waves-effect waves-themed">
              Add
            </Link>
            <Link href="#" className="btn btn-outline-danger btn-sm flex-shrink-0 waves-effect waves-themed">
              Edit
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardHeader className="p-0">
        <Row className="g-0 row-grid align-items-stretch">
          <Col xs={12} md>
            <div className="text-uppercase text-muted py-2 px-3">Title</div>
          </Col>
          <Col sm={6} md={2} xl={1} className="d-none d-md-block">
            <div className="text-uppercase text-muted py-2 px-3">Status</div>
          </Col>
          <Col sm={6} md={3} className="d-none d-md-block">
            <div className="text-uppercase text-muted py-2 px-3">Last posts</div>
          </Col>
        </Row>
      </CardHeader>

      <CardBody className="p-0">
        <Row className="g-0 row-grid">
          {policyThreads.map(thread => <Col xs={12} key={thread.id}>
              <Row className="g-0 row-grid align-items-stretch">
                <Col md>
                  <div className="p-3">
                    <div className="d-flex">
                      <span className="d-flex me-3 flex-shrink-0" style={{
                    fontSize: '2.1rem'
                  }}>
                        <div className="stack-icon">
                          {thread.iconLayers.map((layerClasses, index) => <div key={index} className="icon-layers">
                              <i className={layerClasses.join(' ')} />
                            </div>)}
                        </div>
                      </span>
                      <div className="d-inline-flex flex-column">
                        <Link href={thread.threadUrl} className="fs-lg fw-500 d-block text-decoration-none">
                          {thread.title}
                          {thread.isSticky && <Badge bg="warning" className="rounded ms-1">
                              Sticky
                            </Badge>}
                        </Link>
                        <div className="d-block text-muted fs-sm">{thread.description}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      {thread.topicsCount} <i>Topics</i>
                    </span>
                    <span className="d-block text-muted">
                      {thread.postsCount} <i>Posts</i>
                    </span>
                  </div>
                </Col>

                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="#" className="d-block text-truncate text-decoration-none">
                          {thread.lastPost.text}
                        </Link>
                        <div className="text-muted small text-truncate">
                          {thread.lastPost.time}
                          <Link href={thread.lastPost.authorLink} className="text-decoration-none">
                            {thread.lastPost.author}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>)}
        </Row>
      </CardBody>
    </Card>;
};
const PasswordProtectedThreads = () => {
  return <Card className="mb-g border shadow-0">
      <CardHeader>
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <span className="h6 fw-bold text-uppercase">Password Protected Threads</span>
          </div>
          <div className="d-flex align-items-center">
            <Button variant="outline-success" size="sm" className="ms-auto me-2 flex-shrink-0 waves-effect">
              Add
            </Button>
            <Button variant="outline-danger" size="sm" className="flex-shrink-0 waves-effect">
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardHeader className="p-0">
        <Row className="g-0 row-grid align-items-stretch">
          <Col xs={12} md>
            <div className="text-uppercase text-muted py-2 px-3">Title</div>
          </Col>
          <Col sm={6} md={2} xl={1} className="d-none d-md-block">
            <div className="text-uppercase text-muted py-2 px-3">Status</div>
          </Col>
          <Col sm={6} md={3} className="d-none d-md-block">
            <div className="text-uppercase text-muted py-2 px-3">Last posts</div>
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="p-0">
        <Row className="g-0 row-grid">
          {protectedThreads.map(thread => <Col xs={12} key={thread.id}>
              <Row className="g-0 row-grid align-items-stretch">
                <Col md>
                  <div className="p-3">
                    <div className="d-flex">
                      <div className="d-inline-flex flex-column">
                        <Link href={thread.link} className="fs-lg fw-500 d-block text-decoration-none">
                          {thread.title}
                          <Badge bg={thread.accessType === 'Has Access' ? 'success' : 'danger'} className="ms-1">
                            {thread.accessType}
                          </Badge>
                        </Link>
                        <div className="d-block text-muted fs-sm">{thread.description}</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      {thread.topicsCount} <i>Topics</i>
                    </span>
                    <span className="d-block text-muted">
                      {thread.postsCount} <i>Posts</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="#" className={`d-block text-truncate text-decoration-none ${thread.accessType === 'Password' ? 'text-blur' : ''}`}>
                          {thread.lastPost.text}
                        </Link>
                        <div className="text-muted small text-truncate">
                          {thread.lastPost.time}
                          <Link href={thread.lastPost.authorLink} className="text-decoration-none">
                            {thread.lastPost.author}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>)}
        </Row>
      </CardBody>
    </Card>;
};
const ForumCategory = () => {
  return <>
      <div className="input-group input-group-lg mb-g">
        <input type="text" className="form-control shadow-inset-2" placeholder="Search topics" />
        <Button variant="outline-default" className="waves-effect" type="button">
          <i className="fal fa-search" />
        </Button>
      </div>
      <General />
      <Policy />
      <PasswordProtectedThreads />
    </>;
};
export default ForumCategory;