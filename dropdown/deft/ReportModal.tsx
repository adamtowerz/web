import { Modal } from "@/components/Modal";
import Button from "@/components/Button";

type ReportModalProps = {
  open: boolean;
  onClose: () => void;
};

function ReportModal({ open, onClose }: ReportModalProps) {
    const footer = <div><Button type="button">Submit</Button></div>
  return (
    <Modal open={open} title="Report bug" onClose={onClose} footer={footer}>
      Here's where the form will go
    </Modal>
  );
}

export default ReportModal;
