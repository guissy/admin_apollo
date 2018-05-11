import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import { getFlatRoute, LoginState } from '../../login/Login.model';
import withLocale from '../../../utils/withLocale';
import { MenuItem } from '../sider/Menu.data';
import Immutable from 'immutable';
import { messageSuccess } from '../../../utils/showMessage';

const Content = styled.div`
  .name {
    display: inline-block;
    padding-left: 10px;
    border-left: 3px solid #333;
    font-size: 16px;
    color: #333;
    vertical-align: middle;
    line-height: normal;
  }
  .tip {
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
  }
`;
const DivWrap = styled.div`
  padding: 12px 24px 12px;
  background: #fff;
`;
const IconFav = styled.a`
  display: inline-block;
  font-size: 19px;
  color: rgb(255, 128, 64);
  line-height: 19px;

  &:hover {
    color: rgb(255, 128, 64);
  }
`;

// TODO: 该图标无法换颜色
const IconLink = styled.a`
  display: inline-block;
  font-size: 16px;
  line-height: 16px;
  color: rgb(85, 26, 139);
`;

interface Props {
  login?: LoginState;
  routing?: object;
  site?: (p: string) => React.ReactNode;
  dispatch?: Dispatch;
}
interface State {
  route: MenuItem;
  curIsFav: boolean;
}

function initState(login: LoginState = {} as LoginState) {
  // 默认非选入快捷方式
  const path = location.pathname;
  const curIsFav = getFlatRoute(login)
    .filter(route => route.isFav)
    .some(route => route.path === path); // 判断是否已经在快捷菜单
  return {
    curIsFav,
    route: getFlatRoute(login).find(route => route.path === path) || ({} as MenuItem)
  };
}

/** 标题栏 */
@withLocale
@select(['login', 'routing'])
export default class Title extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props): State {
    return initState(nextProps.login);
  }

  state = {
    route: {} as MenuItem,
    curIsFav: false
  };

  componentDidMount() {
    this.setState(initState(this.props.login));
  }

  toggleFav = () => {
    const { site = () => '' } = this.props;
    const { login = { route: [] } } = this.props;
    const {
      route: { index, parentIndex },
      curIsFav
    } = this.state;
    const loginRoute = Immutable.fromJS(login.route)
      .setIn([parentIndex, 'children', index, 'isFav'], !curIsFav)
      .toJS();
    this.setState({ curIsFav: !curIsFav });
    this.props.dispatch!({ type: 'login/writeShortcut', payload: { route: loginRoute } });
    if (!this.state.curIsFav) {
      messageSuccess(site('添加成功'));
    } else {
      messageSuccess(site('删除成功'));
    }
  }

  render() {
    const { site = () => null } = this.props;
    return (
      <Content>
        {window.location.pathname !== '/' ? (
          <DivWrap>
            <span className="name">{this.state.route.name}</span>
            <div className="tip">
              <Tooltip placement="right" title={site('添加到快捷菜单')}>
                <IconFav onClick={this.toggleFav}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={`#icon-${this.state.curIsFav ? 'shoucangjia' : 'shoucang1'}`} />
                  </svg>
                </IconFav>
              </Tooltip>
            </div>
            <div className="tip">
              <Tooltip placement="right" title={site('打开新窗口')}>
                <IconLink href={this.state.route.path} target="_blank">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={'#icon-dakaixinchuangkou'} />
                  </svg>
                </IconLink>
              </Tooltip>
            </div>
          </DivWrap>
        ) : (
          ''
        )}
      </Content>
    );
  }
}
