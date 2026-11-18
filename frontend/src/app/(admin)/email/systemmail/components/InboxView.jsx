'use client';

import { basePath } from '@/helpers';
import { useCallback, useEffect, useState } from 'react';
const InboxView = ({
  toggleSidebar,
  onComposeClick
}) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatTime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const fetchMails = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const res = await fetch(`${baseUrl}/json/MOCK_MAIL.json`);
      if (!res.ok) {
        throw new Error('Failed to fetch mailbox data');
      }
      const data = await res.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchMails();
  }, [fetchMails]);
  return <>
      <div className="d-flex flex-column flex-grow-1 flex-0 overflow-x-auto">
        <div className="flex-grow-0">
          <div className="d-flex align-items-center ps-2 pe-3 py-3 ps-sm-3 pe-sm-3 py-sm-4 px-lg-4 py-lg-3 border-faded border-top-0 border-start-0 border-end-0 flex-shrink-0">
            <a type="button" onClick={toggleSidebar} className="ms-1 px-2 me-4 py-2 d-flex d-lg-none align-items-center justify-content-center btn">
              <i className="fas fa-ellipsis-v mb-0" />
            </a>

            <h2 className="mb-0">Inbox</h2>
            <div className="d-flex position-relative ms-auto" style={{
            maxWidth: '11rem'
          }}>
              <i className="fas fa-search position-absolute pos-left fs-lg px-3 py-2 mt-1" />
              <input type="text" className="form-control bg-subtlelight ps-6" placeholder="Filter emails" />
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center ps-3 pe-1 py-2 px-sm-4 border-bottom">
            <div className="flex-1 d-flex align-items-center gap-1">
              <div className="form-check form-check-hitbox me-1 me-lg-1 d-inline-block mb-0 position-relative">
                <input type="checkbox" className="form-check-input" id="js-msg-select-all" />
                <label className="form-check-label" htmlFor="js-msg-select-all" />
              </div>

              <button type="button" className="btn btn-icon rounded-circle" onClick={fetchMails}>
                <i className="fas fa-redo fs-md js-refresh" />
              </button>

              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-exclamation-circle fs-md js-spam" />
              </button>
              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-trash fs-md js-delete" />
              </button>
            </div>
            <div className="text-muted me-1 me-lg-3 ms-auto">
              {loading ? '0' : `1 - ${emails.length}`} <span className="hidden-lg-down"> of {emails.length} </span>
            </div>
            <div className="d-flex flex-wrap">
              <button type="button" className="btn waves-effect btn-icon rounded-circle">
                <i className="fas fa-chevron-left" />
              </button>
              <button type="button" className="btn waves-effect btn-icon rounded-circle">
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow-1 position-relative">
          <div className="position-absolute top-0 bottom-0 w-100 overflow-y-auto custom-scrollbar">
            {loading ? <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div> : <ul id="js-emails" className="notification">
                {emails.map(email => <li key={email.id} className={email.read ? '' : 'unread'}>
                    <div className="d-flex align-items-center px-3 px-sm-4 py-2 py-lg-0 height-4 height-mobile-auto gap-2">
                      <div className="form-check me-2 order-1 mb-0">
                        <input type="checkbox" className="form-check-input" id={`msg-${email.id}`} />
                        <label className="form-check-label" htmlFor={`msg-${email.id}`} />
                      </div>

                      <div className="d-flex align-self-center order-3 order-lg-2 me-lg-3 me-0 flex-shrink-0">
                        <svg className={`sa-icon sa-medium ${email.starred ? 'text-warning' : 'text-muted'}`} style={{
                    fill: email.starred ? 'currentColor' : 'none'
                  }}>
                          <use href={`${basePath}/icons/sprite.svg#star`} />
                        </svg>
                      </div>

                      <div className="d-flex flex-column flex-lg-row flex-grow-1 align-items-stretch order-2 order-lg-3" style={{
                  minWidth: 0
                }}>
                        <div className="mail-sender flex-shrink-0 align-self-start align-self-lg-center width-sm width-max-sm text-truncate fw-bold">
                          {email.sender}
                        </div>
                        <div className="d-flex flex-column flex-lg-row flex-grow-1 w-100 overflow-hidden">
                          <div className="mail-subject flex-shrink-0 align-self-start align-self-lg-center me-2 text-truncate width-max-100">
                            {email.subject}
                            {email.attachments.length > 0 && <i className="fas fa-paperclip ms-2 text-muted small" />}
                          </div>
                          <div className="d-flex align-items-center flex-grow-1 w-100 overflow-hidden">
                            <div className="mail-body d-block text-truncate w-100 pe-lg-6 text-muted">
                              <span className="hidden-sm">-</span> {email.bodyPreview}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="fs-sm text-muted ms-auto hide-on-hover-parent order-4 position-on-mobile-absolute pos-top pos-right mt-2 me-3 me-sm-4 mt-lg-0 me-lg-0 flex-shrink-0">
                        {formatTime(email.timestamp)}
                      </div>
                    </div>
                  </li>)}
              </ul>}
          </div>
        </div>
      </div>
    </>;
};
export default InboxView;