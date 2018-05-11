import * as React from 'react';
import { Menu, Tooltip } from 'antd';
import { SiteProps } from '../../../utils/withLocale';
import { Link } from 'react-router-dom';
import { getFlatRoute, LoginState } from '../../login/Login.model';

interface Props extends SiteProps {
  login?: LoginState;
}

const MenuShortcut: React.SFC<Props> = ({ login, site }: Props) => {
  const menus = getFlatRoute(login).filter(route => route.isFav);
  const tip = menus.length === 0 ? site!('您还没有添加快捷菜单呢') : site!('快捷菜单');
  return (
    <Menu.SubMenu
      key="shortcut"
      title={
        <span>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-caidanguanli" />
          </svg>
          <span>
            <Tooltip placement="bottom" title={tip}>
              {site!('快捷')}
            </Tooltip>
          </span>
        </span>
      }
    >
      {menus.map((route, i) => (
        <Menu.Item key={i.toString()}>
          <Link to={route.path}>{route.name}</Link>
        </Menu.Item>
      ))}
    </Menu.SubMenu>
  );
};

/** 快捷菜单 */
export default MenuShortcut;
