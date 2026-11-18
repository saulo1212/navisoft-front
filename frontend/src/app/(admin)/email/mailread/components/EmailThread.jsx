'use client';

import admin from '@/assets/img/demo/avatars/avatar-admin.png';
import avatarC from '@/assets/img/demo/avatars/avatar-c.png';
import thumbs12 from '@/assets/img/thumbs/pic-12.png';
import thumbs7 from '@/assets/img/thumbs/pic-7.png';
import thumbs8 from '@/assets/img/thumbs/pic-8.png';
import { basePath } from '@/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const EmailThread = ({
  toggleSidebar,
  onComposeClick
}) => {
  const [files, setFiles] = useState([{
    id: '1',
    name: 'security_codes.pdf'
  }, {
    id: '2',
    name: 'agreement.pdf'
  }]);
  const handleRemoveFile = id => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };
  if (files.length === 0) return null;
  return <>

      <div className="d-flex flex-column flex-grow-1 flex-0 overflow-x-auto">
        <div className="flex-grow-0">
          <div className="d-flex flex-wrap align-items-center ps-2 pe-1 ps-sm-2 py-2 px-sm-4 border border-top-0 border-start-0 border-end-0">
            <div className="flex-1 d-flex align-items-center gap-1">
              <Link href="/email/systemmail" className="btn btn-icon rounded-circle me-2 me-lg-2">
                <i className="fas fa-arrow-left fs-lg" />
              </Link>
              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-redo fs-md" />
              </button>
              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-exclamation-circle fs-md" />
              </button>
              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-trash fs-md" />
              </button>
            </div>
            <div className="text-muted me-1 me-lg-3 ms-auto hidden-mobile">
              1 - 50 <span className="hidden-lg-down"> of 135 </span>
            </div>
            <div className="d-flex flex-wrap hidden-mobile">
              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-chevron-left" />
              </button>
              <button type="button" className="btn btn-icon rounded-circle">
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center ps-2 pe-3 py-3 ps-sm-3 pe-sm-4 py-sm-4 pe-lg-4 px-lg-6 py-lg-3 flex-shrink-0 gap-2">
          <button onClick={toggleSidebar} type="button" className="pl-3 pr-3 py-2 d-flex d-lg-none align-items-center justify-content-center btn waves-effect waves-themed" data-action="toggle-swap" data-toggleclass="slide-on-mobile-left-show" data-target="#js-slide-left">
            <i className="fal fa-ellipsis-v h1 mb-0 " />
          </button>

          <h5 className="mb-0 ms-1 ms-lg-3 me-auto"> Re: New security codes </h5>
          <span className="badge bg-primary hidden-mobile align-self-center">INBOX</span>
          <div className="d-flex position-relative">
            <a href="#" title="starred" className="btn btn-icon rounded-circle fs-lg">
              <svg className="sa-icon sa-medium">
                <use href={`${basePath}/icons/sprite.svg#star`} />
              </svg>
            </a>
            <a href="" className="btn btn-icon rounded-circle fs-lg" data-bs-toggle="collapse" data-bs-target=".js-collapse" aria-expanded="true">
              <i className="fas fa-arrows-v" />
            </a>
            <button type="button" className="btn btn-icon rounded-circle fs-lg hidden-mobile">
              <i className="fas fa-print" />
            </button>
          </div>
        </div>
        <div className="flex-grow-1 position-relative">
          <div id="msg-01" className="d-flex flex-column border-faded border-top-0 border-end-0 border-start-0 py-3 px-3 px-sm-4 px-lg-0 me-0 me-lg-4 flex-shrink-0">
            <div className="d-flex align-items-center flex-row">
              <div className="ms-0 me-3 mx-lg-3">
                <Image src={avatarC} className="profile-image profile-image-md rounded-circle" alt="Melissa Ayre" />
              </div>
              <div className="fw-500 flex-grow-1 flex-shrink-0 d-flex flex-column cursor-pointer" aria-expanded="true" data-bs-toggle="collapse" data-bs-target="#msg-01 > .js-collapse">
                <div className="fs-lg">
                  Melissa Ayre <span className="fs-nano text-muted opacity-75 fw-400 text-truncate width-xs">&lt;melissaa@example.com&gt;</span>
                </div>
                <div className="fs-nano text-muted opacity-75"> to Me</div>
              </div>
              <div className="text-muted fs-sm ">
                1:00 AM <span className="hidden-mobile">(12 hours ago)</span>
              </div>
              <div className="collapsed-reveal">
                <a href="" className="btn btn-icon fs-lg rounded-circle waves-effect waves-themed">
                  <i className="fal fa-reply" />
                </a>
              </div>
            </div>
            <div className="js-collapse collapse show">
              <div className="ps-lg-3 ms-lg-6 pt-3 pb-4 fs-md">
                We've taken customer feedback on board and are pleased to announce that the the industry's most recommended and secure option for
                Two-Factor Authentication (2FA) is now available to use on our site. So, if you've tried our previous 2FA methods and have not been
                convinced, why not try our new Time-Based One-Time Password (TOTP)? It's super easy to use, and it works with many third-party 2FA
                apps you might already have on your phone. We're positive you'll love the new improved experience.
              </div>
              <div className="ps-lg-3 ms-lg-6 pt-3 pb-4">
                <i className="fs-sm text-muted">Attachments:</i>
                <div className="d-flex flex-wrap align-items-center gap-2 py-3 position-relative">
                  {files.map(file => <div key={file.id} className="alert m-0 p-0 badge bg-primary-50 border-primary ps-2 d-flex align-items-center text-primary" style={{
                  transform: 'none',
                  transition: 'none'
                }}>
                      <span className="pe-1">{file.name}</span>
                      <button type="button" onClick={() => handleRemoveFile(file.id)} className="btn btn-icon btn-xs ms-1 rounded-0 border border-primary border-top-0 border-bottom-0 border-end-0 waves-effect" aria-label={`Remove ${file.name}`}>
                        <i className="fas fa-times text-primary" />
                      </button>
                    </div>)}

                  <a href="#" className="fs-xs text-secondary text-decoration-none">
                    show 3 more
                  </a>
                </div>
                <div className="fs-sm d-flex align-items-center gap-2">
                  <a href="#" title="Cell A-0012">
                    <span className="d-block img-share" style={{
                    backgroundImage: `url(${thumbs7.src})`,
                    backgroundSize: 'cover'
                  }} />
                  </a>
                  <a href="#" title="Patient A-473 saliva">
                    <span className="d-block img-share" style={{
                    backgroundImage: `url(${thumbs8.src})`,
                    backgroundSize: 'cover'
                  }} />
                  </a>
                  <a href="#" title="Patient A-473 Membrane O.C">
                    <span className="d-block img-share" style={{
                    backgroundImage: `url(${thumbs12.src})`,
                    backgroundSize: 'cover'
                  }} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="msg-02" className="d-flex flex-column border-faded border-top-0 border-end-0 border-start-0 py-3 px-3 px-sm-4 px-lg-0 me-0 me-lg-4 flex-shrink-0">
            <div className="d-flex align-items-center flex-row">
              <div className="ms-0 me-3 mx-lg-3">
                <Image src={admin} className="profile-image profile-image-md rounded-circle" alt="Sunny A." />
              </div>
              <div className="fw-500 flex-grow-1 flex-shrink-0 d-flex flex-column cursor-pointer" aria-expanded="true" data-bs-toggle="collapse" data-bs-target="#msg-02 > .js-collapse">
                <div className="fs-lg">
                  Sunny A. <span className="fs-nano text-muted opacity-75 fw-400 text-truncate width-xs">me</span>
                </div>
                <div className="fs-nano text-muted opacity-75"> to &lt;melissa.ayre@getwebora.com&gt;</div>
              </div>
              <div className="text-muted fs-sm ">
                1:00 AM <span className="hidden-mobile">(12 hours ago)</span>
              </div>
              <div className="collapsed-reveal">
                <a href="" className="btn btn-icon fs-lg rounded-circle waves-effect waves-themed">
                  <i className="fal fa-reply" />
                </a>
              </div>
            </div>
            <div className="js-collapse collapse show">
              <div className="ps-lg-3 ms-lg-6 pt-3 pb-4 fs-md">
                We've taken customer feedback on board and are pleased to announce that the the industry's most recommended and secure option for
                Two-Factor Authentication (2FA) is now available to use on our site. So, if you've tried our previous 2FA methods and have not been
                convinced, why not try our new Time-Based One-Time Password (TOTP)? It's super easy to use, and it works with many third-party 2FA
                apps you might already have on your phone. We're positive you'll love the new improved experience.
                <br />
                <br />
                Best,
                <br />
                <span className="fw-500 fs-lg d-block l-h-n">Sunny A.</span>
                <span className="fw-400 fs-nano d-block l-h-n mb-1">Software Engineer</span>
                <br />
                <br />
                <div className="text-muted fs-nano">
                  PRIVATE AND CONFIDENTIAL. This e-mail, its contents and attachments are private and confidential and is intended for the recipient
                  only. Any disclosure, copying or unauthorized use of such information is prohibited. If you receive this message in error, please
                  notify us immediately and delete the original and any copies and attachments.
                </div>
              </div>
            </div>
          </div>
          <div id="msg-03" className="d-flex flex-column border-faded border-top-0 border-end-0 border-start-0 py-3 px-3 px-sm-4 px-lg-0 me-0 me-lg-4 flex-shrink-0">
            <div className="d-flex align-items-center flex-row">
              <div className="ms-0 me-3 mx-lg-3">
                <Image src={avatarC} className="profile-image profile-image-md rounded-circle" alt="Melissa Ayre" />
              </div>
              <div className="fw-500 flex-grow-1 flex-shrink-0 d-flex flex-column cursor-pointer" aria-expanded="true" data-bs-toggle="collapse" data-bs-target="#msg-03 > .js-collapse">
                <div className="fs-lg">
                  Melissa Ayre <span className="fs-nano text-muted opacity-75 fw-400 text-truncate width-xs">&lt;melissaa@example.com&gt;</span>
                </div>
                <div className="fs-nano text-muted opacity-75"> to Me</div>
              </div>
              <div className="text-muted fs-sm ">
                1:00 AM <span className="hidden-mobile">(12 hours ago)</span>
              </div>
              <div className="collapsed-reveal">
                <a href="" className="btn btn-icon fs-lg rounded-circle waves-effect waves-themed">
                  <i className="fal fa-reply" />
                </a>
              </div>
            </div>
            <div className="js-collapse collapse show">
              <div className="ps-lg-3 ms-lg-6 pt-3 pb-4 fs-md">
                We've taken customer feedback on board and are pleased to announce that the the industry's most recommended and secure option for
                Two-Factor Authentication (2FA) is now available to use on our site. So, if you've tried our previous 2FA methods and have not been
                convinced, why not try our new Time-Based One-Time Password (TOTP)? It's super easy to use, and it works with many third-party 2FA
                apps you might already have on your phone. We're positive you'll love the new improved experience.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default EmailThread;