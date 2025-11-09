export interface IUIPagination {
  className?: string;
  currentPage: number;
  totalPage: number;
  onChange: (page: number) => void;
  displayPage?: number;
}
export interface IUIPaginationResultProps {
  currentPage: number;
  totalPage: number;
  totalCount: number;
}