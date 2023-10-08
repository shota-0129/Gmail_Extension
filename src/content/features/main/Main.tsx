import React, { useEffect, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import DeleteIcon from '@mui/icons-material/Delete';
import Textarea from '@mui/joy/Textarea';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { BiMailSend } from '@react-icons/all-files/bi/BiMailSend';
import { language } from 'googleapis/build/src/apis/language';

import { isChargeModeFn } from '../../../isChargeModeBucket';
import { bucket, MailOption, MyBucket } from '../../../myBucket';

import { isChargeModeNewMail } from './mail/isChargeModeNewMail';
import { newMail } from './mail/newMail';
import { convertErrorMessage } from './convertErrorMessage';
// import { AiOutlineMail } from 'react-icons/ai';
import Endicon from './Endicon';
import ModalMail from './ModalMail';

import styles from './Main.module.css';

export type MailType = {
  subject?: string;
  body?: string;
};

export function Main() {
  const { getIsChargeMode } = isChargeModeFn();
  const [texts, setTexts] = useState({
    sendText: '',
    returnText: '',
    useful: true,
    language: 'Japanese',
  });
  const [freeTier, setfreeTier] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  /**
   * 無料枠の取得
   */
  useEffect(() => {
    const getFreeTier = async () => {
      const mybucket = await bucket.get();
      setfreeTier(mybucket.mail.freeTier);
      if (mybucket.mail.language) setTexts({ ...texts, language: mybucket.mail.language });
    };
    getFreeTier();
  }, []);

  const handleTextChange = async (event: any) => {
    const text = event.target.value;
    setTexts({ ...texts, sendText: text });
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setTexts({ ...texts, language: event.target.value as string });
  };

  const handleSend = async () => {
    setTexts({ ...texts, useful: false });
    const mybucket = await bucket.get();
    const isChargeMode = await getIsChargeMode();
    const apikey = isChargeMode ? mybucket?.mail?.apikey : '';
    const model = mybucket?.mail?.model ?? 'gpt-3.5-turbo';

    const returnText: string | MailType = isChargeMode
      ? await newMail(apikey, texts.sendText, texts.language, model)
      : await isChargeModeNewMail({
          reqText: texts.sendText,
          language: texts.language,
          model: model,
        }); //language: texts.language

    if (typeof returnText === 'string') {
      alert(convertErrorMessage(returnText));
      setTexts({ ...texts, useful: true });
      return;
    }

    const subject = returnText.subject ?? '';
    const body = returnText.body ?? '';

    const textelement = document.querySelectorAll('[role="textbox"]')[0];
    setTexts({ ...texts, returnText: body, useful: true });

    if (textelement != null) {
      const subjectbox = document.getElementsByName('subjectbox')[0] as HTMLInputElement;
      if (subjectbox) {
        subjectbox.value = subject;
      }
      textelement.insertAdjacentHTML('afterbegin', body);
    } else {
      console.log('openModal');
      // モーダルを開く
      openModal();
    }

    if (!isChargeMode) {
      const mail: MailOption = {
        ...mybucket.mail,
        freeTier: mybucket.mail.freeTier - 1,
        language: texts.language,
      };
      await bucket.set({ mail: mail });
      setfreeTier(mybucket.mail.freeTier - 1);
    }
  };

  // モーダルを開く関数
  const openModal = () => {
    setModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>MailCompose Assist powered by GPT-3.5</Typography>
          <BiMailSend />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Box sx={{ mx: 2, width: 300 }}>
              <Typography variant="body2">
                Please type what kind of email you would like to write.
              </Typography>
              <Textarea
                color="primary"
                minRows={5}
                maxRows={5}
                onChange={handleTextChange}
                value={texts.sendText}
                sx={{ mt: 2 }}
                size="sm"
                placeholder="Example：I would like to send a gratitude email to Mr. Mizusaki from Kobe University Graduate School, who developed MailCompose Assist powered by GPT-3.5."
              />
              <Stack direction="row" justifyContent="flex-end">
                <Box sx={{ m: 1 }}>
                  <Typography>Free Tier：{freeTier} emails</Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="flex-end">
                <Box>
                  <FormControl sx={{ minWidth: '120px', fontSize: '16px', mr: 2 }} size="small">
                    <InputLabel id="demo-select-small-label">Output Language</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={texts.language}
                      label="Output Language"
                      onChange={handleLanguageChange}
                    >
                      <MenuItem value={'Arabic'}>Arabic</MenuItem>
                      <MenuItem value={'Chinese'}>Chinese</MenuItem>
                      <MenuItem value={'English'}>English</MenuItem>
                      <MenuItem value={'French'}>French</MenuItem>
                      <MenuItem value={'German'}>German</MenuItem>
                      <MenuItem value={'Italian'}>Italian</MenuItem>
                      <MenuItem value={'Japanese'}>Japanese</MenuItem>
                      <MenuItem value={'Korean'}>Korean</MenuItem>
                      <MenuItem value={'Russian'}>Russian</MenuItem>
                      <MenuItem value={'Spanish'}>Spanish</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSend}
                  sx={{ padding: 1, fontSize: '12px' }}
                  disabled={!texts.useful}
                  endIcon={<Endicon is_connecting={!texts.useful} />}
                >
                  Compose !
                </Button>
              </Stack>
              <Stack justifyContent="flex-end">
                <Typography component="div">
                  <Box fontSize={12}>
                    <br />
                    ※For detailed instructions, please click .
                    <a href="https://drive.google.com/file/d/1j35RQQj6CO7hf-RTnms5dV5c-oSVhJdn/view?usp=sharing">
                      this
                    </a>
                    <br />
                    If you have any comments or requests, we would be happy to have you write a
                    review
                    <a href="https://chrome.google.com/webstore/detail/gmail-gpt/dfddioocenioilenfdojcpccmojcaiij?hl=ja&authuser=0">
                      here!
                    </a>
                    <br />
                    If you like using it, please give me ★5 🙇
                  </Box>
                </Typography>
              </Stack>
            </Box>
          </div>
        </AccordionDetails>
      </Accordion>
      {isModalOpen && <ModalMail returnText={texts.returnText} onClose={closeModal} />}
    </Box>
  );
}
