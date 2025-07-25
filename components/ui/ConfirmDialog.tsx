import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

type Props = {
  open: boolean;
  mode: 'accept' | 'decline';
  onClose: () => void;
  onConfirm: (accepted: boolean, reason?: string) => void;
};

const declineReasons = [
  'Already have class',
  'Not available',
  'Too many substitutions',
  'Other',
];

export default function ConfirmSubstitutionDialog({
  open,
  mode,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (mode === 'decline' && !reason) return; // prevent confirm with no reason
    onConfirm(mode === 'accept', reason || undefined);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === 'accept' ? 'Confirm Acceptance' : 'Confirm Decline'}
      </DialogTitle>

      <DialogContent>
        {mode === 'accept' ? (
          <p>Are you sure you want to accept this substitution?</p>
        ) : (
          <>
            <p>Are you sure you want to decline this substitution?</p>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="reason-label">Reason</InputLabel>
              <Select
                labelId="reason-label"
                value={reason}
                label="Reason"
                onChange={(e) => setReason(e.target.value)}
              >
                {declineReasons.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={mode === 'accept' ? 'primary' : 'error'}
          disabled={mode === 'decline' && !reason}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
