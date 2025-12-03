'use client';

import { useState } from 'react';
import { useFetchCommentsQuery, useUpdateCommentStatusMutation, useDeleteCommentMutation } from '@/lib/services/modules/commentService';
import { Comment } from '@/lib/services/modules/commentService/type';
import { Button } from '@/core/shadcn/components/ui/button';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/core/shadcn/components/ui/dialog';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle2,
  XCircle,
  Reply,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import CommentReplyModal from '@/modules/Comment/CommentReplyModal/CommentReplyModal';

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
  comment: Comment;
  onReply: (comment: Comment) => void;
  onToggleStatus: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  level?: number;
}

const CommentItem = ({ comment, onReply, onToggleStatus, onDelete, level = 0 }: CommentItemProps) => {
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`${level > 0 ? 'border-l-2 border-gray-200 pl-4 ml-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {comment.staff ? (
                  <Badge variant="default">
                    <User className="h-3 w-3 mr-1" />
                    {comment.staff.fullName || comment.staff.username}
                  </Badge>
                ) : comment.customer ? (
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
                {!comment.status && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(comment)}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Duyệt
                  </Button>
                )}
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
          {comment.replies?.map((reply) => (
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

interface BlogCommentSectionProps {
  blogId: number;
}

export default function BlogCommentSection({ blogId }: BlogCommentSectionProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const { data: commentsData, isLoading, refetch } = useFetchCommentsQuery({
    page: 0,
    size: 100,
    blogId,
  });

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [updateStatus] = useUpdateCommentStatusMutation();

  const comments = commentsData?.data || [];
  const topLevelComments = comments.filter((c) => !c.parentId);

  const handleReplyClick = (comment: Comment) => {
    setSelectedComment(comment);
    setReplyModalOpen(true);
  };

  const handleToggleStatus = async (comment: Comment) => {
    try {
      await updateStatus({ id: comment.id, status: !comment.status }).unwrap();
      toast.success(`Đã ${comment.status ? 'từ chối' : 'duyệt'} comment thành công`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteClick = (comment: Comment) => {
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải comment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Bình luận ({topLevelComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topLevelComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có comment</h3>
              <p className="text-muted-foreground text-center">
                Chưa có comment nào cho blog này
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReplyClick}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
    </>
  );
}

