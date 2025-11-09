import { Fragment } from "react";
import { UIIcon } from "../UIIcon";
import type { IUIPagination } from "./UIPagination.type";
import { ChevronLeft, ChevronRight } from "lucide-react";

const UIPagination: React.FC<IUIPagination> = (props) => {
  const { currentPage, totalPage, onChange, displayPage = 5 } = props;

  const pageArray = Array.from({ length: totalPage }, (_, i) => i + 1);
  let startPage = currentPage - Math.floor(displayPage / 2);
  let endPage = currentPage + Math.floor(displayPage / 2);

  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(displayPage, totalPage);
  } else if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(totalPage - displayPage + 1, 1);
  }
  const displayPageArray = pageArray.filter((page) => page >= startPage && page <= endPage);

  const handleNextPage = (isForward: boolean) => {
    if (isForward) {
      if (currentPage + 1 > totalPage) {
        return;
      }
      onChange(currentPage + 1);
    } else {
      if (currentPage - 1 < 1) {
        return;
      }
      onChange(currentPage - 1);
    }
  };

  return (
    <Fragment>
      <div className="flex items-center justify-center space-x-[15px]">
        {currentPage !== 1 && totalPage >= displayPage && (
          <div
            className="cursor-pointer text-[#454A70]"
            onClick={() => {
              handleNextPage(false);
            }}
          >
            <ChevronLeft />
          </div>
        )}
        {displayPageArray.map((page, index) => (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            key={index.toString()}
            className={`text-xs w-[25px] h-[25px] rounded-[4px] ${currentPage === page ? "bg-[#454A70] text-white" : "text-[#454A70] bg-transparent border border-[#454A70]"}`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ))}
        {currentPage !== totalPage && totalPage >= displayPage && (
          <div
            className="cursor-pointer text-[#454A70]"
            onClick={() => {
              handleNextPage(true);
            }}
          >
            <ChevronRight />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export { UIPagination };
