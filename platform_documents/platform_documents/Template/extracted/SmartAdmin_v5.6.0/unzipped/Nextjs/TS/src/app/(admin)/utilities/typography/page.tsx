import ComponentCard from '@/components/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Typography' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Typography'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={'Documentation and examples for typography, including global settings, headings, body text, lists, and more.'}
        />
        <div className="main-content">
          <Row>
            <Col xl={6} lg={12}>
              <HeadingFormats />
              <CustomizingHeading />
              <BasicHeading />
              <LeadMarkup />
              <InlineTextElements />
              <AbbreviationExample />
              <BlockQuote />
              <TextWrapping />
              <TurncateExample />
              <TextAlignment />
            </Col>
            <Col xl={6} lg={12}>
              <TextStyles />
              <FontColors />
              <FontSizes />
              <LinkStates />
              <UnstyledList />
              <InlineList />
              <DescriptionListAlignment />
              <MonospaceFont />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page

const HeadingFormats = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Display
          <span className="fw-300">
            <i>headings</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Traditional heading elements are designed to work best in the meat of your page content. When you need a heading to stand out, consider
            using a display heading—a larger, slightly more opinionated heading style.
          </div>
          <div className="frame-wrap">
            <h3 className="display-1">Display 1</h3>
            <h3 className="display-2">Display 2</h3>
            <h3 className="display-3">Display 3</h3>
            <h1 className="display-4 mb-0">Display 4</h1>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const CustomizingHeading = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Customizing
          <span className="fw-300">
            <i>headings</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Use the included utility classes to recreate the small secondary heading text</div>
          <div className="frame-wrap">
            <h3 className="m-0">
              Fancy display heading
              <small className="text-muted m-0 d-inline">With faded secondary text</small>
            </h3>
          </div>
          <div className="frame-wrap">
            <div className="subheader m-0">
              <h1 className="subheader-title mb-0">
                h1. Default Page Header
                <small className="mb-0">
                  with text description on the <span className="fw-500">bottom</span>
                </small>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const BasicHeading = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Basic
          <span className="fw-300">
            <i>headings</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            All HTML headings, <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>, are available
          </div>
          <div className="demo-v-spacing">
            <h1>h1. Heading 1</h1>
            <h2>h2. Heading 2</h2>
            <h3>h3. Heading 3</h3>
            <h4>h4. Heading 4</h4>
            <h5>h5. Heading 5</h5>
            <h6>h6. Heading 6</h6>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const LeadMarkup = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Lead
          <span className="fw-300">
            <i>markup</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Make a paragraph stand out by adding <code>.lead</code>
          </div>
          <div className="frame-wrap">
            <p className="lead m-0">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.</p>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const InlineTextElements = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Display
          <span className="fw-300">
            <i>headings</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Styling for common inline HTML5 elements.</div>
          <p>
            You can use the mark tag to <mark>highlight</mark> text.
          </p>
          <p>
            <del>This line of text is meant to be treated as deleted text.</del>
          </p>
          <p>
            <s>This line of text is meant to be treated as no longer accurate.</s>
          </p>
          <p>
            <ins>This line of text is meant to be treated as an addition to the document.</ins>
          </p>
          <p>
            <u>This line of text will render as underlined</u>
          </p>
          <p>
            <small>This line of text is meant to be treated as fine print.</small>
          </p>
          <p>
            <strong>This line rendered as bold text.</strong>
          </p>
          <p>
            <em>This line rendered as italicized text.</em>
          </p>
        </div>
      </div>
    </ComponentCard>
  )
}

const AbbreviationExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Abbreviation
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Stylized implementation of HTML's <code>&lt;abbr&gt;</code> element for abbreviations and acronyms to show the expanded version on hover.
            Abbreviations have a default underline and gain a help cursor to provide additional context on hover and to users of assistive
            technologies.
          </div>
          <p>
            <abbr title="attribute">attr</abbr>
          </p>
          <p className="m-0">
            <abbr title="HyperText Markup Language" className="initialism">
              HTML
            </abbr>
          </p>
        </div>
      </div>
    </ComponentCard>
  )
}

