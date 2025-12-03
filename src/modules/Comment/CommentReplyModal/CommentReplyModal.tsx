'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useReplyCommentMutation } from '@/lib/services/modules/commentService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/shadcn/components/ui/dialog';
import { Button } from '@/core/shadcn/components/ui/button';
import { Label } from '@/core/shadcn/components/ui/label';
import { Textarea } from '@/core/shadcn/components/ui/textarea';
import { Loader2, Reply } from 'lucide-react';
import { toast } from 'sonner';

type ReplyFormValues = {
  content: string;
};

const schema = yup.object({
  content: yup
    .string()
    .required('Nội dung trả lời là bắt buộc')
    .min(1, 'Nội dung trả lời không được để trống'),
});

interface CommentReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: any;
  onSuccess: () => void;
}

export default function CommentReplyModal({
  open,
  onOpenChange,
  comment,
  onSuccess,
}: CommentReplyModalProps) {
  const [replyComment, { isLoading }] = useReplyCommentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReplyFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: ReplyFormValues) => {
    if (!comment) return;

    try {
      await replyComment({
        blogId: comment.blogId,
        parentId: comment.id,
        content: data.content,
      }).unwrap();
      toast.success('Trả lời comment thành công');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi trả lời comment');
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!comment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Reply className="h-5 w-5" />
            Trả lời comment
          </DialogTitle>
          <DialogDescription>
            Trả lời comment từ {comment.customer?.fullName || comment.userComment || 'Khách vãng lai'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">
                Nội dung trả lời <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Nhập nội dung trả lời..."
                rows={5}
                {...register('content')}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Comment gốc:</p>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Reply className="h-4 w-4 mr-2" />
                  Gửi trả lời
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

