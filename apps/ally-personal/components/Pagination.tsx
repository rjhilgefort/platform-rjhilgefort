import React from 'react'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  return (
    <div className="flex justify-between mb-20">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="btn btn-outline rounded-full py-3 px-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          transform="rotate(180)"
        >
          <path d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z" />
        </svg>
        Previous
      </button>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="btn btn-outline rounded-full py-3 px-6"
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z" />
        </svg>
      </button>
    </div>
  )
}

export default Pagination
