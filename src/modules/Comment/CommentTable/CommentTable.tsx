'use client';

import { useState } from 'react';
import { useFetchCommentsQuery, useDeleteCommentMutation, useUpdateCommentStatusMutation } from '@/lib/services/modules/commentService';
import { useFetchBlogsQuery } from '@/lib/services/modules/blogService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/core/shadcn/components/ui/dialog';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { UIPagination, UIPaginationResuft } from '@/core/ui/UIPagination';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle2,
  XCircle,
  Reply,
  Filter,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import CommentReplyModal from '../CommentReplyModal/CommentReplyModal';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface CommentItemProps {
  comment: any;
  onReply: (comment: any) => void;
  onToggleStatus: (comment: any) => void;
  onDelete: (comment: any) => void;
  level?: number;
}

const CommentItem = ({ comment, onReply, onToggleStatus, onDelete, level = 0 }: CommentItemProps) => {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const marginLeft = level * 24;

  return (
    <div className={`${level > 0 ? 'border-l-2 border-gray-200 pl-4 ml-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {comment.customer ? (
                  <Badge variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    {comment.customer.fullName || comment.customer.username}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <User className="h-3 w-3 mr-1" />
                    {comment.userComment || 'Khách vãng lai'}
                  </Badge>
                )}
                <Badge variant={comment.status ? 'default' : 'secondary'}>
                  {comment.status ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Đã duyệt</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Chưa duyệt</>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-3">
                {comment.content}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReply(comment)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Trả lời
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(comment)}
                >
                  {comment.status ? (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Từ chối
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Duyệt
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(comment)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {hasReplies && (
        <div className="mt-2">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentTable() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any>(null);

  const [{ page, size, blogId, status }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    size: parseAsInteger.withDefault(20),
    blogId: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
  });

  const { data: commentsData, isLoading, refetch } = useFetchCommentsQuery({
    page,
    size,
    blogId: blogId ? parseInt(blogId) : undefined,
    status: status === 'true' ? true : status === 'false' ? false : undefined,
  });

  const { data: blogsData } = useFetchBlogsQuery({ page: 0, size: 100, isPublished: true });

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [updateStatus] = useUpdateCommentStatusMutation();

  const comments = commentsData?.data || [];
  const totalElements = commentsData?.pagination?.totalElements || 0;
  const totalPages = commentsData?.pagination?.totalPages || 0;
  const blogs = blogsData?.data || [];

  const blogOptions = [
    { value: '', label: 'Tất cả blog' },
    ...blogs.map(blog => ({ value: blog.id.toString(), label: blog.title })),
  ];

  const handleReplyClick = (comment: any) => {
    setSelectedComment(comment);
    setReplyModalOpen(true);
  };

  const handleToggleStatus = async (comment: any) => {
    try {
      await updateStatus({ id: comment.id, status: !comment.status }).unwrap();
      toast.success(`Đã ${comment.status ? 'từ chối' : 'duyệt'} comment thành công`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteClick = (comment: any) => {
    setSelectedComment(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedComment) return;
    try {
      await deleteComment(selectedComment.id).unwrap();
      toast.success('Xóa comment thành công');
      setDeleteDialogOpen(false);
      setSelectedComment(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi xóa comment');
    }
  };

  const clearFilters = () => {
    setQuery({ blogId: '', status: '', page: 0 });
  };

  const hasActiveFilters = blogId !== '' || status !== '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const topLevelComments = comments.filter((c: any) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Comment</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và duyệt các bình luận blog
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Blog</label>
              <UISingleSelect
                options={blogOptions}
                selected={blogOptions.find(opt => opt.value === blogId) || null}
                onChange={(value) => setQuery({ blogId: value?.value || '', page: 0 })}
                placeholder="Chọn blog"
                size={ESize.M}
                renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                renderOption={(props) => <UISingleSelect.Option {...props} />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setQuery({ status: e.target.value, page: 0 })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Tất cả</option>
                <option value="true">Đã duyệt</option>
                <option value="false">Chưa duyệt</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {topLevelComments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có comment</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Chưa có comment nào được tạo
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {topLevelComments.map((comment: any) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReplyClick}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <UIPaginationResuft
                currentPage={page + 1}
                totalPage={totalPages}
                totalCount={totalElements}
              />
              <UIPagination
                currentPage={page + 1}
                totalPage={totalPages}
                onChange={(newPage: number) => setQuery({ page: newPage - 1 })}
              />
            </div>
          )}
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa comment</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa comment này? Tất cả các reply sẽ bị xóa theo. Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedComment(null);
              }}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CommentReplyModal
        open={replyModalOpen}
        onOpenChange={setReplyModalOpen}
        comment={selectedComment}
        onSuccess={() => {
          refetch();
          setReplyModalOpen(false);
          setSelectedComment(null);
        }}
      />
    </div>
  );
}

