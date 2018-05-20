import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { IpBlackListState } from './IpBlackList.model';
import styled from 'styled-components';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { SearchUI, SearchFormConfig } from '../../components/form/SearchUI';
import { EditFormUI } from '../../components/form/EditFormUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { Button, Form, Input, Select, Tag } from 'antd';

const Option = Select.Option;
const { TextArea } = Input;
const IpBlackCon = styled.div`
  .btn-con {
    text-align: right;
    margin-bottom: 10px;
  }
`;

interface Props {
  form?: any; // tslint:disable-line:no-any
  site?: (p: IntlKeys) => React.ReactNode;
  dispatch?: Dispatch;
  ipBlackList: IpBlackListState;
}
interface State {
  newVisible: boolean;
  editVisible: boolean;
  editing: ColumnsRecord;
}
// 列表数据类型
interface ColumnsRecord extends ColumnsModal {
  id: string;
}
// modal类型
interface ColumnsModal {
  ip: string;
  memo: string;
  status: string;
}

/** Ip黑名单 */
@withLocale
@Form.create()
@select('ipBlackList')
// tslint:disable-next-line:top-level-comment
export default class IpBlackList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newVisible: false,
      editVisible: false,
      editing: {
        id: '',
        ip: '',
        memo: '',
        status: ''
      }
    };
  }
  componentDidMount() {
    this.loadData();
  }
  // load
  loadData = () => {
    this.props.dispatch!({
      type: 'ipBlackList/loadData',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    this.props.dispatch!({
      type: 'ipBlackList/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  // 新增IP
  onAddIpBlack = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
  }
  onCancelAddIpModal = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
  }
  onAddSubmit = (values: ColumnsModal) => {
    return this.props.dispatch!({
      type: 'ipBlackList/addIpBlack',
      payload: {
        ip: [values.ip],
        memo: values.memo,
        status: values.status
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 编辑IP
  onEditIpBlack = (text: string, recode: ColumnsRecord) => {
    this.setState({
      editVisible: !this.state.editVisible,
      editing: recode
    });
  }
  onCancelEditIpModal = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  onEditSubmit = (values: ColumnsModal) => {
    return this.props.dispatch!({
      type: 'ipBlackList/editIpBlack',
      payload: {
        id: this.state.editing.id,
        ip: [values.ip],
        memo: values.memo,
        status: values.status
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 删除ip
  onDeleteIpBlack = (ids: string) => {
    this.props.dispatch!({
      type: 'ipBlackList/deleteIpBlack',
      payload: {
        ids: ids
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 允许和限制ip
  onEditStatus = (ids: Array<string>, status: number) => {
    this.props.dispatch!({
      type: 'ipBlackList/editIpBlackStatus',
      payload: {
        ids: ids,
        status: status
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  config = (useFor: 'table' | 'create' | 'edit' | 'search') => {
    const { site = () => null } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('IP'),
        dataIndex: 'ip',
        formItemRender: () => <Input />,
        formRules: () => (useFor !== 'search' ? [{ required: true }] : [])
      },
      {
        title: site('建立时间'),
        dataIndex: 'created',
        formItemRender: () => null
      },
      {
        title: site('最后修改时间'),
        dataIndex: 'updated',
        formItemRender: () => null
      },
      {
        title: site('备注'),
        dataIndex: 'memo',
        formItemRender: () => (useFor !== 'search' ? <TextArea /> : null)
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        formItemRender: () => {
          if (useFor !== 'search') {
            return (
              <Select style={{ width: 120 }}>
                <Option value="0">{site('允许')}</Option>
                <Option value="1">{site('禁止')}</Option>
              </Select>
            );
          } else {
            return (
              <Select style={{ width: 120 }}>
                <Option value="0">{site('允许')}</Option>
                <Option value="1">{site('禁止')}</Option>
              </Select>
            );
          }
        },
        render: (text: string, recode: object) => {
          if (text === '0') {
            return <Tag className="account-opened">{site('允许')}</Tag>;
          } else {
            return <Tag className="account-close">{site('禁止')}</Tag>;
          }
        },
        formRules: () => (useFor !== 'search' ? [{ required: true }] : [])
      },
      {
        title: site('操作'),
        dataIndex: 'action',
        formItemRender: () => null,
        render: (text: string, recode: ColumnsRecord) => {
          const statusBtn: React.ReactNode =
            recode.status === '0' ? (
              <LinkComponent confirm={true} onClick={() => this.onEditStatus([recode.id], 1)}>
                {site('限制')}
              </LinkComponent>
            ) : (
              <LinkComponent confirm={true} onClick={() => this.onEditStatus([recode.id], 0)}>
                {site('允许')}
              </LinkComponent>
            );
          return (
            <TableActionComponent>
              {statusBtn}
              <LinkComponent confirm={true} onClick={() => this.onDeleteIpBlack(recode.id)}>
                {site('删除')}
              </LinkComponent>
              <LinkComponent onClick={() => this.onEditIpBlack(text, recode)}>
                {site('编辑')}
              </LinkComponent>
            </TableActionComponent>
          );
        }
      }
    ];
  }
  render() {
    const { site = () => null, form, ipBlackList = {} as IpBlackListState } = this.props;
    const { newVisible, editVisible, editing } = this.state;
    return (
      <IpBlackCon>
        <div className="btn-con">
          <Button type="primary" size="small" onClick={this.onAddIpBlack}>
            {site('新增IP')}
          </Button>
        </div>
        {/* 搜索 */}
        <SearchUI
          form={this.props.form}
          fieldConfig={this.config('search')}
          actionType="ipBlackList/loadData"
          pageSize={20}
        />
        {/* 新增 */}
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增IP')}
          modalVisible={newVisible}
          onCancel={this.onCancelAddIpModal}
          onSubmit={this.onAddSubmit}
        />
        {/* 编辑 */}
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑IP')}
          modalVisible={editVisible}
          onCancel={this.onCancelEditIpModal}
          onSubmit={this.onEditSubmit}
          values={editing}
        />
        {/* 黑名单列表 */}
        <TableComponent
          dataSource={ipBlackList.data ? ipBlackList.data : []}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(ipBlackList.attributes, this.onPageChange)}
        />
      </IpBlackCon>
    );
  }
}
