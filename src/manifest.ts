import { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'MailCompose Assist powered by GPT-3.5',
  description: 'Automate the creation of emails in gmail using GPT3.5',
  version: '1.3.3.2',
  background: {
    service_worker: 'src/background/index.ts',
  },
  content_scripts: [
    {
      matches: ['https://mail.google.com/*'],
      js: ['src/content/index.tsx'],
    },
    {
      matches: ['https://outlook.live.com/mail/*'],
      js: ['src/content_outlook/index.tsx'],
    },
    {
      matches: ['https://outlook.office.com/mail/*'],
      js: ['src/content_outlook/index.tsx'],
    },
  ],
  host_permissions: ['<all_urls>'],
  options_ui: {
    page: 'src/options/options.html',
    open_in_tab: true,
  },
  web_accessible_resources: [
    {
      resources: ['src/welcome/welcome.html'],
      matches: ['<all_urls>'],
    },
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '16': 'images/icons_16.png',
      '32': 'images/icons_32.png',
      '48': 'images/icons_48.png',
      '128': 'images/icons_128.png',
    },
  },
  icons: {
    '16': 'images/icons_16.png',
    '32': 'images/icons_32.png',
    '48': 'images/icons_48.png',
    '128': 'images/icons_128.png',
  },
  permissions: ['storage'],
};

export default manifest;
