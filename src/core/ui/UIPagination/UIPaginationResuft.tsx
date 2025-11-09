import { IUIPaginationResultProps } from "./UIPagination.type";

const UIPaginationResuft: React.FC<IUIPaginationResultProps> = (props) => {
  const { currentPage, totalPage, totalCount } = props;
  return (
    <span className="text-xs leading-[155%] text-[#A5A5A5]">
      Trang {currentPage}/{totalPage} – Tổng cộng {totalCount} mục
    </span>

  );
};


export { UIPaginationResuft };
