'use client';

import ComponentCard from '@/components/ComponentCard';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Col, Collapse, FormLabel, FormSelect, Row } from 'react-bootstrap';
const ng_bgColors = ['bg-danger-50', 'bg-danger-100', 'bg-danger-200', 'bg-danger-300', 'bg-danger-400', 'bg-danger-500', 'bg-danger-600', 'bg-danger-700', 'bg-danger-800', 'bg-danger-900', 'bg-fusion-50', 'bg-fusion-100', 'bg-fusion-200', 'bg-fusion-300', 'bg-fusion-400', 'bg-fusion-500', 'bg-fusion-600', 'bg-fusion-700', 'bg-fusion-800', 'bg-fusion-900', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900', 'bg-info-50', 'bg-info-100', 'bg-info-200', 'bg-info-300', 'bg-info-400', 'bg-info-500', 'bg-info-600', 'bg-info-700', 'bg-info-800', 'bg-info-900', 'bg-primary-50', 'bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500', 'bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900', 'bg-success-50', 'bg-success-100', 'bg-success-200', 'bg-success-300', 'bg-success-400', 'bg-success-500', 'bg-success-600', 'bg-success-700', 'bg-success-800', 'bg-success-900', 'bg-warning-50', 'bg-warning-100', 'bg-warning-200', 'bg-warning-300', 'bg-warning-400', 'bg-warning-500', 'bg-warning-600', 'bg-warning-700', 'bg-warning-800', 'bg-warning-900'];
const BackgroundBorderCard = () => {
  const [target, setTarget] = useState('header');
  const [headerBg, setHeaderBg] = useState('bg-info-600');
  const [bodyBg, setBodyBg] = useState('bg-info-300');
  const [footerBg, setFooterBg] = useState('bg-info-800');
  const [borderColor, setBorderColor] = useState('border-primary');
  const handleBgChange = color => {
    if (!color) return;
    if (target === 'header') setHeaderBg(color);
    if (target === 'body') setBodyBg(color);
    if (target === 'footer') setFooterBg(color);
  };
  const getCurrentTargetColor = () => {
    if (target === 'header') return headerBg;
    if (target === 'body') return bodyBg;
    return footerBg;
  };
  return <>
      <ComponentCard title={<h2>
            Background &
            <span className="fw-300">
              <i>Borders</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              <code>.card-header</code>, <code>.card-body</code>, and <code>.card-footer</code> background cam be changed using&nbsp;
              <Link href="/utilities/colorpalette" target="_blank" title="BG Color Utility">
                color
              </Link>
              &nbsp;and&nbsp;
              <Link href="/utilities/borders" target="_blank" title="border utilities">
                border
              </Link>
              <br />
              utilities
            </div>

            <div className="mb-4">
              <Row>
                <Col sm={6} xl={4}>
                  <div className="mb-3">
                    <FormLabel>Select target</FormLabel>
                    <FormSelect value={target} onChange={e => setTarget(e.target.value)}>
                      <option value="header">card-header</option>
                      <option value="body">card-body</option>
                      <option value="footer">card-footer</option>
                    </FormSelect>
                  </div>
                </Col>

                <Col sm={6} xl={4}>
                  <div className="mb-3">
                    <FormLabel>Select background</FormLabel>
                    <FormSelect className={getCurrentTargetColor()} value={getCurrentTargetColor()} onChange={e => handleBgChange(e.target.value)}>
                      <option value="">select background</option>
                      {ng_bgColors.map(color => <option key={color} value={color} className={color}>
                          {color}
                        </option>)}
                    </FormSelect>
                  </div>
                </Col>

                <Col sm={12} xl={4}>
                  <div className="mb-3">
                    <FormLabel>Card border</FormLabel>
                    <FormSelect value={borderColor} onChange={e => setBorderColor(e.target.value)}>
                      <option value="border-primary">border-primary</option>
                      <option value="border-secondary">border-secondary</option>
                      <option value="border-info">border-info</option>
                      <option value="border-danger">border-danger</option>
                      <option value="border-warning">border-warning</option>
                      <option value="border-success">border-success</option>
                    </FormSelect>
                  </div>
                </Col>
              </Row>
            </div>

            <Card id="cp-2" className={`border ${borderColor}`}>
              <CardHeader className={headerBg}>Different colors</CardHeader>
              <CardBody className={`p-0 ${bodyBg}`}>
                <div style={{
                height: 160,
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                  <div className="px-4 py-3">
                    <div className="fs-xl fw-500 mb-3">
                      He system office. Of to wonder, windshield to seven. Whenever
                      <div className="fs-nano fw-300">SATURDAY, 27TH JANUARY 2018 15 minutes ago.</div>
                    </div>
                    <div className="fs-lg mb-3">
                      Of totally to issues for to the decelerate city, the at how discharge than like…. It history; Their letters, away, the and
                      stupid employees, divine them his a only live lobby, little regretting conduct, know out testimony the latest even and
                      systematic be service, name of every accept bits turned.
                    </div>
                    In the a soon in facilitate reflections, he more had from preceding think the lay low the where initial feedback dropped at be its
                    to in little instruments, of himself found phase they poverty disappointment is her and to thought, that the by is really chime in
                    the of we sovereignty. On which, office. The that he each been ago she from these is name much phase. Counter-productive towards
                    far and transmitting offers in of the with between was and over since failing. Slowly cheating far with gone in, irregular refute.
                    No success six way differences authentic destined pass pouring.
                  </div>
                </div>
              </CardBody>
              <CardFooter className={footerBg} style={{
              padding: '0.5rem 1rem'
            }}>
                2 days ago
              </CardFooter>
            </Card>
          </div>
        </div>
      </ComponentCard>
    </>;
};
export default BackgroundBorderCard;
export const CardColumns = () => {
  const masonryRef = useRef(null);
  useEffect(() => {
    import('masonry-layout').then(Masonry => {
      if (masonryRef.current) {
        new Masonry.default(masonryRef.current, {
          itemSelector: '.col',
          percentPosition: true
        });
      }
    });
  }, []);
  return <ComponentCard title={<h2>
          Card
          <span className="fw-300">
            <i>Columns</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Cards can be organized into{' '}
            <a href="https://masonry.desandro.com/" target="_blank">
              Masonry
            </a>
            -like columns with just CSS by wrapping them in <code>.card-columns</code>. Cards are built with CSS <code>column</code> properties
            instead of flexbox for easier alignment. Cards are ordered from top to bottom and left to right.
          </div>

          <Alert variant="warning">
            <strong>Heads up!</strong> Your mileage with card columns may vary. To prevent cards breaking across columns, we must set them to{' '}
            <code>display: inline-block</code> as <code>column-break-inside: avoid</code> isn't a bulletproof solution yet.
          </Alert>

          <Row ref={masonryRef}>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card>
                <div className="w-100 bg-fusion-300" style={{
                padding: '40px 0 40px'
              }} />
                <CardBody>
                  <CardTitle as={'h5'}>Card title that wraps to a new line</CardTitle>
                  <CardText>
                    This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card className="p-3">
                <blockquote className="blockquote mb-0">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer className="blockquote-footer">
                    <small className="text-muted">
                      Someone famous in <cite title="Source Title">Source Title</cite>
                    </small>
                  </footer>
                </blockquote>
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card>
                <div className="w-100 bg-fusion-300" style={{
                padding: '40px 0 40px'
              }} />
                <CardBody>
                  <CardTitle as={'h5'}>Card title</CardTitle>
                  <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
                  <CardText>
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card className="bg-primary text-white text-center p-3">
                <blockquote className="blockquote mb-0">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                  <footer className="blockquote-footer text-white">
                    <small>
                      Someone famous in <cite title="Source Title">Source Title</cite>
                    </small>
                  </footer>
                </blockquote>
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card className="text-center">
                <CardBody>
                  <CardTitle as={'h5'}>Card title</CardTitle>
                  <CardText>This card has a regular title and short paragraphy of text below it.</CardText>
                  <CardText>
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card>
                <div className="w-100 bg-fusion-300" style={{
                padding: '40px 0 40px'
              }} />
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card className="p-3 text-end">
                <blockquote className="blockquote mb-0">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer className="blockquote-footer">
                    <small className="text-muted">
                      Someone famous in <cite title="Source Title">Source Title</cite>
                    </small>
                  </footer>
                </blockquote>
              </Card>
            </Col>
            <Col sm={6} lg={4} className="mb-4 col">
              <Card>
                <CardBody>
                  <CardTitle as={'h5'}>Card title</CardTitle>
                  <CardText>
                    This is another card with title and supporting text below. This card has some additional content to make it slightly taller
                    overall.
                  </CardText>
                  <CardText>
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};
export const CollapseExample = () => {
  const [isOpen, setIsOpen] = useState(true);
  return <ComponentCard title={<h2>
          Collapse
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Utilizing bootstrap's collapse component with <code>.card</code>
          </div>
          <Card id="cp-1" className="border">
            <CardHeader>
              <Button size="sm" variant="danger" className="waves-effect" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                <span>{isOpen ? 'Collapse' : 'Expand'}</span>
              </Button>
            </CardHeader>

            <Collapse in={isOpen}>
              <div>
                <CardBody className="p-0">
                  <div className="p-4">
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  </div>
                </CardBody>
              </div>
            </Collapse>
          </Card>
        </div>
      </div>
    </ComponentCard>;
};