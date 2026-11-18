import search14 from '@/assets/img/search/14.webp'
import seatch15 from '@/assets/img/search/15.webp'
import search16 from '@/assets/img/search/16.webp'
import search18 from '@/assets/img/search/18.webp'
import { basePath } from '@/helpers'
import Link from 'next/link'
import { Card, CardBody } from 'react-bootstrap'
import search17 from '@/assets/img/search/17.webp'

const AllTabs = () => {
  return (
    <>
      <Card>
        <ul className="list-group list-group-flush">
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              SmartAdmin v5 - Jquery Free WebApp
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book...
            </div>
            <div className="scrolling-wrapper gap-2 d-flex flex-row mt-3">
              <div className="d-block text-truncate text-truncate-lg border-faded p-2 flex-shrink-0">
                <Link href="" className="fs-md fw-500">
                  Support us - WebApp
                </Link>
                <details>
                  <summary className="d-block text-truncate text-truncate-lg text-muted fs-xs">He consider is to vows, focuses </summary>
                  <p className="d-block text-truncate text-truncate-lg fs-md">Sufficiently the secure our represent on eagerly magazine where expl</p>
                </details>
              </div>
              <div className="d-block text-truncate text-truncate-lg border-faded p-2 ms-2 flex-shrink-0">
                <Link href="" className="fs-md fw-500">
                  Contact - WebApp
                </Link>
                <details>
                  <summary className="d-block text-truncate text-truncate-lg text-muted fs-xs">
                    Sufficiently the secure our represent on eagerly magazine where expl
                  </summary>
                  <p className="d-block text-truncate text-truncate-lg fs-md">Sufficiently the secure our represent on eagerly magazine where expl</p>
                </details>
              </div>
              <div className="d-block text-truncate text-truncate-lg border-faded p-2 ms-2 flex-shrink-0">
                <Link href="" className="fs-md fw-500">
                  About us
                </Link>
                <details>
                  <summary className="d-block text-truncate text-truncate-lg text-muted fs-xs">
                    Which been italic, his based due and yet was hazar
                  </summary>
                  <p className="d-block text-truncate text-truncate-lg fs-md">Sufficiently the secure our represent on eagerly magazine where expl</p>
                </details>
              </div>
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              Develop your webapp with ease using SmartAdmin
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Acquired concept to however, lots have it human its after suspicious good clock, line tall and writing be he are was increased
              technology be client would, and in top children peacefully. The consider is to vows, focuses completely I to proposal room. Joke. That
              particularly problem uniforms, burden military the to ill road, people.
            </div>
            <div className="scrolling-wrapper fs-sm d-flex align-items-center mt-3">
              <Link href="" className="me-2 mt-1" title="SmartAdmin Colors">
                <span className="d-block ratio ratio-16x9 width-sm" style={{ backgroundImage: `url(${search16.src})`, backgroundSize: 'cover' }} />
              </Link>
              <Link href="" className="me-2 mt-1" title="SmartAdmin Alerts">
                <span className="d-block ratio ratio-16x9 width-sm" style={{ backgroundImage: `url(${search18.src})`, backgroundSize: 'cover' }} />
              </Link>
              <Link href="" className="me-2 mt-1" title="SmartAdmin Progress">
                <span className="d-block ratio ratio-16x9 width-sm" style={{ backgroundImage: `url(${search14.src})`, backgroundSize: 'cover' }} />
              </Link>
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              45,000 downloads for SmartAdmin v5
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Greatest both welcoming the turn spineless, to which been italic, his based due and yet was hazardous necessary pros blind a okay.
              Written missions of and remedies. Have prior though point economics, real he please.
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              Company project Timeline Stock SmartAdmin
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Once freshlybrewed of it as and big behind he sufficiently the secure our represent on eagerly magazine where explanation every he they
              should a go presentations.
            </div>
          </li>

          <li className="list-group-item py-4 px-4">
            <h5 className="fw-400 d-flex align-items-center gap-2" role="heading">
              <svg className="sa-icon sa-thin sa-icon-2x">
                <use href={`${basePath}/icons/sprite.svg#youtube`} />
              </svg>
              Videos
            </h5>
            <div className="scrolling-wrapper">
              <Card className="shadow-0 d-inline-flex me-2 flex-shrink-0" style={{ width: 200 }}>
                <div
                  className="card-img-top position-relative"
                  style={{
                    backgroundImage: `url(${seatch15.src})`,
                    backgroundSize: 'cover',
                    display: 'block',
                    height: 110,
                    maxWidth: 200,
                  }}>
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center display-3">
                    <div className="stack-icon">
                      <div className="icon-layers">
                        <i className="sa sa-base-7 stack-3x text-warning alpha-7" />
                      </div>
                      <div className="icon-layers">
                        <i className="sa sa-control-play stack-1x text-light" />
                      </div>
                    </div>
                  </div>
                </div>
                <CardBody className="py-3 px-2">
                  <a href="#" className="stretched-link fs-lg fw-500">
                    Introduction
                  </a>
                  <p className="fs-xs mt-1">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <span className="text-success fs-xs">YouTube</span> <span className="text-muted fs-xs opacity-50">- Jul 18, 2023 </span>
                </CardBody>
              </Card>

              <Card className="shadow-0 d-inline-flex me-2 flex-shrink-0" style={{ width: 200 }}>
                <div
                  className="card-img-top position-relative"
                  style={{
                    backgroundImage: `url(${search17.src})`,
                    backgroundSize: 'cover',
                    display: 'block',
                    height: 110,
                    maxWidth: 200,
                  }}>
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center display-3">
                    <div className="stack-icon">
                      <div className="icon-layers">
                        <i className="sa sa-base-7 stack-3x text-warning alpha-7" />
                      </div>
                      <div className="icon-layers">
                        <i className="sa sa-control-play stack-1x text-light" />
                      </div>
                    </div>
                  </div>
                </div>
                <CardBody className="py-3 px-2">
                  <Link href="" className="stretched-link fs-lg fw-500">
                    Advanced layouts
                  </Link>
                  <p className="fs-xs mt-1">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <span className="text-success fs-xs">YouTube</span> <span className="text-muted fs-xs opacity-50">- Jan 15, 2023 </span>
                </CardBody>
              </Card>
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <a href="" className="fs-lg fw-500">
              Online software and management toolkit using UI
            </a>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam laoreet turpis sed leo gravida
              interdum. Aliquam efficitur tempor enim ac pretium. Integer scelerisque dui sed ex laoreet congue.
            </div>
          </li>

          <li className="list-group-item py-4 px-4">
            <h5 className="fw-400 d-flex align-items-center gap-2" role="heading">
              <svg className="sa-icon sa-thin sa-icon-2x">
                <use href={`${basePath}/icons/sprite.svg#shopping-cart`} />
              </svg>
              Orders
            </h5>
            <table className="table table-nano table-hover table-bordered table-striped m-0" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="border-top-0">Items</th>
                  <th className="border-top-0">Status</th>
                  <th className="border-top-0 hidden-sm">Total</th>
                  <th className="border-top-0">Date</th>
                  <th className="border-top-0">Client</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-500">Corporate Identity</span>
                      <span className="text-muted ms-2 hidden-sm">Hrs: 102</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-warning">Pending</span>
                  </td>
                  <td className="hidden-sm">$5940</td>
                  <td>16/08/2022</td>
                  <td>Microsoft</td>
                </tr>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-500">Logo Design</span>
                      <span className="text-muted ms-2 hidden-sm">Hrs: 52</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary">In progress</span>
                  </td>
                  <td className="hidden-sm">$2540</td>
                  <td>28/10/2022</td>
                  <td>Microsoft</td>
                </tr>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-500">Animation</span>
                      <span className="text-muted ms-2 hidden-sm">Hrs: 102</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-success">Complete</span>
                  </td>
                  <td className="hidden-sm">$928.41</td>
                  <td>18/09/2022</td>
                  <td>Walmart</td>
                </tr>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-500">UX Review</span>
                      <span className="text-muted ms-2 hidden-sm">Hrs: 75</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-success">Complete</span>
                  </td>
                  <td className="hidden-sm">$9870</td>
                  <td>15/08/2022</td>
                  <td>Bridgestone</td>
                </tr>
              </tbody>
            </table>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              Bootstrap Templates &amp; Themes from WrapBootstrap
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Been the as I have stairs familiarity he everything our except with now, there's he literature stage all the himself bed and skyline
              overhauls at how may maintain didn't depend train tone, sign he reassuring complete reached chance.
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              It impenetrable hazardous best.
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/themes/admin
              </Link>
            </div>
            <div className="mt-2">
              Must and agency is she something sentences that italic, to would trust, a the far was for small quarter following thought, any at
              something over there of being me. Frequency; And cheerful, tone the at their lobby, are was the between touch have play suppliers, eye
              stash too the that.
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              Temple of appeared a somewhere, hands
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/web-app/peoples-theme
              </Link>
            </div>
            <div className="mt-2">
              Time. Reason that staple in her many a do comments less recommended. Easier just dull two harmonics. Strenuous much back to over career
              here. Let's of with business the completely for anger get that up software god mostly my in phase he on knowing posterity drew he or
              each any that brown said in and have he nonsense, evils then first wait neuter.
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              You did to and bed seen, documents violin to groundtem
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/templates/kiwik-rickshaw-admin
              </Link>
            </div>
            <div className="mt-2">
              The wrong findings. Only into the considerations, stuffed puzzles was enough and how queen, and sooner person, different in to pass not.
              Able mellower to having as easier at live of process anger more, such, what avarice attention from warned congress, you the his o'clock
              enterprises then, an velocity a belong, samples copy and occasion films and day secure that dissolute by her ever the headline take what
              two as example, it is about but employed one in sleeping eyes the like.
            </div>
          </li>
          <li className="list-group-item py-4 px-4">
            <Link href="" className="fs-lg fw-500">
              To she enjoying world could to
            </Link>
            <div className="fs-xs mt-1">
              <Link href="" className="text-success">
                http://getwebora.com/business/admin
              </Link>
            </div>
            <div className="mt-2">
              Decades the and the of deceleration been from with key a the pass in such safe motors it abused years temple a she have rush one a yes,
              it hesitated of he refinements. Day into of was concise principles, those with but from behind most ideas been their explain text to
              their and spots present events do was, a best odd one is one in some we explains way one attempt.
            </div>
          </li>
        </ul>
      </Card>
    </>
  )
}

export default AllTabs
