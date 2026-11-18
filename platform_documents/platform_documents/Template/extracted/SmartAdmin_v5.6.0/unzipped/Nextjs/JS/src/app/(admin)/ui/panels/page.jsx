import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Col, Row } from 'react-bootstrap';
import { ClosePanel, CollapsablePanel, CollapsedPanel, DefaultPanel, FormElements, FormInput, FullscreenPanel, IconPanel, InsertIcon, LabelPanel, MasterButton, PanelButtons, PanelColors, PanelPills, PanelTabs, RefreshPanel } from './components/Panels';
export const metadata = {
  title: 'Panels'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Panels'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Panels can be used in almost any situation, helping wrap everything in a slick & lightweight container.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Display data, tables, forms, or images effortlessly with our <strong>lightweight, clean, and highly customizable panels</strong>. Expand
              to fullscreen, collapse, or close as needed. Equiped with many <strong>interactive features</strong>, a versatile design, these panels
              adapt to your workflow seamlessly.&nbsp;
              <strong>Auto-save keeps your layout intact</strong>, while <strong>SortableJS</strong> lets you drag and organize panels seamlessly.
              Need to print? Just switch to fullscreen for a perfect view. All panels can be reset to their default state by clicking the button
              below.
            </p>
            <p className="m-0">
              <Button variant="outline-secondary" className="waves-effect">
                ↻ Reset Panel States
              </Button>
            </p>
          </div>
          <Row id="sortable-grid">
            <Col sm={12} md={6} xl={6}>
              <DefaultPanel />
              <CollapsedPanel />
              <CollapsablePanel />
              <FullscreenPanel />
              <ClosePanel />
              <PanelColors />
              <MasterButton />
            </Col>
            <Col sm={12} md={6} xl={6}>
              <LabelPanel />
              <FormElements />
              <FormInput />
              <PanelButtons />
              <PanelTabs />
              <PanelPills />
              <InsertIcon />
              <IconPanel />
              <RefreshPanel />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;