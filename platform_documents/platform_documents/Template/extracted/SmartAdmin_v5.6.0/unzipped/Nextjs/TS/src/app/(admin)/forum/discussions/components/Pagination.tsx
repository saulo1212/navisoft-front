import Link from 'next/link'

const Pagination = () => {
  return (
    <>
      <ul className="pagination pagination-sm mt-3 mb-g">
        <li className="page-item disabled">
          <Link className="page-link" href="" aria-label="First">
            First
          </Link>
        </li>
        <li className="page-item disabled">
          <Link className="page-link" href="" aria-label="Previous">
            Prev
          </Link>
        </li>
        <li className="page-item active" aria-current="page">
          <span className="page-link">
            1<span className="sr-only">(current)</span>
          </span>
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
        <li className="paginate_button page-item disabled px-0">…</li>
        <li className="page-item">
          <Link className="page-link" href="">
            7
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="">
            8
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="" aria-label="Next">
            Next
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="" aria-label="Last">
            Last
          </Link>
        </li>
      </ul>
    </>
  )
}

export default Pagination
