import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { DelayedTooltip, OffsetTooltip, TemplatingTooltip, TooltipAnimation, Tooltipbasics, TooltipContainer, TooltipPlacement, TriggersTooltip } from './components/Tooltip';
export const metadata = {
  title: 'Tooltips'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Tooltips'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Bootstrap tooltips are small pop-up messages that appear when users hover over or focus on an element, providing additional information.'} />
        <div className="main-content">
          <Row>
            <Col xl={6}>
              <Tooltipbasics />
              <TooltipPlacement />
              <TooltipAnimation />
              <TooltipContainer />
              <DelayedTooltip />
            </Col>
            <Col xl={6}>
              <TemplatingTooltip />
              <TriggersTooltip />
              <OffsetTooltip />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;