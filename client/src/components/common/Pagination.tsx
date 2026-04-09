import React from "react";

const paginationButtonClassName =
  "inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full px-3 text-sm font-semibold transition";

const Pagination = React.memo(function Pagination({
  pagination,
  pageClickHandler,
}: {
  pagination?: kakao.maps.Pagination;
  pageClickHandler: (
    type: "prev" | "next" | "current",
    page?: number,
    currentPagination?: kakao.maps.Pagination
  ) => void;
}) {
  if (!pagination) {
    return null;
  }

  const pageList = new Array(pagination.last || 1)
    .fill(0)
    .map((item, idx) => item + idx + 1);

  return (
    <div className="border-t border-[rgba(148,163,184,0.16)] px-4 py-4">
      <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        <span>Results</span>
        <span>
          Page {pagination.current} / {pagination.last || 1}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          disabled={!pagination.hasPrevPage}
          onClick={() => pageClickHandler("prev")}
          className={[
            paginationButtonClassName,
            "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300",
          ].join(" ")}
          aria-label="Previous page"
        >
          {"<"}
        </button>

        {pageList.map((page: number) => {
          return (
            <button
              key={"pageList" + page}
              type="button"
              onClick={() => pageClickHandler("current", page)}
              className={[
                paginationButtonClassName,
                page === pagination.current
                  ? "bg-[rgb(var(--color-accent))] text-white shadow-[0_12px_24px_rgba(14,116,144,0.22)]"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              ].join(" ")}
              aria-current={page === pagination.current ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!pagination.hasNextPage}
          onClick={() => pageClickHandler("next")}
          className={[
            paginationButtonClassName,
            "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300",
          ].join(" ")}
          aria-label="Next page"
        >
          {">"}
        </button>
      </div>
    </div>
  );
});

export default Pagination;
