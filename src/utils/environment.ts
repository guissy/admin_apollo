const isDev = /^(192\.168|127\.0\.0\.1|localhost)/.test(window.location.host);
const hasSettings = window.settings && window.settings.domain;
// 所有配置从 settings 中来，如果 settings 为 undefined 则取默认值以防null错误
const {
  domain = location.host,
  ssl = location.protocol === 'https:',
  site = {
    title: '后台管理',
    lang: 'zh_CN',
    copyright: '',
    theme: 'Classic',
    nav: 'left'
  },
  logo = {
    normal: '/assets/logo.png'
  }
} =
  window.settings || {};
// 站点标题
document.title = site.title;
const https = ssl ? 'https:' : 'http:';
const environment = {
  isDev,
  hasSetting: hasSettings, // 没设置则跳错误页

  apiHost: 'http://localhost:8081', // `${https}//api.${domain}`, // ajax json
  imgHost: 'http://localhost:8081', // 资源站图片
  sport: '', // iframe 外链

  // theme: initTheme(site.theme, isDevTheme), // 主题值为：'1','2'...
  locale: 'zh-CN', // 本地语言
  logo: logo.normal, // LOGO
  title: site.title, // 站点名称
  copyrights: site.copyright, // © 版权所有

  tokenName: 'hehe_token', // sessionStorage Key
  expiration: 'hehe_exp', // sessionStorage Key
  userInfo: 'hehe_userInfo', // sessionStorage Key
  app_link: 'hehe_app_link', // sessionStorage Key
  userId: 'hehe_userId', // sessionStorage Key
  refresh_token: 'refresh_token', // sessionStorage Key
  shortcutMenu: 'shortcut_menu', // localStorage Key
  nav: 'nav', // localStorage Key
  lang: 'lang', // localStorage Key
  theme: 'theme', // localStorage Key
  sound_message: 'sound_message', // localStorage Key
  sound_deposit: 'sound_deposit', // localStorage Key
  sound_withdraw: 'sound_withdraw', // localStorage Key

  userFirstPage: '/',

  dispatch: (action: { type: string; payload?: {} }) => {
    console.warn('this = dva()._store.dispatch');
  }, // 用于 utils 文件夹中的工具方法,
  //  默认加载页码
  adminPage: 1,
  // 默认加载数量
  adminPageSize: 20
};

/** 环境变量，即全局变量，通用组件和工具方法尽量避免引用 */
export default environment;

declare global {
  interface Window {
    settings: {
      domain: string;
      ssl: boolean;
      site: {
        title: string;
        theme: string;
        lang: string;
        copyright: string;
        favicon: string;
        sport: string;
      };
      logo: {
        normal: string;
      };
    };
  }
}
