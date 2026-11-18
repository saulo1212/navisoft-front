import Link from 'next/link';
import { Button, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, FormControl } from 'react-bootstrap';
const Discussions = () => {
  return <>
      <div className="input-group input-group-lg mb-g">
        <FormControl type="text" className="shadow-inset-2" placeholder="Search Discussion" />
        <Button variant="outline-default">
          <i className="fal fa-search" />
        </Button>
      </div>

      <div className="d-flex align-items-center mb-3">
        <div className="h5 mb-0 d-inline-block">
          <Link href="/forum/threads">Account information &amp; Security</Link> / Package location
        </div>
        <Dropdown className="ms-auto">
          <DropdownToggle as={'button'} className="btn btn-outline-secondary btn-sm">
            Jump to...
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Sunny A. (Thread Owner)</DropdownItem>
            <DropdownItem>Oliver Kopyov</DropdownItem>
            <DropdownItem>Dr. John Cook PhD</DropdownItem>
            <DropdownItem>Sarah McBrook</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Post a New Reply</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>;
};
export default Discussions;