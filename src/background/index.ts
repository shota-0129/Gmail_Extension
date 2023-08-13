import browser from 'webextension-polyfill';

import { bucket, MailOption } from '../myBucket';
import { isDev } from '../shared/utils';

// 無料枠をリセット
const resetFreeTier = async () => {
  const mybucket = await bucket.get();
  const mail: MailOption = {
    ...mybucket.mail,
    freeTier: 10,
  };
  const now = new Date();
  await bucket.set({ mail: mail, updated_at: now });
};

// 拡張機能がインストールされたときに実行されるコード
chrome.runtime.onInstalled.addListener(function () {
  // アラームを設定して毎月特定の日時に実行する
  chrome.alarms.create('monthlyReset', {
    when: Date.now() + 1000, // 初回の実行を1秒後に設定
    periodInMinutes: 60 * 24 * 30, // 30日（約1ヶ月）ごとに繰り返し
  });
});

// アラームが発生したときの処理
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'monthlyReset') {
    resetFreeTier();
  }
});

export {};
