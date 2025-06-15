import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ModalLayoutProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  closeText?: string;
}

export default function ModalLayout({ open, title, children, onClose, onConfirm, confirmText = '확인', closeText = '닫기' }: ModalLayoutProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{closeText}</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
} 