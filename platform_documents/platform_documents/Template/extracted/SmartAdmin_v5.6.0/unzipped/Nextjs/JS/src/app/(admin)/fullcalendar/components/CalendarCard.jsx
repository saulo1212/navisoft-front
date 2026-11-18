'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormControl, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
import { eventCategories, eventData } from './data';
import DraggableEvent from './DraggableEvent';
const CalendarCard = () => {
  const [events, setEvents] = useState(() => {
    return eventData.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      backgroundColor: e.backgroundColor,
      borderColor: e.borderColor,
      description: e.description,
      location: e.location,
      category: e.category || 'general'
    }));
  });
  const [categories, setCategories] = useState(eventCategories);
  const [selectedCategories, setSelectedCategories] = useState(eventCategories.map(c => c.id));
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventAllDay, setEventAllDay] = useState(false);
  const [eventCategory, setEventCategory] = useState('general');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('var(--primary-500)');
  const calendarRef = useRef(null);
  useEffect(() => {
    const draggableEl = document.getElementById('external-events');
    if (draggableEl) {
      const draggable = new Draggable(draggableEl, {
        itemSelector: '.external-event',
        eventData: eventEl => {
          const bg = eventEl.getAttribute('data-bg') || 'var(--primary-500)';
          const category = eventEl.getAttribute('data-category') || 'general';
          return {
            title: eventEl.innerText,
            backgroundColor: bg,
            borderColor: bg,
            extendedProps: {
              category: category,
              description: eventEl.getAttribute('data-description') || '',
              location: eventEl.getAttribute('data-location') || ''
            }
          };
        }
      });
      return () => draggable.destroy();
    }
  }, []);
  const handleDateSelect = selectInfo => {
    setEventTitle('');
    setEventStart(selectInfo.startStr.slice(0, 16));
    setEventEnd(selectInfo.endStr ? selectInfo.endStr.slice(0, 16) : '');
    setEventAllDay(selectInfo.allDay);
    setEventCategory('general');
    setEventDescription('');
    setEventLocation('');
    setSelectedEvent({
      id: '',
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    });
    setShowEventModal(true);
  };
  const handleEventClick = clickInfo => {
    const ev = clickInfo.event;
    const cat = ev.extendedProps.category || 'general';
    setEventTitle(ev.title);
    setEventStart(ev.startStr ? ev.startStr.slice(0, 16) : '');
    setEventEnd(ev.endStr ? ev.endStr.slice(0, 16) : '');
    setEventAllDay(ev.allDay);
    setEventCategory(cat);
    setEventDescription(ev.extendedProps.description || '');
    setEventLocation(ev.extendedProps.location || '');
    setSelectedEvent({
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr || undefined,
      allDay: ev.allDay,
      backgroundColor: ev.backgroundColor,
      borderColor: ev.borderColor,
      description: ev.extendedProps.description,
      location: ev.extendedProps.location,
      category: cat
    });
    setShowEventModal(true);
  };
  const handleEventReceive = info => {
    const cat = info.event.extendedProps.category || 'general';
    const newEvent = {
      id: Date.now().toString(),
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr || undefined,
      allDay: info.event.allDay,
      backgroundColor: info.event.backgroundColor,
      borderColor: info.event.borderColor,
      description: info.event.extendedProps.description || '',
      location: info.event.extendedProps.location || '',
      category: cat
    };
    setEvents(prev => [...prev, newEvent]);
    info.event.remove();
  };
  const handleSaveEvent = e => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    const catObj = categories.find(c => c.id === eventCategory);
    const color = catObj ? catObj.color : 'var(--primary-500)';
    if (selectedEvent && selectedEvent.id) {
      setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? {
        ...ev,
        title: eventTitle,
        start: eventStart,
        end: eventEnd || undefined,
        allDay: eventAllDay,
        category: eventCategory,
        backgroundColor: color,
        borderColor: color,
        description: eventDescription,
        location: eventLocation
      } : ev));
    } else {
      const newEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStart,
        end: eventEnd || undefined,
        allDay: eventAllDay,
        category: eventCategory,
        backgroundColor: color,
        borderColor: color,
        description: eventDescription,
        location: eventLocation
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowEventModal(false);
  };
  const handleDeleteEvent = () => {
    if (selectedEvent && selectedEvent.id) {
      setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
    }
    setShowDeleteModal(false);
    setShowEventModal(false);
  };
  const handleAddCategory = e => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const id = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCat = {
      id,
      name: newCategoryName.trim(),
      color: newCategoryColor
    };
    setCategories(prev => [...prev, newCat]);
    setSelectedCategories(prev => [...prev, id]);
    setNewCategoryName('');
  };
  const handleDeleteCategory = catId => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    setSelectedCategories(prev => prev.filter(id => id !== catId));
  };
  const toggleCategoryFilter = catId => {
    setSelectedCategories(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]);
  };
  const handleToggleAllFilters = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id));
    }
  };
  const handleExportEvents = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'calendar-events.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
  const handleImportEvents = e => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = event => {
        try {
          const parsed = JSON.parse(event.target?.result);
          if (Array.isArray(parsed)) {
            setEvents(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      };
    }
  };
  const filteredEvents = events.filter(e => {
    if (!e.category) return true;
    return selectedCategories.includes(e.category);
  });
  return <>
      <Row className="mb-4">
        <Col lg={8} xl={9}>
          <Card>
            <CardBody>
              <FullCalendar ref={calendarRef} plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]} initialView="dayGridMonth" headerToolbar={{
              left: 'title',
              right: 'today prev,next'
            }} footerToolbar={{
              left: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }} buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              list: 'List'
            }} editable={true} droppable={true} selectable={true} selectMirror={true} dayMaxEvents={true} weekends={true} events={filteredEvents} select={handleDateSelect} eventClick={handleEventClick} eventReceive={handleEventReceive} />
            </CardBody>
          </Card>
        </Col>

        <Col lg={4} xl={3}>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Actions
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="outline-primary" size="sm" className="waves-effect" id="manageCategoriesBtn" onClick={() => setShowCategoryModal(true)}>
                  Manage Categories
                </Button>
                <Button variant="outline-primary" size="sm" className="waves-effect" id="exportEvents" onClick={handleExportEvents}>
                  Export Events
                </Button>
                <label className="btn btn-outline-primary btn-sm mb-0" htmlFor="importEvents">
                  Import Events
                </label>
                <input type="file" id="importEvents" accept=".json" className="d-none" onChange={handleImportEvents} />
              </div>
            </CardBody>
          </Card>

          <DraggableEvent />

          <Card className="mt-3">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h5'} className="mb-0">
                Filter by Category
              </CardTitle>
              <Button variant="link" className="btn-xs p-0 text-decoration-none" onClick={handleToggleAllFilters}>
                All
              </Button>
            </CardHeader>
            <CardBody>
              <div id="category-filters">
                {categories.map(cat => <div key={cat.id} className="form-check d-flex align-items-center mb-2">
                    <input type="checkbox" className="form-check-input me-2" id={`filter-${cat.id}`} checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategoryFilter(cat.id)} />
                    <span className="rounded-circle me-2" style={{
                  backgroundColor: cat.color,
                  width: '8px',
                  height: '8px',
                  display: 'inline-block'
                }} />
                    <label className="form-check-label small" htmlFor={`filter-${cat.id}`}>
                      {cat.name}
                    </label>
                  </div>)}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} centered>
        <ModalHeader closeButton>
          <ModalTitle as="h5">Event Details</ModalTitle>
        </ModalHeader>
        <Form onSubmit={handleSaveEvent}>
          <ModalBody>
            <div className="mb-3">
              <FormLabel>Event Title</FormLabel>
              <FormControl type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required />
            </div>
            <Row>
              <Col md={6} className="mb-3">
                <FormLabel>Start</FormLabel>
                <input type="datetime-local" className="form-control" value={eventStart} onChange={e => setEventStart(e.target.value)} required />
              </Col>
              <Col md={6} className="mb-3">
                <FormLabel>End</FormLabel>
                <input type="datetime-local" className="form-control" value={eventEnd} onChange={e => setEventEnd(e.target.value)} />
              </Col>
            </Row>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="eventAllDay" checked={eventAllDay} onChange={e => setEventAllDay(e.target.checked)} />
              <label className="form-check-label" htmlFor="eventAllDay">
                All Day
              </label>
            </div>
            <div className="mb-3">
              <FormLabel>Category</FormLabel>
              <FormSelect value={eventCategory} onChange={e => setEventCategory(e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>
                    {c.name}
                  </option>)}
              </FormSelect>
            </div>
            <div className="mb-3">
              <FormLabel>Description</FormLabel>
              <textarea className="form-control" value={eventDescription} onChange={e => setEventDescription(e.target.value)} rows={3} />
            </div>
            <div className="mb-3">
              <FormLabel>Location</FormLabel>
              <FormControl type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} />
            </div>
          </ModalBody>
          <ModalFooter>
            {selectedEvent && selectedEvent.id && <Button variant="danger" className="me-auto waves-effect" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>}
            <Button variant="secondary" className="waves-effect" onClick={() => setShowEventModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="waves-effect">
              Save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <ModalHeader closeButton>
          <ModalTitle as="h5">Manage Categories</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddCategory} className="mb-4">
            <Row>
              <Col md={6} className="mb-3">
                <FormLabel>Category Name</FormLabel>
                <FormControl type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required />
              </Col>
              <Col md={6} className="mb-3">
                <FormLabel>Color</FormLabel>
                <FormSelect value={newCategoryColor} onChange={e => setNewCategoryColor(e.target.value)}>
                  <option value="var(--primary-500)">Blue</option>
                  <option value="var(--success-500)">Green</option>
                  <option value="var(--danger-500)">Red</option>
                  <option value="var(--warning-500)">Yellow</option>
                  <option value="var(--info-500)">Cyan</option>
                  <option value="var(--secondary-900)">Dark</option>
                  <option value="var(--secondary-300)">Secondary</option>
                  <option value="var(--bs-purple)">Purple</option>
                  <option value="var(--bs-indigo)">Indigo</option>
                  <option value="var(--bs-teal)">Teal</option>
                </FormSelect>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="waves-effect">
              Add Category
            </Button>
          </Form>
          <h6>Existing Categories</h6>
          <ul className="list-group">
            {categories.map(c => <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span className="rounded-circle me-2" style={{
                backgroundColor: c.color,
                width: '12px',
                height: '12px',
                display: 'inline-block'
              }} />
                  {c.name}
                </div>
                <Button variant="outline-danger" size="sm" className="py-0 px-2" onClick={() => handleDeleteCategory(c.id)}>
                  Delete
                </Button>
              </li>)}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" className="waves-effect" onClick={() => setShowCategoryModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="bg-dark bg-opacity-50 shadow-5 translucent-dark">
        <ModalHeader closeButton className="border-bottom-0">
          <ModalTitle as="h5" className="text-white">
            Confirm Delete
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Alert variant="danger" className="bg-danger border-danger text-light border-opacity-50 bg-opacity-10 mb-0">
            Are you sure you want to delete record <span className="fw-600 text-danger">{selectedEvent?.title}</span> <br />
            This action cannot be undone.
          </Alert>
        </ModalBody>
        <ModalFooter className="border-top-0">
          <Button variant="light" className="waves-effect" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="waves-effect" onClick={handleDeleteEvent}>
            Yes, delete
          </Button>
        </ModalFooter>
      </Modal>
    </>;
};
export default CalendarCard;