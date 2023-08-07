import {IPagination} from "../../types/util";

export default function Pagination({pageInfo,pageClickHandler}:{pageInfo:IPagination,pageClickHandler:(type:'prev' | 'next'  |'current', page?:number)=>void}) {

  const pageList = new Array(+pageInfo.lastPage).fill(0).map((item,idx) => item+idx+1)
  
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
              <button
                  disabled={!pageInfo.hasPrevPage}
                  onClick={() => pageClickHandler("prev")}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                prev
              </button>

            {/* Current:  */}
            {
              pageList.map((page:number) => {
                return (
                    <button
                        onClick={() => pageClickHandler("current",page)}
                        className={"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          +(page === pageInfo.currentPage ? " bg-yellow-300":" ")
                        }
                    >
                      {page}
                    </button>
                )
              })
            }

            <button
                disabled={!pageInfo.hasNextPage}
                onClick={() => pageClickHandler("next")}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
