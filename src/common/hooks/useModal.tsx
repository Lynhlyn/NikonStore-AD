import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/core/shadcn/components/ui/dialog"
import { Button } from "@/core/shadcn/components/ui/button"
import { ModalProps, UseModalReturn } from "../types/modal"

export function useModal(): UseModalReturn & {
    open: boolean
    modalProps: ModalProps
} {
    const [open, setOpen] = useState(false)
    const [modalProps, setModalProps] = useState<ModalProps>({})

    const openModal = (props: ModalProps) => {
        setModalProps(props)
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
        setModalProps({})
    }

    const handleCancel = () => {
        modalProps.onCancel?.()
        closeModal()
    }

    const handleSubmit = () => {
        modalProps.onSubmit?.()
        closeModal()
    }

    const Modal = () => (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                {...modalProps.dialogContentProps}
                className={modalProps.dialogContentProps?.className}
                hideCloseButton={
                    modalProps.dialogContentProps?.hideCloseButton !== undefined
                        ? modalProps.dialogContentProps.hideCloseButton
                        : true
                }
            >
                {modalProps.type === "custom" ? (
                    modalProps.children
                ) : (
                    <>
                        <DialogHeader className="sm:text-center">
                            {modalProps.title && (
                                <DialogTitle className="text-base font-semibold mb-2">
                                    {modalProps.title}
                                </DialogTitle>
                            )}
                            {modalProps.description && (
                                <DialogDescription className="mb-6">
                                    {modalProps.description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <DialogFooter className="flex flex-col-reverse justify-center sm:flex-row sm:justify-center gap-4 mt-4">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className={modalProps.cancelClassName || "w-[100px] bg-[#B9B9B9]"}
                                    onClick={handleCancel}
                                >
                                    {modalProps.cancelText || "Hủy"}
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                className={modalProps.submitClassName || "w-[100px]"}
                                onClick={handleSubmit}
                            >
                                {modalProps.submitText || "Xác nhận"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )

    return { Modal, openModal, closeModal, open, modalProps }
}

