'use client'
import peaceFull from '@/assets/img/demo/peace-full.jpg'
import { default as relax, default as relaxFull } from '@/assets/img/demo/relax-full.jpg'
import seaFull from '@/assets/img/demo/sea-full.jpg'
import ComponentCard from '@/components/ComponentCard'
import Image from 'next/image'
import Link from 'next/link'
import { Carousel, CarouselItem, Modal, ModalBody } from 'react-bootstrap'

export const KitchenSinkCarousels = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Kitchen
          <span className="fw-300">
            <i>sink example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Carousels don't automatically normalize slide dimensions. As such, you may need to use additional utilities or custom styles to
            appropriately size content. While carousels support previous/next controls and indicators, they're not explicitly required. Add and
            customize as you see fit.
            <br />
            <br />
            <strong>
              The <code>.active</code> class needs to be added to one of the slides
            </strong>
            otherwise the carousel will not be visible. Also be sure to set a unique id on the <code>.carousel</code> for optional controls,
            especially if you're using multiple carousels on a single page. Control and indicator elements must have a <code>data-target</code>{' '}
            attribute (or <code>href</code> for links) that matches the id of the <code>.carousel</code> element.
          </div>
          <Carousel controls={true} indicators={true} id="carouselExampleKitchenSink" fade={false} className="slide">
            <CarouselItem>
              <Image className="d-block w-100" src={relaxFull} alt="First slide" />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="color-white opacity-70">First slide label</h5>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </div>
            </CarouselItem>
            <CarouselItem className="active">
              <Image className="d-block w-100" src={peaceFull} alt="Second slide" />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="color-white opacity-70">Second slide label</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <Image className="d-block w-100" src={seaFull} alt="Third slide" />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="color-white opacity-70">Third slide label</h5>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </div>
            </CarouselItem>

            <a className="carousel-control-prev" href="#carouselExampleKitchenSink" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleKitchenSink" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </a>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const AddCaptions = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Add
          <span className="fw-300">
            <i>captions</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add captions to your slides easily with the <code>.carousel-caption</code> element within any <code>.carousel-item</code>. They can be
            easily hidden on smaller viewports, as shown below, with optional{' '}
            <Link href="" target="_blank">
              display utilities
            </Link>
            . We hide them initially with <code>.d-none</code> and bring them back on medium-sized devices with <code>.d-md-block</code>
          </div>
          <Carousel indicators={true} id="carouselExampleCaptions" data-bs-ride="carousel">
            <CarouselItem className="active">
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=First+slide&background=_5a636d&color=_7f8995&fontsize=53.33"
                alt="First slide"
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Second+slide&background=_5a636d&color=_7f8995&fontsize=53.33"
                alt="Second slide"
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Second slide label</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Third+slide&background=_5a636d&color=_7f8995&fontsize=53.33"
                alt="Third slide"
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Third slide label</h5>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </div>
            </CarouselItem>

            <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </a>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const Crossfade = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Crossfade
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add <code>.carousel-fade</code> to your carousel to animate slides with a fade transition instead of a slide
          </div>
          <Carousel fade indicators={false} controls={true} id="carouselExampleFade" data-bs-ride="carousel">
            <CarouselItem className="active">
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=First+slide&background=_a38cc6&color=_ffffff&fontsize=53.33"
                alt="First slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Second+slide&background=_967bbd&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=967bbd&fg=ffffff&text=Second slide"
                alt="Second slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Third+slide&background=_886ab5&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=886ab5&fg=ffffff&text=Third slide"
                alt="Third slide"
              />
            </CarouselItem>

            <a className="carousel-control-prev" href="#carouselExampleFade" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleFade" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </a>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const Indicators = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Indicators
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">You can also add the indicators to the carousel, alongside the controls, too</div>
          <Carousel indicators={true} controls={true} id="carouselExampleIndicators" data-bs-ride="carousel">
            <CarouselItem className="active">
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=First+slide&background=_37e2d0&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=37e2d0&fg=ffffff&text=First slide"
                alt="First slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Second+slide&background=_21dfcb&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=21dfcb&fg=ffffff&text=Second slide"
                alt="Second slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Third+slide&background=_1dc9b7&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=1dc9b7&fg=ffffff&text=Third slide"
                alt="Third slide"
              />
            </CarouselItem>

            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </a>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const IntervalExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Interval
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add <code>data-interval=""</code> to a <code>.carousel-item</code> to change the amount of time to delay between automatically cycling to
            the next item. E.g The first image will change after 10 seconds, the second one will change after 2 seconds, and the following will change
            as default settings.
          </div>
          <Carousel id="carouselExampleInterval" controls={true} indicators={false} data-bs-ride="carousel">
            <CarouselItem className="active" data-bs-interval={10000}>
              <img
                className="d-block w-100"
                src="https://placehold.co/800x400/ffd274/333333?text=First+slide"
                data-src="holder.js/800x400?auto=yes&bg=ffd274&fg=333333&text=First slide"
                alt="First slide"
              />
            </CarouselItem>
            <CarouselItem data-bs-interval={2000}>
              <img
                className="d-block w-100"
                src="https://placehold.co/800x400/ffca5b/000000?text=Second+slide"
                data-src="holder.js/800x400?auto=yes&bg=ffca5b&fg=000000&text=Second slide"
                alt="Second slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placehold.co/800x400/ffc241/000000?text=Third+slide"
                data-src="holder.js/800x400?auto=yes&bg=ffc241&fg=000000&text=Third slide"
                alt="Third slide"
              />
            </CarouselItem>

            <a className="carousel-control-prev" href="#carouselExampleInterval" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleInterval" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </a>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const ControlsExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Control
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Adding in previous and next controls</div>
          <Carousel controls={true} indicators={false} id="carouselExampleControls" data-bs-ride="carousel">
            <CarouselItem className="active">
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=First+slide&background=_fe85be&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=fe85be&fg=ffffff&text=First slide"
                alt="First slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Second+slide&background=_fe6bb0&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=fe6bb0&fg=ffffff&text=Second slide"
                alt="Second slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Third+slide&background=_fd52a3&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=fd52a3&fg=ffffff&text=Third slide"
                alt="Third slide"
              />
            </CarouselItem>

            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </a>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const SlidesOnly = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Slides
          <span className="fw-300">
            <i>only</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Notice presence of the <code>.d-block</code> and <code>.w-100</code> on carousel images
          </div>
          <Carousel
            controls={false}
            indicators={false}
            id="carouselExampleSlidesOnly"
            className="slide"
            data-bs-ride="carousel"
            data-bs-interval={2000}>
            <CarouselItem className="active">
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=First+slide&background=_51adf6&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=51adf6&fg=ffffff&text=First slide"
                alt="First slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Second+slide&background=_39a1f4&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=39a1f4&fg=ffffff&text=Second slide"
                alt="Second slide"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="d-block w-100"
                src="https://placeholderjs.com/800x400&text=Third+slide&background=_2196f3&color=_ffffff&fontsize=53.33"
                data-src="holder.js/800x400?auto=yes&bg=2196F3&fg=ffffff&text=Third slide"
                alt="Third slide"
              />
            </CarouselItem>
          </Carousel>
        </div>
      </div>
    </ComponentCard>
  )
}

