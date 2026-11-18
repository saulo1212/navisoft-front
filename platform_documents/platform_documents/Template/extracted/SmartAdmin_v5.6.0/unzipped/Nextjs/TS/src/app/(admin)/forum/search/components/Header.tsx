import { Button, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, FormControl } from 'react-bootstrap'

const Header = () => {
  return (
    <>
      <div className="px-3 px-sm-5 pt-4">
        <h1 className="subheader-title mb-4">
          65 Results for "SmartAdmin"
          <small className="mb-3 text-muted">Request time (0.23 seconds)</small>
        </h1>

        <Dropdown className="input-group input-group-lg mb-5 shadow-1 rounded">
          <FormControl
            type="text"
            className="shadow-inset-2"
            id="filter-icon"
            aria-label="type 2 or more letters"
            placeholder="Search anything..."
            defaultValue="SmartAdmin"
          />

          <Button variant="primary" className="d-none d-sm-inline-block waves-effect">
            <i className="fa fa-search me-2" />
            <span>Search</span>
          </Button>

          <DropdownToggle as={'button'} className="btn btn-primary dropdown-toggle-split waves-effect">
            <span className="visually-hidden">Toggle Dropdown</span>
          </DropdownToggle>

          <DropdownMenu align="end">
            <DropdownItem>Image</DropdownItem>
            <DropdownItem>Users</DropdownItem>
            <DropdownDivider />
            <DropdownItem active>Everything</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  )
}

export default Header
