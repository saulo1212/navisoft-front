import ComponentCard from '@/components/ComponentCard'
import Link from 'next/link'
import { Col, Pagination, Row } from 'react-bootstrap'

export const BasicExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Basic
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              We use a large block of connected links for our pagination, making links hard to miss and easily scalable—all while providing large hit
              areas. Pagination is built with list HTML elements so screen readers can announce the number of available links. Use a wrapping
              <code>&lt;nav&gt;</code> element to identify it as a navigation section to screen readers and other assistive technologies.
            </p>
            <p>
              In addition, as pages likely have more than one such navigation section, it's advisable to provide a descriptive <code>aria-label</code>
              for the <code>&lt;nav&gt;</code> to reflect its purpose. For example, if the pagination component is used to navigate between a set of
              search results, an appropriate label could be <code>aria-label="Search results pages"</code>.
            </p>
          </div>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <Link className="page-link" href="">
                  Previous
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item active" aria-current="page">
                <Link className="page-link" href="">
                  2 <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  3
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ComponentCard>
  )
}

export const DifferentStates = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Different
          <span className="fw-300">
            <i>states</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Pagination links are customizable for different circumstances. Use <code>.disabled</code> for links that appear un-clickable and
              <code>.active</code> to indicate the current page.
            </p>
            <p>
              While the <code>.disabled</code> class uses <code>pointer-events: none</code> to <em>try</em> to disable the link functionality of
              <code>&lt;a&gt;</code>s, that CSS property is not yet standardized and doesn't account for keyboard navigation. As such, you should
              always add <code>tabindex="-1"</code> on disabled links and use custom JavaScript to fully disable their functionality.
            </p>
          </div>
          <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">
                  Previous
                </a>
              </li>
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">
                  1
                </a>
              </li>
              <li className="page-item active" aria-current="page">
                <Link className="page-link" href="">
                  2 <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  3
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
          <hr className="my-5" />
          <p>
            You can optionally swap out active or disabled anchors for <code>&lt;span&gt;</code>, or omit the anchor in the case of the prev/next
            arrows, to remove click functionality and prevent keyboard focus while retaining intended styles.
          </p>
          <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item disabled">
                <span className="page-link">Previous</span>
              </li>
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">
                  1
                </a>
              </li>
              <li className="page-item active" aria-current="page">
                <span className="page-link">
                  2<span className="visually-hidden">(current)</span>
                </span>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  3
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ComponentCard>
  )
}

export const UsingIcon = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Using
          <span className="fw-300">
            <i>icons</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Looking to use an icon or symbol in place of text for some pagination links? Be sure to provide proper screen reader support with aria
            attributes.
          </div>
          <Row>
            <Col lg={4}>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </Col>
            <Col lg={4}>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <a className="page-link d-inline-flex align-items-center justify-content-center px-2" href="#" aria-label="Previous">
                      <i className="sa sa-arrow-left" />
                    </a>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <a className="page-link d-inline-flex align-items-center justify-content-center px-2" href="#" aria-label="Next">
                      <i className="sa sa-arrow-right" />
                    </a>
                  </li>
                </ul>
              </nav>
            </Col>
            <Col lg={4}>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                  <li className="page-item">
                    <a className="page-link d-inline-flex align-items-center justify-content-center px-2" href="#" aria-label="Previous">
                      <i className="sa sa-control-rewind" />
                    </a>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <a className="page-link d-inline-flex align-items-center justify-content-center px-2" href="#" aria-label="Next">
                      <i className="sa sa-control-forward" />
                    </a>
                  </li>
                </ul>
              </nav>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

export const PaginationSizing = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Pagination
          <span className="fw-300">
            <i>sizing</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Fancy larger or smaller pagination? Add <code>.pagination-lg</code> or <code>.pagination-sm</code> for additional sizes.
            </p>
          </div>
          <h5 className="frame-heading">Large</h5>
          <div className="frame-wrap">
            <nav aria-label="...">
              <Pagination size="lg">
                <li className="page-item disabled">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-left" />
                    </span>
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-right" />
                    </span>
                  </a>
                </li>
              </Pagination>
            </nav>
          </div>
          <h5 className="frame-heading">Default</h5>
          <div className="frame-wrap">
            <nav aria-label="...">
              <ul className="pagination">
                <li className="page-item disabled">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-left" />
                    </span>
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-right" />
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <h5 className="frame-heading">Small</h5>
          <div className="frame-wrap">
            <nav aria-label="...">
              <ul className="pagination pagination-sm">
                <li className="page-item disabled">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-left" />
                    </span>
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-right" />
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <h5 className="frame-heading">Extra Small</h5>
          <div className="frame-wrap">
            <nav aria-label="...">
              <ul className="pagination pagination-xs">
                <li className="page-item disabled">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-left" />
                    </span>
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">
                      <i className="sa sa-chevron-right" />
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const AligningPagination = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Aligning
          <span className="fw-300">
            <i>pagination</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">With left being default, you may change the alignment of pagination components with flexbox utilities.</div>
          <h5 className="frame-heading">Default</h5>
          <div className="frame-wrap">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">
                    Previous
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <h5 className="frame-heading text-center">Center</h5>
          <div className="frame-wrap">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">
                    Previous
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <h5 className="frame-heading text-end">Right</h5>
          <div className="frame-wrap">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">
                    Previous
                  </a>
                </li>
                <li className="page-item active" aria-current="page">
                  <span className="page-link">
                    1<span className="visually-hidden">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