const BlockQuote = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Block
          <span className="fw-300">
            <i>quote</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            For quoting blocks of content from another source within your document. Wrap <code>&lt;blockquote class="blockquote"&gt;</code> around any
            <abbr title="HyperText Markup Language">HTML</abbr> as the quote. Add a <code>&lt;footer class="blockquote-footer"&gt;</code> for
            identifying the source. Wrap the name of the source work in <code>&lt;cite&gt;</code>
          </div>
          <blockquote className="blockquote">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer className="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </footer>
          </blockquote>
          <blockquote className="blockquote text-center">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer className="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </footer>
          </blockquote>
          <blockquote className="blockquote text-end">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer className="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </ComponentCard>
  )
}

const TextWrapping = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Wrapping
          <span className="fw-300">
            <i>text example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Wrap text with a <code>.text-wrap</code> class, to prevent text from wrapping with a <code>.text-nowrap</code> class
          </div>
          <div className="demo-v-spacing">
            <div className="badge bg-primary text-wrap" style={{ width: '6rem' }}>
              This text should wrap.
            </div>
            <div className="text-nowrap bd-highlight" style={{ width: '8rem' }}>
              This text should overflow the parent.
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const TurncateExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Turncate
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            For longer content, you can add a <code>.text-truncate</code> class to truncate the text with an ellipsis.
            <span className="fw-400">Requires</span> <code>display: inline-block</code> or <code>display: block</code>. You can also combine the
            following classe <code>.text-truncate</code> and combine with <code>.text-truncate-xs</code>, <code>.text-truncate-sm</code>,
            <code>.text-truncate-md</code>, <code>.text-truncate-default</code>, and <code>.text-truncate-lg</code> to achieve the desired results
          </div>
          <div className="frame-wrap">
            <span className="d-block text-truncate text-truncate-xs">Curabitur blandit tempus ardua ridiculus sed magna.</span>
            <span className="d-block text-truncate text-truncate-sm">Curabitur blandit tempus ardua ridiculus sed magna.</span>
            <span className="d-block text-truncate text-truncate-md">Curabitur blandit tempus ardua ridiculus sed magna.</span>
            <span className="d-block text-truncate text-truncate-default">Curabitur blandit tempus ardua ridiculus sed magna.</span>
            <span className="d-block text-truncate text-truncate-lg">Curabitur blandit tempus ardua ridiculus sed magna.</span>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const TextAlignment = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Text
          <span className="fw-300">
            <i>alignment</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Easily realign text to components with text alignment classes.
            <code>
              .text-{'{'}left,right,center,justify{'}'}
            </code>
          </div>
          <div className="demo-v-spaving">
            <p className="text-start">Left aligned text on all viewport sizes.</p>
            <p className="text-center">Center aligned text on all viewport sizes.</p>
            <p className="text-end">Right aligned text on all viewport sizes.</p>
            <p className="text-sm-start">Left aligned text on viewports sized SM (small) or wider.</p>
            <p className="text-md-start">Right aligned text on viewports sized MD (medium) or wider.</p>
            <p className="text-lg-start">Left aligned text on viewports sized LG (large) or wider.</p>
            <p className="text-xl-start">Left aligned text on viewports sized XL (extra-large) or wider.</p>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const TextStyles = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Text
          <span className="fw-300">
            <i>transform</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Quickly change the weight (boldness) of text with <code>.font-weight-bold</code> or italicize text with <code>.font-italic</code>. Reset
            boldness of text with <code>.font-weight-bold</code>. Try various font weights using
            <code>
              .fw-{'{'}300,400,500,700,900{'}'}
            </code>
          </div>
          <div className="frame-wrap">
            <div className="demo-v-spacing">
              <p>
                <span>Sample text</span>
              </p>
              <p>
                <span className="fw-300">Sample light text</span>
              </p>
              <p>
                <span className="fw-500">Sample bold text</span>
              </p>
              <p>
                <span className="fw-700">Sample bolder text</span>
              </p>
              <p>
                <span className="fw-900">Sample boldest text</span>
              </p>
              <p>
                <span className="fw-300 font-italic">Sample light &amp; italic text</span>
              </p>
              <p className="m-0">
                <span className="fw-900">
                  <u>Sample boldest &amp; underline text</u>
                </span>
              </p>
            </div>
          </div>
          <div className="frame-wrap">
            <div className="demo-v-spacing">
              <p>
                <span className="text-lowercase">Lowercased text</span>
              </p>
              <p>
                <span className="text-uppercase">Uppercased text</span>
              </p>
              <p>
                <span className="text-capitalize">CapiTaliZed text</span>
              </p>
              <p>
                <span className="fw-300 text-lowercase">light text with lower case</span>
              </p>
              <p>
                <span className="fw-500 text-uppercase">Bold text with uppercase</span>
              </p>
              <p>
                <span className="fw-700 text-capitalize">Bolder capitalized text</span>
              </p>
              <p>
                <span className="fw-900 text-uppercase font-italic">Boldest text with uppercase &amp; italic font</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const FontColors = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Font
          <span className="fw-300">
            <i>Colors</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Convey meaning through color with a handful of color utility classes. Includes support for styling links with hover states, too. Reset
            colors using <code>.text-reset</code> class.
          </div>
          <div className="demo-v-spacing">
            <p>
              <span className="text-primary">Primary state text</span>
            </p>
            <p>
              <span className="text-success">Success state text</span>
            </p>
            <p>
              <span className="text-warning">Warning state text</span>
            </p>
            <p>
              <span className="text-info">Info state text</span>
            </p>
            <p>
              <span className="text-danger">Danger state text</span>
            </p>
            <p>
              <span className="text-gradient">Text gradient</span>
            </p>
            <p>
              <span className="text-light">Light state text</span>
            </p>
            <p>
              <span className="text-dark">Dark state text</span>
            </p>
            <p>
              <span className="fw-normal">Fontweight Normal</span>
            </p>
            <p>
              <span className="text-muted">Muted state text</span>
            </p>
            <p className="text-muted">
              Muted text with a
              <Link href="" className="text-reset">
                reset link
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const FontSizes = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Font
          <span className="fw-300">
            <i>sizes</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Change font sizes at quickly with <code>.fs-nano</code> or
            <code>
              h{'{'}1-6{'}'}
            </code>
            classes.
          </div>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <span className="fs-xxl p-3">.fs-xxl</span>
            <span className="fs-xl p-3">.fs-xl</span>
            <span className="fs-lg p-3">.fs-lg</span>
            <span className="fs-md p-3">.fs-md</span>
            <span className="fs-sm p-3">.fs-sm</span>
            <span className="fs-xs p-3">.fs-xs</span>
            <span className="fs-nano p-3">.fs-nano</span>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-center flex-row-reverse">
            <span className="h6 p-3">.h6</span>
            <span className="h5 p-3">.h5</span>
            <span className="h4 p-3">.h4</span>
            <span className="h3 p-3">.h3</span>
            <span className="h2 p-3">.h2</span>
            <span className="h1 p-3">.h1</span>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const LinkStates = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Link
          <span className="fw-300">
            <i>States</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Basic links example with font weight variations and colors. Active links on left, inactive on right</div>
          <div className="frame-wrap">
            <Row>
              <Col sm={6}>
                <div className="demo-v-spacing">
                  <p>
                    <Link href="">
                      <span>Sample text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="">
                      <span className="fw-300">Sample light text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="">
                      <span className="fw-500">Sample bold text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="">
                      <span className="fw-700">Sample bolder text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="">
                      <span className="fw-900">Sample boldest text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="">
                      <span className="fw-300 font-italic">Sample light &amp; italic text</span>
                    </Link>
                  </p>
                  <p className="m-0">
                    <Link href="">
                      <span className="fw-900">
                        <u>Sample boldest &amp; underline text</u>
                      </span>
                    </Link>
                  </p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="demo-v-spacing">
                  <p>
                    <Link href="" className="disabled">
                      <span>Sample text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="disabled">
                      <span className="fw-300">Sample light text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="disabled">
                      <span className="fw-500">Sample bold text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="disabled">
                      <span className="fw-700">Sample bolder text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="disabled">
                      <span className="fw-900">Sample boldest text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="disabled">
                      <span className="fw-300 font-italic">Sample light &amp; italic text</span>
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="disabled">
                      <span className="fw-900">
                        <u>Sample boldest &amp; underline text</u>
                      </span>
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="frame-wrap">
            <Row>
              <Col sm={6}>
                <div className="demo-v-spacing">
                  <p>
                    <Link href="" className="text-primary">
                      Primary state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-success">
                      Success state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-warning">
                      Warning state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-info">
                      Info state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-danger">
                      Danger state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-secondary">
                      Secondary state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-muted">
                      Muted state
                    </Link>
                  </p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="demo-v-spacing">
                  <p>
                    <Link href="" className="text-primary disabled">
                      Primary state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-success disabled">
                      Success state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-warning disabled">
                      Warning state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-info disabled">
                      Info state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-danger disabled">
                      Danger state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-secondary disabled">
                      Secondary state
                    </Link>
                  </p>
                  <p>
                    <Link href="" className="text-muted disabled">
                      Muted state
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const UnstyledList = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Unstyled
          <span className="fw-300">
            <i>list</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Remove the default <code>list-style</code> and left margin on list items (immediate children only).
            <span className="fw-400">This only applies to immediate children list items</span>, meaning you will need to add the class for any nested
            lists as well.
          </div>
          <div className="demo demo-no-mb">
            <ul className="list-unstyled">
              <li>Lorem ipsum dolor sit amet</li>
              <li>Consectetur adipiscing elit</li>
              <li>Integer molestie lorem at massa</li>
              <li>Facilisis in pretium nisl aliquet</li>
              <li>
                Nulla volutpat aliquam velit
                <ul>
                  <li>Phasellus iaculis neque</li>
                  <li>Purus sodales ultricies</li>
                  <li>Vestibulum laoreet porttitor sem</li>
                  <li>Ac tristique libero volutpat at</li>
                </ul>
              </li>
              <li>Faucibus porta lacus fringilla vel</li>
              <li>Aenean sit amet erat nunc</li>
              <li>Eget porttitor lorem</li>
            </ul>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const InlineList = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Inline
          <span className="fw-300">
            <i>list</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Remove a list's bullets and apply some light <code>margin</code> with a combination of two classes, <code>.list-inline</code> and
            <code>.list-inline-item</code>
          </div>
          <div className="demo demo-no-mb">
            <ul className="list-inline">
              <li className="list-inline-item">Lorem ipsum</li>
              <li className="list-inline-item">Phasellus iaculis</li>
              <li className="list-inline-item">Nulla volutpat</li>
            </ul>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const DescriptionListAlignment = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Description
          <span className="fw-300">
            <i>list alignment</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Align terms and descriptions horizontally by using our grid system's predefined classes (or semantic mixins). For longer terms, you can
            optionally add a <code>.text-truncate</code> class to truncate the text with an ellipsis
          </div>
          <div className="demo-no-mb">
            <dl className="row">
              <dt className="col-sm-3">Description lists</dt>
              <dd className="col-sm-9">A description list is perfect for defining terms.</dd>
              <dt className="col-sm-3">Euismod</dt>
              <dd className="col-sm-9">
                <p>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</p>
                <p>Donec id elit non mi porta gravida at eget metus.</p>
              </dd>
              <dt className="col-sm-3">Malesuada porta</dt>
              <dd className="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>
              <dt className="col-sm-3 text-truncate">Truncated term is truncated</dt>
              <dd className="col-sm-9">
                Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
              </dd>
              <dt className="col-sm-3">Nesting</dt>
              <dd className="col-sm-9">
                <dl className="row">
                  <dt className="col-sm-4">Nested definition list</dt>
                  <dd className="col-sm-8">Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.</dd>
                </dl>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const MonospaceFont = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Monospace
          <span className="fw-300">
            <i>font</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Change a selection to our monospace font stack with <code>.font-monospace</code>
          </div>
          <div className="demo-v-space">
            <p className="font-monospace">This is in monospace</p>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
