import browser from 'webextension-polyfill';

import store from '../app/store';
import { bucket, MailOption } from '../myBucket';
import { isDev } from '../shared/utils';

store.subscribe(() => {
  console.log('state', store.getState());
});

// 無料枠をリセット
const resetFreeTier = async () => {
  const mybucket = await bucket.get();
  const mail: MailOption = {
    ...mybucket.mail,
    freeTier: 10,
  };
  const now = new Date();
  await bucket.set({ mail: mail });
};

// 拡張機能がインストールされたときに実行されるコード
chrome.runtime.onInstalled.addListener(async function () {
  resetFreeTier();
  const googleDriveFolderURL =
    'https://drive.google.com/file/d/1j35RQQj6CO7hf-RTnms5dV5c-oSVhJdn/view?usp=sharing';
  chrome.tabs.create({ url: googleDriveFolderURL });
});

export {};
