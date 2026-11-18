'use client';

import admin from '@/assets/img/demo/avatars/avatar-admin.png';
import thumbs11 from '@/assets/img/thumbs/pic-11.png';
import thumbs12 from '@/assets/img/thumbs/pic-12.png';
import thumbs7 from '@/assets/img/thumbs/pic-7.png';
import thumbs8 from '@/assets/img/thumbs/pic-8.png';
import ComponentCard from '@/components/ComponentCard';
import Image from 'next/image';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
export const DefaultTabs = () => {
  return <ComponentCard title={<h2>
          Default
          <span className="fw-300">
            <i>Tabs</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The most minimalistic approach to tabs. We add <code>.nav.nav-tabs</code> to an UL and <code>.tab-content</code> to adjacet element. Tabs
            are triggered by the data attribute <code>data-toggle="tab"</code> and <code>href="#tab_content"</code> you will link the tab you would
            like to display
          </div>
          <TabContainer defaultActiveKey={'1'}>
            <Nav className="nav-tabs" role="tablist">
              <NavItem as="li">
                <NavLink eventKey="1" active>
                  Home
                </NavLink>
              </NavItem>
              <Dropdown className="nav-item">
                <DropdownToggle as={'button'} className="nav-link">
                  Profile
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem eventKey="2">Personal</DropdownItem>
                  <DropdownItem eventKey="2">Friends</DropdownItem>
                  <DropdownItem eventKey="2">Settings</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <NavItem>
                <NavLink eventKey="3">Set</NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled>Disabled</NavLink>
              </NavItem>
            </Nav>
            <TabContent className="p-3">
              <TabPane eventKey={'1'} className="fade">
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'2'} className="fade">
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'3'} className="fade">
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const PillVertical = () => {
  return <ComponentCard title={<h2>
          Pill
          <span className="fw-300">
            <i>vertical</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <Row>
            <TabContainer defaultActiveKey={'home'}>
              <div className="col-auto">
                <Nav className="flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <NavLink eventKey="home" className="d-flex align-items-center">
                    <i className="sa sa-home me-2" />
                    <span className="hidden-sm-down ms-1"> Home</span>
                  </NavLink>
                  <NavLink eventKey="profile" className="d-flex align-items-center">
                    <i className="sa sa-user me-2" />
                    <span className="hidden-sm-down ms-1"> Profile</span>
                  </NavLink>
                  <NavLink eventKey={'pill'} className="d-flex align-items-center">
                    <i className="sa sa-envelope me-2" />
                    <span className="hidden-sm-down ms-1"> Messages</span>
                  </NavLink>
                  <NavLink eventKey={'settings'} className="d-flex align-items-center">
                    <i className="sa sa-settings me-2" />
                    <span className="hidden-sm-down ms-1"> Settings</span>
                  </NavLink>
                </Nav>
              </div>
              <Col>
                <TabContent id="v-pills-tabContent">
                  <TabPane eventKey="home" className="fade show" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <h3>Home</h3>
                    <p>
                      Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                      Mustache cliche tempor, williamsburg carles vegan helvetica.
                    </p>
                    <p>
                      Organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone
                      skateboard locavore.
                    </p>
                    <span className="fs-sm d-flex align-items-center mt-3 flex-wrap">
                      <a href="#" className="me-1 mt-1" title="Cell A-0012">
                        <Image src={thumbs7} className="img-share" alt="pic-7" />
                      </a>
                      <a href="#" className="me-1 mt-1" title="Patient A-473 saliva">
                        <Image src={thumbs8} className="img-share" alt="pic-8" />
                      </a>
                      <a href="#" className="me-1 mt-1" title="Patient A-473 blood cells">
                        <Image src={thumbs11} className="img-share" alt="pic-11" />
                      </a>
                      <a href="#" className="me-1 mt-1" title="Patient A-473 Membrane O.C">
                        <Image src={thumbs12} className="img-share" alt="pic-12" />
                      </a>
                    </span>
                  </TabPane>
                  <TabPane eventKey="profile" className="fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                    <h3>Profile</h3>
                    <div className="d-flex flex-row rounded-top mb-3">
                      <div className="d-flex flex-row align-items-center mt-1 mb-1">
                        <span className="me-2">
                          <Image src={admin} className="rounded-circle profile-image" alt="Sunny A." />
                        </span>
                        <div className="info-card-text">
                          <div className="fs-lg text-truncate text-truncate-lg">Sunny A.</div>
                          <span className="text-truncate text-truncate-md opacity-80">sunny@example.com</span>
                        </div>
                      </div>
                    </div>
                    <p>
                      Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog
                      sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.
                    </p>
                    <p>
                      Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud
                      organic.
                    </p>
                  </TabPane>
                  <TabPane eventKey="pill" className="fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                    <h3>Messages</h3>
                    <ul className="notification">
                      <li>
                        <a href="#" className="d-flex align-items-center py-2 px-0">
                          <span className="d-flex flex-column flex-1">
                            <span className="name">Melissa Ayre</span>
                            <span className="msg-a fs-sm">Re: New security codes</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="d-flex align-items-center py-2 px-0">
                          <span className="d-flex flex-column flex-1">
                            <span className="name">Adison Lee</span>
                            <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="d-flex align-items-center py-2 px-0">
                          <span className="d-flex flex-column flex-1">
                            <span className="name">Oliver Kopyuv</span>
                            <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </TabPane>
                  <TabPane eventKey="settings" className="fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                    <h3>Settings</h3>
                    <div className="alert alert-success">
                      <strong>Settings saved</strong>
                      <p className="m-0">All your settings changes have been saved!</p>
                    </div>
                  </TabPane>
                </TabContent>
              </Col>
            </TabContainer>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};
export const PillBorderAndIcon = () => {
  return <ComponentCard title={<h2>
          Pill
          <span className="fw-300">
            <i>borders & icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="border px-3 pt-3 pb-0 rounded">
            <TabContainer defaultActiveKey={'1'}>
              <Nav className="nav-pills" role="tablist">
                <NavItem>
                  <NavLink eventKey={'1'}>
                    <i className="sa sa-home me-1" />
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'2'}>
                    <i className="sa sa-user me-1" />
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'3'}>
                    <i className="sa sa-clock me-1" />
                    Time
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent className="py-3">
                <TabPane eventKey={'1'} className="fade" id="js_pill_border_icon-1" role="tabpanel">
                  Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                  Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater
                  eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
                </TabPane>
                <TabPane eventKey={'2'} className="fade" id="js_pill_border_icon-2" role="tabpanel">
                  Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog
                  sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo
                  enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
                </TabPane>
                <TabPane eventKey={'3'} className="fade" id="js_pill_border_icon-3" role="tabpanel">
                  Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                  readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                  helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
                </TabPane>
              </TabContent>
            </TabContainer>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const JustifiedPills = () => {
  return <ComponentCard title={<h2>
          Justified
          <span className="fw-300">
            <i>pills</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            For equal-width elements, use <code>.nav-justified</code>. All horizontal space will be occupied by nav links
          </div>
          <TabContainer defaultActiveKey={'time'}>
            <Nav className="nav-pills nav-justified" role="tablist">
              <NavItem>
                <NavLink eventKey={'home'} data-bs-toggle="tab" href="#js_change_pill_justified-1">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'profile'} data-bs-toggle="tab" href="#js_change_pill_justified-2">
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'time'} data-bs-toggle="tab" href="#js_change_pill_justified-3">
                  Time
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled className=" disabled" data-bs-toggle="tab" href="#">
                  Disabled
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-3">
              <TabPane eventKey={'profile'}>
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'time'}>
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'disabled'}>
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const TabSizes = () => {
  return <ComponentCard title={<h2>
          Tab
          <span className="fw-300">
            <i>sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Tabs are flexible and can be resized using the utility classes</div>
          <div className="demo-v-spacing">
            <TabContainer defaultActiveKey={'1'}>
              <Nav className="nav-tabs" role="tablist">
                <NavItem>
                  <NavLink eventKey={'1'} className="fs-xs py-1 px-2" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-home text-success" />
                    <span className="hidden-sm-down ms-1">Home</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'2'} className="fs-xs py-1 px-2" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-user text-primary" />
                    <span className="hidden-sm-down ms-1">Profile</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'3'} className="fs-xs py-1 px-2" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-cog text-danger" />
                    <span className="hidden-sm-down ms-1">Settings</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </TabContainer>
            <TabContainer defaultActiveKey={'4'}>
              <Nav className="nav-tabs" role="tablist">
                <NavItem>
                  <NavLink eventKey={'4'} data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-home text-success" />
                    <span className="hidden-sm-down ms-1">Home</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'5'} data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-user text-primary" />
                    <span className="hidden-sm-down ms-1">Profile</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'6'} data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-cog text-danger" />
                    <span className="hidden-sm-down ms-1">Settings</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </TabContainer>
            <TabContainer defaultActiveKey={'7'}>
              <Nav className="nav-tabs" role="tablist">
                <NavItem>
                  <NavLink eventKey={'7'} className="fs-lg px-4" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-home text-success" />
                    <span className="hidden-sm-down ms-1">Home</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'8'} className="fs-lg px-4" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-user text-primary" />
                    <span className="hidden-sm-down ms-1">Profile</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'9'} className="fs-lg px-4" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-cog text-danger" />
                    <span className="hidden-sm-down ms-1">Settings</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </TabContainer>
            <TabContainer defaultActiveKey={'10'}>
              <Nav className="nav-tabs" role="tablist">
                <NavItem>
                  <NavLink eventKey={'10'} className="fs-xl py-3 px-5" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-home text-success" />
                    <span className="hidden-sm-down ms-1">Home</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'11'} className="fs-xl py-3 px-5" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-user text-primary" />
                    <span className="hidden-sm-down ms-1">Profile</span>
                  </NavLink>
                </NavItem>
                <li>
                  <NavLink eventKey={'12'} className="fs-xl py-3 px-5" data-bs-toggle="tab" href="#" role="tab">
                    <i className="sa sa-cog text-danger" />
                    <span className="hidden-sm-down ms-1">Settings</span>
                  </NavLink>
                </li>
              </Nav>
            </TabContainer>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const DirectionalTabs = () => {
  return <ComponentCard title={<h2>
          Directional
          <span className="fw-300">
            <i>tabs</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Direction of the tabs can be changed by adding <code>.justify-content-end</code> and <code>justify-content-center</code> to
            <code>.nav.nav-tabs</code>
            <br />
            <br />
            <div id="js_change_tab_direction" className="btn-group btn-group-sm btn-group-toggle" data-bs-toggle="buttons">
              <input type="radio" className="btn-check" name="radioNameTabDirection" id="option1" defaultChecked defaultValue="nav nav-tabs" />
              <label className="btn btn-info waves-effect" htmlFor="option1">
                Left aligned
              </label>
              <input type="radio" className="btn-check" name="radioNameTabDirection" id="option2" defaultValue="nav nav-tabs justify-content-center" />
              <label className="btn btn-info waves-effect" htmlFor="option2">
                Center aligned
              </label>
              <input type="radio" className="btn-check " name="radioNameTabDirection" id="option3" defaultValue="nav nav-tabs justify-content-end" />
              <label className="btn btn-info waves-effect" htmlFor="option3">
                Right aligned
              </label>
            </div>
          </div>
          <TabContainer defaultActiveKey={'1'}>
            <Nav className="nav-tabs" role="tablist">
              <NavItem>
                <NavLink eventKey={'1'}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'2'}>Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'3'}>Time</NavLink>
              </NavItem>
            </Nav>
            <TabContent className="p-3">
              <TabPane eventKey={'1'} className="fade" id="tab_direction-1" role="tabpanel">
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'2'} className="fade" id="tab_direction-2" role="tabpanel">
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'3'} className="fade" id="tab_direction-3" role="tabpanel">
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const JustifiedTabs = () => {
  return <ComponentCard title={<h2>
          Justified
          <span className="fw-300">
            <i>tabs</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            For equal-width elements, use <code>.nav-justified</code>. All horizontal space will be occupied by nav links
          </div>
          <TabContainer defaultActiveKey={'home'}>
            <Nav className="nav-tabs nav-fill" role="tablist">
              <NavItem>
                <NavLink eventKey={'home'}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'profile'}>Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'time'}>Time</NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled>Disabled</NavLink>
              </NavItem>
            </Nav>
            <TabContent className="p-3">
              <TabPane eventKey={'home'} className="fade" id="tab_justified-1" role="tabpanel">
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'profile'} className="fade" id="tab_justified-2" role="tabpanel">
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'time'} className="fade" id="tab_justified-3" role="tabpanel">
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const BordersIcons = () => {
  return <ComponentCard title={<h2>
          Borders
          <span className="fw-300">
            <i>& icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <TabContainer defaultActiveKey={'icon1'}>
            <Nav className="nav-tabs" role="tablist">
              <NavItem>
                <NavLink eventKey={'icon1'}>
                  <i className="sa sa-home me-1" /> Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'icon2'}>
                  <i className="sa sa-user me-1" /> Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'icon3'}>
                  <i className="sa sa-clock me-1" /> Time
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="border border-top-0 p-3">
              <TabPane eventKey={'icon1'}>
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'icon2'}>
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'icon3'}>
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const DefaultPanel = () => {
  return <ComponentCard title={<h2>
          Default
          <span className="fw-300">
            <i>Panel</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add a clean look to your tabs by adding <code>.nav-tabs-clean</code> to <code>.nav-tabs</code>
          </div>
          <TabContainer defaultActiveKey={'home'}>
            <Nav className="nav-tabs nav-tabs-clean" role="tablist">
              <NavItem>
                <NavLink eventKey="home">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey="profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey="time">Time</NavLink>
              </NavItem>
            </Nav>
            <TabContent className="p-3">
              <TabPane eventKey="home">
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey="profile">
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey="time">
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const DefaultPills = () => {
  return <ComponentCard title={<h2>
          Default
          <span className="fw-300">
            <i>Pills</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The nav pills is the same HTML structure as tabs, but we replace <code>.nav-tabs</code> with <code>.nav-pills</code>
          </div>
          <TabContainer defaultActiveKey={'default1'}>
            <Nav className="nav-pills" role="tablist">
              <NavItem>
                <NavLink eventKey={'default1'}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'default2'}>Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'default3'}>Set</NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled>Disabled</NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-3">
              <TabPane eventKey={'default1'} className="fade">
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'default2'} className="fade">
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'default3'} className="fade">
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};
export const PillsAsNav = () => {
  return <ComponentCard title={<h2>
          Pills
          <span className="fw-300">
            <i>as nav</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            We can display nav pills inside the <code>nav</code> HTML element, which then allows you to inherit properties of buttons, various sizes
            and different colors
          </div>
          <div className="demo-v-spacing">
            <TabContainer defaultActiveKey={'1'}>
              <Nav className="nav-pills">
                <NavItem>
                  <NavLink eventKey={'1'} className="btn-xs">
                    <i className="sa sa-home me-1" /> Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'2'} className="btn-xs">
                    <i className="sa sa-user me-1" /> Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'3'} className="btn-xs">
                    <i className="sa sa-cog me-1" /> Settings
                  </NavLink>
                </NavItem>
              </Nav>
            </TabContainer>
            <TabContainer defaultActiveKey={'1'}>
              <Nav className="nav-pills">
                <NavItem>
                  <NavLink eventKey={'1'} className="btn-lg">
                    <i className="sa sa-home me-1" /> Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'2'} className="btn-lg">
                    <i className="sa sa-user me-1" /> Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey={'3'} className="btn-lg">
                    <i className="sa sa-cog me-1" /> Settings
                  </NavLink>
                </NavItem>
              </Nav>
            </TabContainer>
            <Nav className="nav-pills">
              <NavItem>
                <NavLink eventKey={'1'} className="btn btn-icon btn-lg rounded-circle me-1">
                  <i className="sa sa-home" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'2'} className="btn btn-icon btn-lg rounded-circle me-1">
                  <i className="sa sa-user" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'3'} className="btn btn-icon btn-lg rounded-circle">
                  <i className="sa sa-cog" />
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="nav nav-pills">
              <NavItem>
                <NavLink eventKey={'1'} className="btn btn-icon rounded-circle me-1">
                  <i className="sa sa-home" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'2'} className="btn btn-icon rounded-circle me-1">
                  <i className="sa sa-user" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'3'} className="btn btn-icon rounded-circle">
                  <i className="sa sa-cog" />
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const DirectionalPills = () => {
  return <ComponentCard title={<h2>
          Directional
          <span className="fw-300">
            <i>pills</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Direction of the pills can be changed by adding <code>.justify-content-end</code> and <code>justify-content-center</code> to
            <code>.nav.nav-tabs</code>
            <br />
            <br />
            <div id="js_change_pill_direction" className="btn-group btn-group-sm" data-bs-toggle="buttons">
              <input type="radio" className="btn-check" name="radioNamePillDirection" id="pillOption1" defaultChecked defaultValue="nav nav-pills" />
              <label className="btn btn-success waves-effect" htmlFor="pillOption1">
                Left aligned
              </label>
              <input type="radio" className="btn-check" name="radioNamePillDirection" id="pillOption2" defaultValue="nav nav-pills justify-content-center" />
              <label className="btn btn-success waves-effect" htmlFor="pillOption2">
                Center aligned
              </label>
              <input type="radio" className="btn-check" name="radioNamePillDirection" id="pillOption3" defaultValue="nav nav-pills justify-content-end" />
              <label className="btn btn-success waves-effect" htmlFor="pillOption3">
                Right aligned
              </label>
            </div>
          </div>
          <TabContainer defaultActiveKey={'direction1'}>
            <Nav className="nav-pills" role="tablist">
              <NavItem>
                <NavLink eventKey={'direction1'}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'direction2'}>Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'direction3'}>Time</NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-3">
              <TabPane eventKey={'direction1'}>
                Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache
                cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.
              </TabPane>
              <TabPane eventKey={'direction2'}>
                Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial
                PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic.
              </TabPane>
              <TabPane eventKey={'direction3'}>
                Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table
                readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
                helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
      </div>
    </ComponentCard>;
};