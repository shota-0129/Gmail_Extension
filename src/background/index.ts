import browser from 'webextension-polyfill';

import store from '../app/store';
import { bucket, MailOption } from '../myBucket';
import { isDev } from '../shared/utils';

store.subscribe(() => {
  console.log('state', store.getState());
});

// 初期設定
const constructor = async () => {
  const mybucket = await bucket.get();
  const mail: MailOption = {
    ...mybucket.mail,
    freeTier: 10,
  };
  await bucket.set({ mail: mail, is_installed: true });
};

const is_installed = async () => {
  const mybucket = await bucket.get();
  return !mybucket.is_installed;
};

// 拡張機能がインストールされたときに実行されるコード
chrome.runtime.onInstalled.addListener(async function () {
  if (await is_installed()) {
    await constructor();
    const googleDriveFolderURL =
      'https://drive.google.com/file/d/1j35RQQj6CO7hf-RTnms5dV5c-oSVhJdn/view?usp=sharing';
    chrome.tabs.create({ url: googleDriveFolderURL });
  }
});

export {};
