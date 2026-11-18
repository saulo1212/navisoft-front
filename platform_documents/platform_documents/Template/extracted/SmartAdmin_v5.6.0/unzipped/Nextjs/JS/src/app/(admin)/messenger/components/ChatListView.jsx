import avatara from '@/assets/img/demo/avatars/avatar-a.png';
import avatarb from '@/assets/img/demo/avatars/avatar-b.png';
import avatarc from '@/assets/img/demo/avatars/avatar-c.png';
import avatard from '@/assets/img/demo/avatars/avatar-d.png';
import avatarh from '@/assets/img/demo/avatars/avatar-h.png';
import avatarj from '@/assets/img/demo/avatars/avatar-j.png';
import avatark from '@/assets/img/demo/avatars/avatar-k.png';
import avatarm from '@/assets/img/demo/avatars/avatar-m.png';
import { basePath } from '@/helpers';
import Link from 'next/link';
const ChatListView = ({
  isOpen,
  onClose
}) => {
  return <>
      <div style={{
      '--sidepanel-width': '20rem'
    }} id="js-slide-right" className={`flex-wrap flex-shrink-0 position-relative slide-on-mobile slide-on-mobile-right border-faded border-end-0 border-top-0 border-bottom-0 h-100 ${isOpen ? 'slide-on-mobile-right-show' : ''}`}>
        <div className="d-flex flex-column h-100">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="px-3 pt-3 fw-semi-bold">Stories</h6>
            <button type="button" className="btn-close d-lg-none align-items-center" onClick={onClose} aria-label="Close menu" />
          </div>

          <div className="p-3">
            <div className="d-flex gap-2 overflow-auto pb-2 story-scroll">
              <div className="story-circle has-story text-center">
                <span className="rounded-circle profile-image d-block position-relative" style={{
                backgroundImage: `url(${avatard.src})`,
                backgroundSize: 'cover'
              }} />
                <span className="fs-nano">Emily</span>
              </div>
              <div className="story-circle has-story text-center">
                <span className="rounded-circle profile-image d-block position-relative" style={{
                backgroundImage: `url(${avatara.src})`,
                backgroundSize: 'cover'
              }} />
                <span className="fs-nano">Rose</span>
              </div>
              <div className="story-circle text-center">
                <span className="rounded-circle profile-image d-block position-relative" style={{
                backgroundImage: `url(${avatarj.src})`,
                backgroundSize: 'cover'
              }} />
                <span className="fs-nano">Martha</span>
              </div>
              <div className="story-circle has-story text-center">
                <span className="rounded-circle profile-image d-block position-relative" style={{
                backgroundImage: `url(${avatark.src})`,
                backgroundSize: 'cover'
              }} />
                <span className="fs-nano">Kevin</span>
              </div>
              <div className="story-circle text-center">
                <span className="rounded-circle profile-image d-block position-relative" style={{
                backgroundImage: `url(${avatarb.src})`,
                backgroundSize: 'cover'
              }} />
                <span className="fs-nano">Oliver</span>
              </div>
              <div className="story-circle text-center">
                <span className="rounded-circle profile-image d-block position-relative" style={{
                backgroundImage: `url(${avatarc.src})`,
                backgroundSize: 'cover'
              }} />
                <span className="fs-nano">Sara</span>
              </div>
            </div>
          </div>
          <h6 className="px-3 py-2 fw-semi-bold">Conversations</h6>

          <div className="p-3 pt-0">
            <input type="text" className="form-control" placeholder="Search messages..." aria-label="Search" />
          </div>
          <div className="flex-grow-1 position-relative overflow-x-auto custom-scroll">
            <div className="list-group list-group-flush px-3 gap-1 position-absolute w-100 top-0 bottom-0">
              <Link href="" className="list-group-item list-group-item-action active px-3 py-2 m-0">
                <div className="d-flex">
                  <div className="me-2 align-self-center">
                    <span className="rounded-circle profile-image profile-image-md d-block position-relative status status-success status-sm" style={{
                    backgroundImage: `url(${avatarb.src})`,
                    backgroundSize: 'cover'
                  }}></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0 text-truncate fw-semi-bold">Oliver Kopyov</p>
                      <small className="text-muted">now</small>
                    </div>
                    <p className="mb-0 text-truncate small text-muted">I'm definitely in!</p>
                  </div>
                </div>
              </Link>
              <Link href="" className="list-group-item list-group-item-action px-3 py-2 m-0">
                <div className="d-flex w-100">
                  <div className="me-2 align-self-center">
                    <span className="rounded-circle profile-image profile-image-md d-block position-relative status status-success status-sm" style={{
                    backgroundImage: `url(${avatarh.src})`,
                    backgroundSize: 'cover'
                  }}></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0 text-truncate fw-500">101 Study Group</p>
                      <small className="text-muted">9m</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-truncate small fw-600">Kelly sent a sticker</p>
                      <span className="unread-badge">1</span>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="" className="list-group-item list-group-item-action px-3 py-2 m-0">
                <div className="d-flex w-100">
                  <div className="me-2 align-self-center">
                    <span className="rounded-circle profile-image profile-image-md d-block position-relative status status-danger status-sm" style={{
                    backgroundImage: `url(${avatarc.src})`,
                    backgroundSize: 'cover'
                  }}></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0 text-truncate">Amy Warrell</p>
                      <small className="text-muted">37m</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-truncate small" style={{
                      color: '#fa5c7c'
                    }}>
                        Missed Call
                      </p>
                      <svg className="sa-icon sa-icon-sm" style={{
                      color: '#fa5c7c'
                    }}>
                        <use href={`${basePath}/icons/sprite.svg#phone`} />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="" className="list-group-item list-group-item-action px-3 py-2 m-0">
                <div className="d-flex w-100">
                  <div className="me-2 align-self-center">
                    <span className="rounded-circle profile-image profile-image-md d-block position-relative status status-sm" style={{
                    backgroundImage: `url(${avatarm.src})`,
                    backgroundSize: 'cover'
                  }}></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0 text-truncate">Loren Newton</p>
                      <small className="text-muted">8:24am</small>
                    </div>
                    <p className="mb-0 text-truncate small text-muted">See you soon!</p>
                  </div>
                </div>
              </Link>
              <Link href="" className="list-group-item list-group-item-action px-3 py-2 m-0">
                <div className="d-flex w-100">
                  <div className="me-2 align-self-center">
                    <span className="rounded-circle profile-image profile-image-md d-block position-relative status status-sm" style={{
                    backgroundImage: `url(${avatarh.src})`,
                    backgroundSize: 'cover'
                  }}></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0 text-truncate">Super Surfers</p>
                      <small className="text-muted">Mon</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-truncate small text-muted">Tomorrow is great!</p>
                      <div className="d-flex position-relative height-2">
                        <span className="rounded-circle profile-image profile-image-sm position-absolute end-0 me-n2 me-0 border border-white" style={{
                        backgroundImage: `url(${avatara.src})`,
                        backgroundSize: 'cover'
                      }} />
                        <span className="rounded-circle profile-image profile-image-sm position-absolute end-0 me-n2 me-3 border border-white" style={{
                        backgroundImage: `url(${avatarb.src})`,
                        backgroundSize: 'cover'
                      }} />
                        <span className="rounded-circle profile-image profile-image-sm position-absolute end-0 me-5 border border-white" style={{
                        backgroundImage: `url(${avatarc.src})`,
                        backgroundSize: 'cover'
                      }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="" className="list-group-item list-group-item-action px-3 py-2 m-0">
                <div className="d-flex w-100">
                  <div className="me-2 align-self-center">
                    <span className="rounded-circle profile-image profile-image-md d-block position-relative status status-sm" style={{
                    backgroundImage: `url(${avatark.src})`,
                    backgroundSize: 'cover'
                  }}></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0 text-truncate">Rodolfo &amp; Leon</p>
                      <small className="text-muted">Tue</small>
                    </div>
                    <p className="mb-0 text-truncate small text-muted">The proposal looks amazing!</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="slide-backdrop" data-action="toggle-swap" data-toggleclass="slide-on-mobile-right-show" data-target="#js-slide-right" />
    </>;
};
export default ChatListView;