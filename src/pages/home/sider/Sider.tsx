import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'dva/router';
import MenuComponent from './MenuComponent';
import { Layout } from 'antd';
import { HeaderDefaultState } from '../header/Header.model';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { SettingState } from '../header/setting/Setting.model';
import { MenuMode } from 'antd/lib/menu';
import LogoComponent from './LogoComponent';

const SiderWrap = styled(Layout.Sider)`
  background: ${props => props.theme.navBackground};

  .ant-menu-submenu-title svg + span {
    transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    opacity: 1;
  }

  .ant-menu-inline-collapsed .ant-menu-submenu-title svg + span {
    opacity: 0;
  }
`;
const MenuWrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 40px;
  z-index: 100;
`;

/** sider */
@select(['header', 'setting'])
export default class Sider extends React.PureComponent<SiderProps, SiderState> {
  constructor(props: SiderProps) {
    super(props);
  }

  render() {
    const { header = {} as HeaderDefaultState, setting = {} as SettingState } = this.props;
    const menu = (() => {
      const theme = 'dark';
      if (setting.nav === 'left') {
        return (
          <SiderWrap trigger={null} width={230} collapsed={header.collapsed}>
            <LogoComponent />
            <MenuComponent mode={'inline'} theme={theme} />
          </SiderWrap>
        );
      } else if (setting.nav === 'top') {
        return (
          <MenuWrap>
            <MenuComponent mode={'horizontal'} theme={theme} logo={<LogoComponent />} />
          </MenuWrap>
        );
      } else {
        return <div />;
      }
    })();

    return menu;
  }
}

interface SiderState {}

interface SiderProps {
  header?: HeaderDefaultState;
  setting?: SettingState;
}
