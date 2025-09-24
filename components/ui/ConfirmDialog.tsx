import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const declineReasons = [
  'Already have class',
  'Not available',
  'Too many substitutions',
  'Other',
];

export default function ConfirmSubstitutionDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState("");


  const handleConfirm = () => {
    const finalReason = reason === "Other" ? customReason.trim() : reason;
    if (!finalReason) return; // prevent confirm with no reason
    onConfirm(finalReason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{color:'red'}}>
        Confirm Decline
      </DialogTitle>

      <DialogContent>
            <p>Are you sure you want to decline this substitution?</p>
            <FormControl fullWidth sx={{ mt: 2}}>
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
              {reason === "Other" && (
            <div className="mt-2">
              <label
                htmlFor="customReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Specify Reason
              </label>
              <textarea
                id="customReason"
                maxLength={100}
                placeholder="Enter reason"
                value={customReason}
                required={reason === "Other"}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full border resize-none border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}
            </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={'error'}
          disabled={!reason}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
