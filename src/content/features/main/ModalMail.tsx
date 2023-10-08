import React, { useEffect, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Textarea from '@mui/joy/Textarea';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ModalMail = (props: any) => {
  const [open, setOpen] = useState(true);
  const returnText = props.returnText.replace(/<br>/g, '\n');

  const handleClose = () => {
    // 親コンポーネントのモーダルステートを変更する
    if (props.onClose) {
      props.onClose();
    }
  };

  //クリップボードにコピー関数
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(returnText);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            How about the following body?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Textarea
              color="neutral"
              minRows={5}
              maxRows={15}
              value={returnText}
              sx={{ my: 2 }}
              size="sm"
            />
          </Typography>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton color="primary" size="small" onClick={() => copyToClipboard()}>
              Copy
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ModalMail;
