import * as React from 'react';
import styled from 'styled-components';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { Button } from 'antd';
import { Dispatch } from 'dva';
import { initial } from 'lodash/fp';
import { goBack, push } from 'react-router-redux';
import * as H from 'history';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router';
import { compose } from 'react-apollo';
import { LoginState } from '../../login/Login.model';

interface Hoc {
  site: (p: string, o?: object) => React.ReactNode;
  dispatch: Dispatch;
  location: H.Location;
  history: H.History;
  login: LoginState;
}

interface Props extends Partial<Hoc> {}

/** Back */
@withLocale
@compose(withRouter)
@select('login')
@autobind
export default class Back extends React.PureComponent<Props, {}> {
  state = {};

  goParent() {
    const { site, dispatch, location, history, login } = this.props as Hoc;
    const parent = initial(location.pathname.split('/')).join('/');
    const visited = login.visited.slice(0);
    visited.pop();
    const last = visited.pop();
    dispatch(last && last.pathname === parent ? goBack() : push(parent));
  }

  render(): React.ReactNode {
    const { site } = this.props as Hoc;
    return (
      <Button onClick={this.goParent} type="primary">
        {site('返回')}
      </Button>
    );
  }
}
