// ReasonDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function ReasonDialog({ open, onClose, onSubmit }: ReasonDialogProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason('');
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Provide Reason for Rejection</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!reason.trim()} variant="contained" color="error">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
