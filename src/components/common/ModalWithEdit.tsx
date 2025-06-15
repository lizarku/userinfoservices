import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ModalWithEditProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  confirmText?: string;
  closeText?: string;
  editText?: string;
}

export default function ModalWithEdit({ open, title, children, onClose, onConfirm, onEdit, confirmText = '확인', closeText = '닫기', editText = '수정' }: ModalWithEditProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{closeText}</Button>
        <Button onClick={onEdit} color="secondary">{editText}</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
} 