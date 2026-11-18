'use client';

import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import ContactDirectoryList from './components/ContactDirectoryList';
import NotesPanel from './components/NotesPanel';
const Page = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterText, setFilterText] = useState('');
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'User Contact'} subTitle1={'Communication'} subTitle2={'SmartAdmin'} subText="User Contact page with notes." />

        <div className="main-content">
          <Row>
            <Col xl={12}>
              <div className="border-faded bg-faded p-3 mb-g d-flex">
                <div className="position-relative flex-grow-1">
                  <input type="text" id="js-filter-contacts" name="filter-contacts" className="form-control shadow-inset-2 form-control-lg" placeholder="Filter contacts by name, email, phone or location" value={filterText} onChange={e => setFilterText(e.target.value)} />
                  <button id="js-clear-filter" type="button" onClick={() => setFilterText('')} className={`btn btn-sm btn-danger position-absolute top-50 end-0 translate-middle-y me-2 ${filterText ? 'd-block' : 'd-none'}`}>
                    <i className="fal fa-times" />
                  </button>
                </div>

                <div className="btn-group btn-group-lg hidden-lg-down ms-3" role="group" aria-label="Change list & grid view">
                  <button type="button" className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                    <i className="fal fa-table" />
                  </button>
                  <button type="button" className={`btn btn-outline-secondary ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                    <i className="fal fa-th-list" />
                  </button>
                </div>
              </div>
              <div id="filter-result-counter" className="ms-auto fs-sm text-muted mb-g" />
            </Col>
          </Row>

          <ContactDirectoryList viewMode={viewMode} filterText={filterText} />
        </div>
      </div>
      <NotesPanel />
    </>;
};
export default Page;