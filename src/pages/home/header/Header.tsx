import * as React from 'react';
import { Layout, Icon, Menu, Tooltip, Badge } from 'antd';
import Setting from './setting/Setting';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { Link } from 'dva/router';
import { LoginState } from '../../login/Login.model';
import { HeaderDefaultState } from './Header.model';
import styled from 'styled-components';
import withLocale from '../../../utils/withLocale';
import EasternTime from './easternTime/EasternTime';
import AudioComponent from './AudioComponent';
import { SettingState } from './setting/Setting.model';
import environment from '../../../utils/environment';

const CollapseBtn = styled(Icon)`
  color: ${props => props.theme.collapseBtn};
  height: inherit;
  line-height: inherit;
  font-size: 20px;
  padding: 0 24px;
  margin-left: -20px;
  margin-right: 10px;
  transition: all 0.3s, padding 0s;
  cursor: pointer;

  &:hover {
    background: #e6f7ff;
  }
`;
const Utils = styled(Menu)`
  //float: right;
  border: 0 none;
  background: transparent;
  line-height: inherit;

  > [class*='ant-menu'] {
    border-bottom: 0 none;
    color: inherit;

    &:hover {
      border-bottom: inherit;
    }
  }

  > .ant-menu-item:hover,
  > .ant-menu-item-active,
  > .ant-menu-submenu:hover,
  > .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover,
  &:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-item > a:hover {
    color: ${props => props.theme.utilsActive};
  }
`;
const MenuItem = styled(Menu.Item)`
  &:hover,
  > a:hover,
  &.ant-menu-item-selected > a,
  &.ant-menu-item-selected > a:hover {
    color: ${props => props.theme.utilsActive};
  }
`;
// tslint:disable-next-line:no-any
const BadgeWrap = styled(Badge as any)`
  color: inherit;
  [class*='ant-badge-count'] {
    height: 16px;
    line-height: 16px;
    min-width: 16px;
    padding: 0 2px;
  }
`;
const Username = styled.span`
  margin-right: 4px;
`;
const ItemIcon = styled(Icon)`
  margin-right: 4px;
`;

/** header */
@withLocale
@select(['login', 'header', 'setting'])
export default class Header extends React.PureComponent<HeaderProps, HeaderState> {
  static getDerivedStateFromProps(nextProps: HeaderProps, prevState: HeaderState) {
    const { offline_deposit, withdraw, common } = nextProps.header || ({} as HeaderDefaultState);
    return {
      offline_deposit: offline_deposit,
      withdraw: withdraw,
      common: common
    };
  }

  state = {
    showPanel: false,
    offline_deposit: 0,
    withdraw: 0,
    common: 0,
    time: 0,
    isOpen: false
  };

  private timer: number;
  private commonAudio: HTMLAudioElement;
  private withdrawAudio: HTMLAudioElement;
  private depositAudio: HTMLAudioElement;

  componentDidMount() {
    window.clearInterval(this.timer);
    this.queryMessage();
    this.timer = window.setInterval(() => {
      this.queryMessage();
    },                              30000);

    window.document.addEventListener('click', this.closePanel);
  }

  closePanel = () => {
    this.setState({ showPanel: false });
  }

  componentDidUpdate(prevProps: HeaderProps, prevState: HeaderState) {
    const { offline_deposit, withdraw, common } = this.props.header || ({} as HeaderDefaultState);
    const { offline_deposit: lastOfflineDeposit, withdraw: lastWithdraw, common: lastCommon } =
      prevProps.header || ({} as HeaderDefaultState);
    const { sound_message, sound_deposit, sound_withdraw } =
      this.props.setting || ({} as SettingState);

    // 在当前页停止播报，消息循环播报
    let audioList = [] as HTMLAudioElement[];
    const notInPathDeposit = !window.location.pathname.includes('/offlineReceipt');
    if (
      sound_deposit &&
      offline_deposit > 0 &&
      offline_deposit !== lastOfflineDeposit &&
      notInPathDeposit
    ) {
      audioList.push(this.depositAudio);
    }
    const notInPathWithdraw = !window.location.pathname.includes('/onlineReceipt');
    if (sound_withdraw && withdraw > 0 && withdraw !== lastWithdraw && notInPathWithdraw) {
      audioList.push(this.withdrawAudio);
    }
    // 循环
    if (sound_message && common > 0 && common !== lastCommon) {
      audioList.push(this.commonAudio);
    }
    if (audioList[0]) {
      audioList[0].play();
    }
    if (audioList[1]) {
      audioList[0].onended = () => {
        audioList[1].play();
      };
    }
    if (audioList[2]) {
      audioList[1].onended = () => {
        audioList[2].play();
      };
    }
    return null;
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
    window.document.removeEventListener('click', this.closePanel);
  }

