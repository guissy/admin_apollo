import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { MemberSettingState } from './MemberSetting.model';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import showMessage from '../../../../utils/showMessage';
import { message, Button, Checkbox, Spin, Popconfirm } from 'antd';

const MemberSetCon = styled.div`
  h2 {
    text-align: center;
  }
  .btn-con {
    border: 1px solid #ccc;
    padding: 10px;
    clear: both;
    > div {
      margin-bottom: 10px;
      span:nth-child(1) {
        margin-right: 10px;
      }
      button {
        margin-left: 10px;
      }
      .s-flag {
        color: #096;
      }
    }
  }
`;

interface Props {
  site?: (p: IntlKeys) => React.ReactNode;
  userId: number;
  // tslint:disable-next-line:no-any
  dispatch?: Dispatch | any;
  memberSetting?: MemberSettingState;
}
interface State {
  auth: string;
  status: string;
  transfer: Array<string>;
}

@withLocale
@select('memberSetting')
// tslint:disable-next-line:top-level-comment
export default class MemberSetting extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  componentWillMount() {
    this.loadData();
  }
  loadData = () => {
    this.props.dispatch({
      type: 'memberSetting/loadData',
      payload: {
        id: this.props.userId
      }
    });
  }
  // tslint:disable-next-line:no-any
  onSaveSet = (auth: string, e: any) => {
    if (auth === 'refuse_withdraw' || auth === 'refuse_sale' || auth === 'refuse_rebate') {
      this.setState({
        auth: auth,
        status: e.target.checked ? '1' : '0'
      });
    } else {
      // 当禁止额度的时候处理status参数
      const { memberSetting = {} as MemberSettingState } = this.props;
      if (memberSetting.memberSetInfo.refuse_transfer) {
        const transferObj: object = memberSetting.memberSetInfo.refuse_transfer;
        // 过滤选中禁止额度选项
        const transferArr = Object.keys(transferObj).filter(item => {
          return item === auth ? e.target.checked : transferObj[item];
        });
        this.setState({
          auth: 'refuse_transfer',
          status: transferArr.join(',')
        });
      }
    }
  }
  // 权限确认
  onPerConfirm = () => {
    this.props
      .dispatch({
        type: 'memberSetting/permissionsSet',
        payload: {
          ids: this.props.userId,
          auth: this.state.auth,
          status: this.state.status
        }
      })
      .then(showMessage)
      .then(this.loadData.bind(this));
  }
  // 状态确认
  onStatusConfirm = (sType: string, val: string) => {
    const { memberSetting = {} as MemberSettingState } = this.props;
    if (sType === 'status') {
      this.props
        .dispatch({
          type: 'memberSetting/statusSet',
          payload: {
            ids: this.props.userId,
            state: parseInt(val, 10)
          }
        })
        .then(showMessage)
        .then(this.loadData.bind(this));
    } else if (sType === 'm') {
      this.props
        .dispatch({
          type: 'memberSetting/removeBind',
          payload: {
            uid: this.props.userId,
            role: memberSetting.memberSetInfo.role
          }
        })
        .then(showMessage)
        .then(this.loadData.bind(this));
    } else {
      this.props
        .dispatch({
          type: 'memberSetting/kickedOutOnline',
          payload: {
            ids: this.props.userId,
            online: '0'
          }
        })
        .then(showMessage)
        .then(this.loadData.bind(this));
    }
  }
  render() {
    const { site = () => null } = this.props;
    const { memberSetting = {} as MemberSettingState } = this.props;
    const {
      state,
      is_mtoken_bind,
      online,
      refuse_withdraw,
      refuse_sale,
      refuse_rebate,
      refuse_transfer
    } = memberSetting.memberSetInfo;

    let accountStatus: React.ReactNode = '';
    if (state) {
      if (state === '1') {
        accountStatus = (
          <div>
            <span>{site('账号状态')}</span>
            <span className="s-flag">{site('启用')}</span>
            <Popconfirm
              title={site('是否确认停用该会员？')}
              onConfirm={this.onStatusConfirm.bind(this, 'status', '0')}
            >
              <Button type="primary" size="small">
                {site('停用')}
              </Button>
            </Popconfirm>
          </div>
        );
      } else {
        accountStatus = (
          <div>
            <span>{site('账号状态')}</span>
            <span className="s-flag">{site('停用')}</span>
            <Popconfirm
              title={site('是否确认启用该会员？')}
              onConfirm={this.onStatusConfirm.bind(this, 'status', '1')}
            >
              <Button type="primary" size="small">
                {site('启用')}
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
    let mTokenStatus: React.ReactNode = '';
    if (is_mtoken_bind) {
      if (is_mtoken_bind === '1') {
        mTokenStatus = (
          <div>
            <span>{site('M令牌状态')}</span>
            <span className="s-flag">{site('已绑定')}</span>
            <Popconfirm
              title={site('是否确认M令牌解绑？')}
              onConfirm={this.onStatusConfirm.bind(this, 'm', '1')}
            >
              <Button type="primary" size="small">
                {site('解绑')}
              </Button>
            </Popconfirm>
          </div>
        );
      } else {
        mTokenStatus = (
          <div>
            <span>{site('M令牌状态')}</span>
            <span className="s-flag">{site('未绑定')}</span>
          </div>
        );
      }
    }
    let onlineStatus: React.ReactNode = '';
    if (online !== null && online !== undefined) {
      if (online === 1) {
        onlineStatus = (
          <div>
            <span>{site('在线状态')}</span>
            <span className="s-flag">{site('在线')}</span>
            <Popconfirm
              title={site('是否确认踢线该会员？')}
              onConfirm={this.onStatusConfirm.bind(this, 'online', '1')}
            >
              <Button type="primary" size="small">
                {site('踢出')}
              </Button>
            </Popconfirm>
          </div>
        );
      } else {
        onlineStatus = (
          <div>
            <span>{site('在线状态')}</span>
            <span className="s-flag">{site('离线')}</span>
          </div>
        );
      }
    }

    let transferObj: object = refuse_transfer;
    const transferKeys: Array<string> = Object.keys(transferObj);
    return (
      <MemberSetCon>
        <Spin size="large" spinning={memberSetting.loading}>
          <h2>会员设置</h2>
          <div className="btn-con">
            {accountStatus}
            {mTokenStatus}
            {onlineStatus}
            <div>
              <span>{site('权限设置')}</span>
              <span>
                <Popconfirm
                  title={'确认' + (refuse_withdraw === '1' ? '停用' : '启用') + '禁止提款'}
                  onConfirm={this.onPerConfirm}
                >
                  <Checkbox
                    onChange={this.onSaveSet.bind(this, 'refuse_withdraw')}
                    checked={refuse_withdraw === '1'}
                  >
                    {site('禁止提款')}
                  </Checkbox>
                </Popconfirm>
                <Popconfirm
                  title={'确认' + (refuse_sale === '1' ? '停用' : '启用') + '禁止优惠'}
                  onConfirm={this.onPerConfirm}
                >
                  <Checkbox
                    onChange={this.onSaveSet.bind(this, 'refuse_sale')}
                    checked={refuse_sale === '1'}
                  >
                    {site('禁止优惠')}
                  </Checkbox>
                </Popconfirm>
                <Popconfirm
                  title={'确认' + (refuse_rebate === '1' ? '停用' : '启用') + '禁止返水'}
                  onConfirm={this.onPerConfirm}
                >
                  <Checkbox
                    onChange={this.onSaveSet.bind(this, 'refuse_rebate')}
                    checked={refuse_rebate === '1'}
                  >
                    {site('禁止返水')}
                  </Checkbox>
                </Popconfirm>
              </span>
            </div>
            <div>
              <span>{site('禁止额度转换')}</span>
              <span>
                {transferKeys.map((v, i) => (
                  <Popconfirm
                    key={i}
                    title={
                      '确认' + (transferObj[v] === 1 ? '停用' : '启用') + '禁止' + v + '额度转换'
                    }
                    onConfirm={this.onPerConfirm}
                  >
                    <Checkbox checked={transferObj[v]} onChange={this.onSaveSet.bind(this, v)}>
                      {v}
                    </Checkbox>
                  </Popconfirm>
                ))}
              </span>
            </div>
          </div>
        </Spin>
      </MemberSetCon>
    );
  }
}
