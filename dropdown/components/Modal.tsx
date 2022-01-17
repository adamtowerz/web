import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

export interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  canClose?: boolean;
  children: ReactNode;
}

export function ModalBase({
  open,
  onClose,
  canClose = true,
  children,
}: ModalBaseProps) {
  const modal = (
    <div className={styles.modalBaseWrapper}>
      <div
        className={styles.modalBaseOverlay}
        onClick={canClose ? onClose : () => {}}
      />
      {children}
    </div>
  );

  return open ? createPortal(modal, document.body) : null;
}

export interface ModalProps extends ModalBaseProps {
  title?: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  title,
  footer,
  children,
  open,
  onClose,
  canClose,
}: ModalProps) {
  return (
    <ModalBase open={open} onClose={onClose} canClose={canClose}>
      <div className={styles.modalWrapper}>
        {title && <div className={styles.modalTitle}>{title}</div>}
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </ModalBase>
  );
}
