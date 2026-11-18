import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
const DraggableEvent = () => {
  return <>
      <Card className="mt-3">
        <CardHeader>
          <CardTitle as={'h5'} className="mb-0">
            Draggable Events
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div id="external-events">
            <p className="text-muted small">Drag these events to the calendar</p>
            <div className="external-event p-2 mb-2 rounded bg-primary text-white" data-description="Regular check-in with team members" data-location="Meeting Room 1" data-category="meeting">
              Team Standup
            </div>
            <div className="external-event p-2 mb-2 rounded bg-success text-white" data-description="Time to breathe and recharge" data-location="Break Room">
              Coffee Break
            </div>
            <div className="external-event p-2 mb-2 rounded bg-warning text-dark" data-description="One-on-one with supervisor" data-location="Manager's Office" data-category="meeting">
              Performance Review
            </div>
            <div className="external-event p-2 mb-2 rounded bg-danger text-white" data-description="Time blocked for focusing on deliverables" data-location="Personal Workspace" data-category="task">
              Focus Time
            </div>
            <div className="external-event p-2 mb-2 rounded bg-info text-white">Lunch</div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="removeAfterDrop" />
              <label className="form-check-label" htmlFor="removeAfterDrop">
                Remove after drop
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </>;
};
export default DraggableEvent;