export const FullscreenModel = () => {
  return (
    <Modal
      centered
      fade
      className="modal-fullscreen example-carousel-fullscreen"
      contentClassName="h-100 border-0 shadow-0 bg-fusion-800"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true">
      <button
        type="button"
        className="close p-sm-2 p-md-4 text-white fs-xxl position-absolute pos-right me-sm-2 mt-sm-1 z-index-space"
        data-dismiss="modal"
        aria-label="Close">
        <span aria-hidden="true">
          <i className="sa sa-close" />
        </span>
      </button>
      <ModalBody className="p-0">
        <Carousel controls={true} id="example-carousel-fullscreen" indicators={true} data-bs-ride="carousel">
          <CarouselItem>
            <Image className="d-block w-100" src={relax} alt="First slide" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="color-white opacity-70">First slide label</h5>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </div>
          </CarouselItem>
          <CarouselItem className="active">
            <Image className="d-block w-100" src={peaceFull} alt="Second slide" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="color-white opacity-70">Second slide label</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <Image className="d-block w-100" src={seaFull} alt="Third slide" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="color-white opacity-70">Third slide label</h5>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
          </CarouselItem>

          <a className="carousel-control-prev" href="#example-carousel-fullscreen" role="button" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </a>
          <a className="carousel-control-next" href="#example-carousel-fullscreen" role="button" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </a>
        </Carousel>
      </ModalBody>
    </Modal>
  )
}
