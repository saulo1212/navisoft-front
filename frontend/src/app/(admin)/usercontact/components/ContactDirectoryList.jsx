'use client';

import avatarB from '@/assets/img/demo/avatars/avatar-b.png';
import avatarsC from '@/assets/img/demo/avatars/avatar-c.png';
import avatarE from '@/assets/img/demo/avatars/avatar-e.png';
import avatarG from '@/assets/img/demo/avatars/avatar-g.png';
import avatarH from '@/assets/img/demo/avatars/avatar-h.png';
import avatarI from '@/assets/img/demo/avatars/avatar-i.png';
import avatarJ from '@/assets/img/demo/avatars/avatar-j.png';
import avatarK from '@/assets/img/demo/avatars/avatar-k.png';
import { useState } from 'react';
import { Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
const contacts = [{
  id: 'c_1',
  name: 'Oliver Kopyov',
  role: 'IT Director',
  company: 'Webora Themes',
  avatar: avatarB,
  status: 'success',
  phone: '+1 317-456-2564',
  phoneHref: '+13174562564',
  email: 'oliver.kopyov@smartadminwebapp.com',
  address: '15 Charist St, Detroit, MI, 48212, USA',
  tags: 'oliver kopyov +13174562564 oliver.kopyov@smartadminwebapp.com detroit'
}, {
  id: 'c_2',
  name: 'Sesha Gray',
  role: 'Project Manager',
  company: 'Webora Themes',
  avatar: avatarsC,
  status: 'warning',
  phone: '+1 313-461-1347',
  phoneHref: '+13134611347',
  email: 'sesha.gray@smartadminwebapp.com',
  address: '134 Hamtrammac, Detroit, MI, 48314, USA',
  tags: 'sesha gray +13134611347 sesha.gray@smartadminwebapp.com detroit'
}, {
  id: 'c_3',
  name: 'Dr. John Cook PhD',
  role: 'Human Resources',
  company: 'Webora Themes',
  avatar: avatarE,
  status: 'danger',
  phone: '+1 313-779-1347',
  phoneHref: '+13137791347',
  email: 'john.cook@smartadminwebapp.com',
  address: '55 Smyth Rd, Detroit, MI, 48341, USA',
  tags: 'dr john cook phd +13137791347 john.cook@smartadminwebapp.com detroit'
}, {
  id: 'c_4',
  name: 'Jim Ketty',
  role: 'Staff Orgnizer',
  company: 'Webora Themes',
  avatar: avatarK,
  status: 'success',
  phone: '+1 313-779-3314',
  phoneHref: '+13137793314',
  email: 'jim.ketty@smartadminwebapp.com',
  address: '134 Tasy Rd, Detroit, MI, 48212, USA',
  tags: 'jim ketty +13137793314 jim.ketty@smartadminwebapp.com detroit'
}, {
  id: 'c_5',
  name: 'Dr. John Oliver',
  role: 'Oncologist',
  company: 'Webora Themes',
  avatar: avatarG,
  status: 'success',
  phone: '+1 313-779-8134',
  phoneHref: '+13137798134',
  email: 'john.oliver@smartadminwebapp.com',
  address: '134 Gallery St, Detroit, MI, 46214, USA',
  tags: 'dr john oliver oncologist +13137798134 john.oliver@smartadminwebapp.com detroit'
}, {
  id: 'c_6',
  name: 'Sarah McBrook',
  role: 'Xray Division',
  company: 'Webora Themes',
  avatar: avatarH,
  status: 'success',
  phone: '+1 313-779-7613',
  phoneHref: '+13137797613',
  email: 'sarah.mcbrook@smartadminwebapp.com',
  address: '13 Jamie Rd, Detroit, MI, 48313, USA',
  tags: 'sarah mcbrook xray +13137797613 sarah.mcbrook@smartadminwebapp.com detroit'
}, {
  id: 'c_7',
  name: 'Jimmy Fellan',
  role: 'Accounting',
  company: 'Webora Themes',
  avatar: avatarI,
  status: 'success',
  phone: '+1 313-779-4314',
  phoneHref: '+13137794314',
  email: 'jimmy.fallan@smartadminwebapp.com',
  address: '55 Smyth Rd, Detroit, MI, 48341, USA',
  tags: 'jimmy fellan accounting +13137794314 jimmy.fallan@smartadminwebapp.com detroit'
}, {
  id: 'c_8',
  name: 'Arica Grace',
  role: 'Accounting',
  company: 'Webora Themes',
  avatar: avatarJ,
  status: 'success',
  phone: '+1 313-779-3347',
  phoneHref: '+13137793347',
  email: 'arica.grace@smartadminwebapp.com',
  address: '798 Smyth Rd, Detroit, MI, 48341, USA',
  tags: 'arica grace accounting +13137793347 arica.grace@smartadminwebapp.com detroit'
}];
const ContactDirectoryList = ({
  viewMode,
  filterText
}) => {
  const cleanedFilter = filterText.trim().toLowerCase();
  const [expandedContacts, setExpandedContacts] = useState({});
  const toggleExpand = id => {
    setExpandedContacts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const filteredContacts = contacts.filter(contact => {
    if (!cleanedFilter) return true;
    return contact.name.toLowerCase().includes(cleanedFilter) || contact.role.toLowerCase().includes(cleanedFilter) || contact.company.toLowerCase().includes(cleanedFilter) || contact.email.toLowerCase().includes(cleanedFilter) || contact.phone.includes(cleanedFilter) || contact.address.toLowerCase().includes(cleanedFilter);
  });
  if (filteredContacts.length === 0) {
    return <div className="text-center py-5 text-muted">
        <i className="fal fa-users-slash fs-xl mb-2 d-block" />
        No contacts match your filter criteria.
      </div>;
  }
  return <Row id="js-contacts">
      {filteredContacts.map(contact => {
      const xlVal = viewMode === 'table' ? 12 : 4;
      const mdVal = viewMode === 'table' ? 12 : 6;
      return <Col xl={xlVal} md={mdVal} key={contact.id} className="mb-g">
            <Card className="border shadow-0 h-100 shadow-sm-hover" data-filter-tags={contact.tags}>
              <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <span className={`status status-${contact.status} me-3`}>
                      <span className="rounded-circle profile-image d-block" style={{
                    backgroundImage: `url(${contact.avatar.src})`,
                    backgroundSize: 'cover',
                    width: '50px',
                    height: '50px'
                  }} />
                    </span>

                    <div className="info-card-text">
                      <Dropdown>
                        <DropdownToggle as={'a'} className="content-none fs-xl text-truncate text-truncate-lg d-inline-block align-middle fw-500 text-decoration-none" style={{
                      cursor: 'pointer'
                    }}>
                          {contact.name}
                          <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem href={`mailto:${contact.email}`}>Send Email</DropdownItem>
                          <DropdownItem href="#create-appointment">Create Appointment</DropdownItem>
                          <DropdownItem href="#block">Block User</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                      <span className="d-block text-truncate text-truncate-lg">
                        {contact.role}, {contact.company}.
                      </span>
                    </div>
                  </div>

                  {viewMode === 'table' && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleExpand(contact.id)}>
                      <i className={`fal ${expandedContacts[contact.id] ? 'fa-minus' : 'fa-plus'}`} />
                    </button>}
                </div>
              </CardBody>

              {(viewMode === 'grid' || viewMode === 'table' && expandedContacts[contact.id]) && <CardBody className="p-0 collapse show">
                  <div className="p-3">
                    <a href={`tel:${contact.phoneHref}`} className="mt-1 d-block fs-sm fw-400">
                      <i className="fal fa-mobile-alt text-muted me-2" />
                      {contact.phone}
                    </a>
                    <a href={`mailto:${contact.email}`} className="mt-1 d-block fs-sm fw-400">
                      <i className="fal fa-mouse-pointer text-muted me-2" />
                      {contact.email}
                    </a>
                    <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                      <i className="fal fa-map-pin me-2" />
                      {contact.address}
                    </address>
                  </div>
                </CardBody>}
            </Card>
          </Col>;
    })}
    </Row>;
};
export default ContactDirectoryList;