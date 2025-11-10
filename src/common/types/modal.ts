import type { ComponentProps } from "react";
import type { DialogContent } from "@/core/shadcn/components/ui/dialog";

export type ModalType = "normal" | "custom";

export interface ModalProps {
    title?: string;
    description?: React.ReactNode;
    onSubmit?: () => void;
    onCancel?: () => void;
    submitClassName?: string;
    cancelClassName?: string;
    submitText?: string;
    cancelText?: string;
    type?: ModalType;
    children?: React.ReactNode;
    dialogContentProps?: Omit<ComponentProps<typeof DialogContent>, "children">;
}

export interface UseModalReturn {
    Modal: () => JSX.Element;
    openModal: (props: ModalProps) => void;
    closeModal: () => void;
}

