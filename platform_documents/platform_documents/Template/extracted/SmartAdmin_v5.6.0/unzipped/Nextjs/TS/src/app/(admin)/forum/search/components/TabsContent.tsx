'use client'
import Link from 'next/link'
import { Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from 'react-bootstrap'
import AllTabs from './AllTabs'
import ImagesTab from './ImagesTab'
import UserTab from './UserTab'

type TabsContentProps = {
  openModal: (index: number) => void
}

const TabsContent = ({ openModal }: TabsContentProps) => {
  return (
    <>
      <TabContainer defaultActiveKey={'all'}>
        <Nav className="nav-tabs nav-tabs-clean px-3 px-sm-5" role="tablist">
          <NavItem role="presentation">
            <NavLink eventKey={'all'} className="bg-transparent fs-lg fw-400">
              All
            </NavLink>
          </NavItem>
          <NavItem role="presentation">
            <NavLink eventKey={'images'} className="bg-transparent fs-lg fw-400">
              Image
            </NavLink>
          </NavItem>
          <NavItem role="presentation">
            <NavLink eventKey={'users'} className="bg-transparent fs-lg fw-400">
              Users
            </NavLink>
          </NavItem>
        </Nav>

        <div className="d-flex px-3 px-sm-5 py-4">
          <div>
            <span className="suggest-title text-danger fw-600 fs-lg">Did you mean?</span>
            <span className="suggestion px-1 fw-600 fst-italic text-decoration-underline link-offset-1 link-underline link-underline-opacity-75 fs-lg">
              SmartNav
            </span>
            <span className="suggestion px-1 fw-600 fst-italic text-decoration-underline link-offset-1 link-underline link-underline-opacity-75 fs-lg">
              SmartTables
            </span>
          </div>
        </div>

        <div className="px-3 px-sm-5 pb-4">
          <TabContent>
            <TabPane eventKey={'all'}>
              <AllTabs />
            </TabPane>

            <TabPane eventKey={'images'}>
              <ImagesTab openModal={openModal} />
            </TabPane>

            <TabPane eventKey={'users'}>
              <UserTab />
            </TabPane>
          </TabContent>

          <nav aria-label="Search results pages">
            <ul className="pagination my-4 justify-content-center">
              <li className="page-item">
                <Link className="page-link" href="" aria-label="Previous">
                  <span aria-hidden="true">First</span>
                </Link>
              </li>
              <li className="page-item active" aria-current="page">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  2
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  3
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  4
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  5
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  6
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="" aria-label="Next">
                  <span aria-hidden="true">Last</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </TabContainer>
    </>
  )
}

export default TabsContent
