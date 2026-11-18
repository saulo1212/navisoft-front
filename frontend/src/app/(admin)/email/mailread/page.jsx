'use client';

import { useCallback, useState } from 'react';
import ComposeMailModal from '../components/ComposeMailModal';
import EmailSidebar from '../components/EmailSidebar';
import EmailThread from './components/EmailThread';
const Page = () => {
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  const handleCompose = useCallback(() => {
    setShowComposeModal(true);
  }, []);
  return <>
      <div className="content-wrapper">
        <div className="main-content d-flex layout-trimmed">
          <div className="d-flex flex-grow-1 p-0 w-100">
            <EmailSidebar onComposeClick={handleCompose} isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <EmailThread toggleSidebar={toggleSidebar} onComposeClick={handleCompose} />
          </div>
          <ComposeMailModal show={showComposeModal} onHide={() => setShowComposeModal(false)} />
        </div>
      </div>
    </>;
};
export default Page;