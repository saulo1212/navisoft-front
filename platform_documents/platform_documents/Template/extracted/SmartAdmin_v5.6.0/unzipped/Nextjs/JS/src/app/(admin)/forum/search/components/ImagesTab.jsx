'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import search from '@/assets/img/search/1.webp';
import search10 from '@/assets/img/search/10.webp';
import search11 from '@/assets/img/search/11.webp';
import search12 from '@/assets/img/search/12.webp';
import search13 from '@/assets/img/search/13.webp';
import search14 from '@/assets/img/search/14.webp';
import search15 from '@/assets/img/search/15.webp';
import search16 from '@/assets/img/search/16.webp';
import search17 from '@/assets/img/search/17.webp';
import search18 from '@/assets/img/search/18.webp';
import search2 from '@/assets/img/search/2.webp';
import search3 from '@/assets/img/search/3.webp';
import search4 from '@/assets/img/search/4.webp';
import search5 from '@/assets/img/search/5.webp';
import search6 from '@/assets/img/search/6.webp';
import search7 from '@/assets/img/search/7.webp';
import search8 from '@/assets/img/search/8.webp';
import search9 from '@/assets/img/search/9.webp';
const filterPills = ['chart', 'theme', 'layout', 'admin dashboard', 'bootstrap', 'app', 'header', 'awesome', 'responsive'];
export const imageData = [{
  src: search,
  title: 'SmartAdmin Dashboard',
  description: 'Modern and clean dashboard interface',
  date: '2023-07-15',
  source: 'smartadmin.com',
  category: 'Dashboard',
  dimensions: '394x222'
}, {
  src: search2,
  title: 'Analytics Overview',
  description: 'Comprehensive analytics and statistics panel',
  date: '2023-07-16',
  source: 'smartadmin.com',
  category: 'Analytics',
  dimensions: '394x222'
}, {
  src: search3,
  title: 'Form Components',
  description: 'UI components for building modern form interfaces',
  date: '2023-06-28',
  source: 'smartadmin.com',
  category: 'Forms',
  dimensions: '394x222'
}, {
  src: search4,
  title: 'Chart Library',
  description: 'Interactive data visualization charts and graphs',
  date: '2023-07-02',
  source: 'smartadmin.com',
  category: 'Charts',
  dimensions: '394x222'
}, {
  src: search5,
  title: 'Data Tables',
  description: 'Advanced data tables with sorting and filtering capabilities',
  date: '2023-06-18',
  source: 'smartadmin.com',
  category: 'Tables',
  dimensions: '394x222'
}, {
  src: search6,
  title: 'User Profile',
  description: 'User profile interface with stats and activity tracking',
  date: '2023-07-10',
  source: 'smartadmin.com',
  category: 'UI Components',
  dimensions: '394x222'
}, {
  src: search7,
  title: 'Calendar View',
  description: 'Interactive calendar with event scheduling and reminders',
  date: '2023-06-24',
  source: 'smartadmin.com',
  category: 'UI Components',
  dimensions: '394x222'
}, {
  src: search8,
  title: 'Message Center',
  description: 'Messaging interface with chat and notification system',
  date: '2023-07-05',
  source: 'smartadmin.com',
  category: 'Communication',
  dimensions: '394x222'
}, {
  src: search9,
  title: 'File Manager',
  description: 'Document management system with cloud storage integration',
  date: '2023-06-30',
  source: 'smartadmin.com',
  category: 'Utilities',
  dimensions: '394x222'
}, {
  src: search10,
  title: 'Authentication Screen',
  description: 'Secure login and registration interface with multi-factor authentication',
  date: '2023-07-08',
  source: 'smartadmin.com',
  category: 'Security',
  dimensions: '394x222'
}, {
  src: search11,
  title: 'Settings Panel',
  description: 'Comprehensive system settings with user preferences',
  date: '2023-06-22',
  source: 'smartadmin.com',
  category: 'UI Components',
  dimensions: '394x222'
}, {
  src: search12,
  title: 'Project Dashboard',
  description: 'Project management interface with task tracking',
  date: '2023-07-12',
  source: 'smartadmin.com',
  category: 'Project Management',
  dimensions: '394x222'
}, {
  src: search13,
  title: 'Alert System',
  description: 'Notification and alert management console',
  date: '2023-06-25',
  source: 'smartadmin.com',
  category: 'UI Components',
  dimensions: '394x222'
}, {
  src: search14,
  title: 'E-commerce Dashboard',
  description: 'Sales and inventory management dashboard',
  date: '2023-07-03',
  source: 'smartadmin.com',
  category: 'E-commerce',
  dimensions: '394x222'
}, {
  src: search15,
  title: 'Video Player',
  description: 'Custom video player with streaming capabilities',
  date: '2023-06-29',
  source: 'smartadmin.com',
  category: 'Media',
  dimensions: '394x222'
}, {
  src: search16,
  title: 'Color Palette',
  description: 'Customizable color scheme manager for theming',
  date: '2023-07-14',
  source: 'smartadmin.com',
  category: 'Design',
  dimensions: '394x222'
}, {
  src: search17,
  title: 'Responsive Layout',
  description: 'Multi-device compatible grid system and layouts',
  date: '2023-07-01',
  source: 'smartadmin.com',
  category: 'Layout',
  dimensions: '394x222'
}, {
  src: search18,
  title: 'Icon Library',
  description: 'Comprehensive collection of vector icons and graphics',
  date: '2023-06-20',
  source: 'smartadmin.com',
  category: 'Design',
  dimensions: '394x222'
}];
const ImagesTab = ({
  openModal
}) => {
  return <>
      <div className="py-2">
        <div className="scrolling-wrapper gap-2">
          {filterPills.map((pill, index) => <Link key={index} href="" className="btn btn-pills btn-outline-secondary flex-shrink-0 d-inline-block js-waves-off">
              {pill}
            </Link>)}
        </div>
      </div>

      <Row>
        {imageData.map((item, index) => <Col key={index} xs={6} sm={4} md={4} lg={3} xl={2} className="py-2 px-2">
            <div style={{
          cursor: 'pointer'
        }} className="position-relative show-child-on-hover d-block shadow-hover" onClick={() => openModal(index)}>
              <div className="position-absolute top-0 start-0 end-0 bottom-0 show-on-hover-parent">
                <div className="position-absolute top-0 bottom-0 start-0 end-0 opacity-20 bg-primary-500 rounded" />
                <div className="position-absolute py-1 px-2 m-2 pos-bottom pos-right bg-primary text-white rounded opacity-90">
                  <small>{item.dimensions}</small>
                </div>
                <div className="position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center text-white">
                  <i className="sa sa-plus display-2 m-0 opacity-90" />
                </div>
              </div>
              <Image src={item.src} alt={item.title} className="img-thumbnail" />
            </div>
          </Col>)}
      </Row>
    </>;
};
export default ImagesTab;