  queryMessage = () => {
    this.props.dispatch!({ type: 'header/queryMessage', payload: {} });
  }

  showSetting = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // navtiveEvent.stopPropagation 不管用
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ showPanel: !this.state.showPanel });
  }
  showSettingPanel = (e: React.MouseEvent<HTMLDivElement>) => {
    // navtiveEvent.stopPropagation 不管用
    e.nativeEvent.stopImmediatePropagation();
  }

  onLogout = () => {
    this.props.dispatch!({
      type: 'login/logout',
      payload: {
        username: this.props.login.list.username,
        refresh_token: this.props.login.refresh_token,
        uid: this.props.login.list.id
      }
    });
  }

  // 折叠 sider
  toggleCollapsed = () => {
    const { header = {} as HeaderDefaultState } = this.props;
    this.props.dispatch!({
      type: 'header/switchCollapsed',
      payload: { collapsed: !header.collapsed }
    });
  }

  onOpenChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    this.setState({ isOpen: !this.state.isOpen });
    console.info(`🐞: `, e);
  }

  public render() {
    const {
      site = () => '',
      header = {} as HeaderDefaultState,
      setting = {} as SettingState,
      login = {} as LoginState
    } = this.props;
    const { showPanel, offline_deposit, withdraw, common } = this.state;
    const username = login.list.username;
    const headerStyle = setting.nav === 'top' ? { marginBottom: '40px' } : {};

    return (
      <>
        <style>
          {`
          .ant-layout-header {
            display: flex;
            justify-content: space-between;
            background: #fff;
            padding: 0;
            position: sticky;
            top: 0;
            z-index: 100;
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
          }`}
        </style>
        <Layout.Header style={headerStyle}>
          {setting.nav === 'left' ? (
            <CollapseBtn
              type={header.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggleCollapsed}
            />
          ) : (
            ''
          )}
          <EasternTime />
          <Utils mode="horizontal" selectable={false}>
            <Menu.Item key="depost">
              <Link to="/offlineReceipts">
                <Tooltip placement="bottom" title={<span>{site('公司入款')}</span>}>
                  <BadgeWrap count={offline_deposit}>{site('入款')}</BadgeWrap>
                </Tooltip>
              </Link>
              <AudioComponent name={'gsrk'} onRef={audio => (this.depositAudio = audio)} />
            </Menu.Item>
            <Menu.Item key="withdraw">
              <Link to="/memberGetOut">
                <Tooltip placement="bottom" title={<span>{site('会员提现')}</span>}>
                  <BadgeWrap count={withdraw}>{site('出款')}</BadgeWrap>
                </Tooltip>
              </Link>
              <AudioComponent name={'hytx'} onRef={audio => (this.withdrawAudio = audio)} />
            </Menu.Item>
            <Menu.Item key="news">
              <Link to="/sysMessage">
                <Tooltip placement="bottom" title={<span>{site('消息总数')}</span>}>
                  <BadgeWrap count={common}>{site('消息')}</BadgeWrap>
                </Tooltip>
              </Link>
              <AudioComponent name={'newMsg'} onRef={audio => (this.commonAudio = audio)} />
            </Menu.Item>
            <Menu.SubMenu
              title={
                <span>
                  <Username>{username}</Username>&nbsp;<Icon type="caret-up" />
                </span>
              }
              onOpenChange={this.onOpenChange}
            >
              <MenuItem key="password">
                <a>
                  <ItemIcon type="key" />
                  {site('修改密码')}
                </a>
              </MenuItem>
              <MenuItem key="logout">
                <a onClick={this.onLogout}>
                  <ItemIcon type="logout" />
                  {site('退出登录')}
                </a>
              </MenuItem>
            </Menu.SubMenu>
            <Menu.Item key="setting">
              <a onClick={e => this.showSetting(e)}>{site('设置')}</a>
            </Menu.Item>
          </Utils>
          {showPanel && (
            <div onClick={this.showSettingPanel}>
              <Setting />
            </div>
          )}
          {environment.isDev && (
            <style>{`
          .ant-notification-topRight {
            width: 600px;
          }
        `}</style>
          )}
        </Layout.Header>
      </>
    );
  }
}

interface HeaderProps {
  login?: LoginState;
  dispatch?: Dispatch;
  site?: (words: string) => React.ReactNode;
  header?: HeaderDefaultState;
  setting?: SettingState;
}

interface HeaderState {
  showPanel: boolean; // 设置面板
  offline_deposit: number; // 入款
  withdraw: number; // 出款
  common: number; // 消息
  isOpen: boolean; // subMenu展开关闭
}
