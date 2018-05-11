import * as React from 'react';
import { select } from '../../utils/model';
import styled from 'styled-components';
import { Layout, Modal, LocaleProvider } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zh_CN1 from '../../locale/zh_CN';
import zh_HK1 from '../../locale/zh_HK';
import en_US1 from '../../locale/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import en_US from 'antd/lib/locale-provider/en_US';
import LoginComponent from '../login/LoginComponent';
import { LoginState } from '../login/Login.model';
import { SettingState } from './header/setting/Setting.model';

import Header from './header/Header';
import Sider from './sider/Sider';
import Title from './titleBar/Title';
import Routes from '../routes/Routes';
import environment from '../../utils/environment';

const Content = styled(Layout.Content)`
  overflow-x: hidden;
  margin: 24px;
`;
const LayoutWrap = styled(Layout)`
  min-height: 100%;
`;
const Layouter = styled.div`
  overflow: initial;
  width: 100%;
`;

/** 首页：布局和路由 */
@select(['login', 'setting'])
export default class Home extends React.PureComponent<HomeProps, {}> {
  render() {
    addLocaleData([...zh, ...en]);
    const localeMap = new Map();
    localeMap.set('zh_CN', zh_CN1);
    localeMap.set('zh_HK', zh_HK1);
    localeMap.set('en_US', en_US1);
    if (environment.isDev) {
      const anyWord = new Proxy(zh_CN1, {
        get(target: typeof zh_CN1, p: PropertyKey) {
          return p;
        }
      });
      localeMap.set('zh_CN', anyWord);
      localeMap.set('zh_HK', anyWord);
      localeMap.set('en_US', anyWord);
    }
    addLocaleData({ locale: 'zh_CN', ...localeMap.get('zh_CN'), parentLocale: 'zh' });
    addLocaleData({ locale: 'zh_HK', ...localeMap.get('zh_HK'), parentLocale: 'zh' });
    addLocaleData({ locale: 'en_US', ...localeMap.get('en_US'), parentLocale: 'en' });

    const { login = {} as LoginState, setting = {} as SettingState } = this.props;
    let antdLang = zh_CN;
    if (setting.lang === 'zh_HK') {
      antdLang = zh_TW;
    } else if (setting.lang === 'en_US') {
      antdLang = en_US;
    }
    return (
      // <React.StrictMode>
      // </React.StrictMode>
      <LocaleProvider locale={antdLang}>
        <IntlProvider locale={setting.lang} messages={localeMap.get(setting.lang)}>
          <LayoutWrap>
            <Sider />
            <Layouter>
              <Header />
              <Title />
              <Content>
                <Routes />
                <Modal
                  visible={login.needLogin}
                  footer={null}
                  destroyOnClose={true}
                  maskClosable={false}
                  closable={false}
                >
                  <LoginComponent />
                </Modal>
              </Content>
            </Layouter>
          </LayoutWrap>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

interface HomeProps {
  login?: LoginState;
  setting?: SettingState;
}
