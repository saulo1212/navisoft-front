const Pagination = () => {
  return <>
      <ul className="pagination pagination-sm mt-3">
        <li className="page-item disabled">
          <a className="page-link" href="#" aria-label="First">
            First
          </a>
        </li>
        <li className="page-item disabled">
          <a className="page-link" href="#" aria-label="Previous">
            Prev
          </a>
        </li>
        <li className="page-item active" aria-current="page">
          <span className="page-link">
            1<span className="sr-only">(current)</span>
          </span>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            2
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            3
          </a>
        </li>
        <li className="paginate_button page-item disabled px-0">…</li>
        <li className="page-item">
          <a className="page-link" href="#">
            7
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#">
            8
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Next">
            Next
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Last">
            Last
          </a>
        </li>
      </ul>
    </>;
};
export default Pagination;