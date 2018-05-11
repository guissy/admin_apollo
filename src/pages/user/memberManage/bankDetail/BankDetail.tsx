import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { BankCardState } from './BankDetail.model';
import { EditFormComponent } from '../../../components/form/EditFormComponent';
import TableActionComponent from '../../../components/table/TableActionComponent';
import LinkComponent from '../../../components/link/LinkComponent';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import showBackMesaage from '../../../../utils/showMessage';
import { Button, Form, Input, Select, Table, Tag } from 'antd';

const { Item } = Form;
const Option = Select.Option;

const BankCardCon = styled.div`
  .header {
    h2 {
      text-align: center;
    }
    .tips {
      span {
        color: #ff0000;
      }
    }
    .btn-con {
      text-align: right;
    }
    margin-bottom: 10px;
  }
`;

interface Props {
  form?: any; // tslint:disable-line:no-any
  site?: (p: IntlKeys) => React.ReactNode;
  // tslint:disable-next-line:no-any
  dispatch?: Dispatch | any;
  userId: number;
  // tslint:disable-next-line:no-any
  bankCard?: BankCardState | any;
}
interface State {
  newVisible: boolean;
  editVisible: boolean;
  editing: object;
  cid: string; // 当前编辑银行卡id
}

interface ColumnsRecord {
  accountname: string;
  address: string;
  bank_name: string;
  card: string;
  card_name: string;
  code: string;
  created_time: string;
  h5_logo: string;
  id: string;
  logo: string;
  shortname: string;
  state: string;
  updated_time: string;
}

@withLocale
@Form.create()
@select('bankCard')
// tslint:disable-next-line:top-level-comment
export default class BankDetail extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newVisible: false,
      editVisible: false,
      editing: {},
      cid: ''
    };
  }
  componentDidMount() {
    this.loadData();
  }
  // 加载表格数据
  loadData = () => {
    this.props.dispatch({
      type: 'bankCard/loadBankList'
    });
    this.props.dispatch({
      type: 'bankCard/loadData',
      payload: {
        id: this.props.userId
      }
    });
  }
  // 更改状态
  onSetBankCardTtatus = (recode: ColumnsRecord) => {
    let cardStatus: number = recode.state === 'disabled' ? 1 : 0;
    this.props
      .dispatch({
        type: 'bankCard/doSetBankCardStatus',
        payload: {
          cid: recode.id,
          uid: this.props.userId,
          role: 1,
          status: cardStatus
        }
      })
      .then(showBackMesaage)
      .then(this.loadData.bind(this));
  }
  // 新增
  onNew = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
  }
  onAddBankCard = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
  }
  onAddSubmit = (values: object) => {
    // tslint:disable-next-line:no-any
    const params: any = values;
    // 处理后台需要的参数
    // tslint:disable-next-line:no-any
    params.bank_id = this.props.bankCard.bankList.filter((v: any) => {
      return v.name === params.bank_name;
    })[0].id;
    params.role = 1; // 用户传1
    params.uid = this.props.userId;

    return this.props
      .dispatch({
        type: 'bankCard/addBankCard',
        payload: params
      })
      .then(showBackMesaage)
      .then(this.loadData.bind(this));
  }
  // 编辑
  onEdit = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  onEditBankCard = (item: ColumnsRecord) => {
    this.setState({
      editVisible: !this.state.editVisible,
      editing: item,
      cid: item.id
    });
  }
  onEditSubmit = (values: object) => {
    // tslint:disable-next-line:no-any
    const params: any = values;
    // 处理后台需要的参数
    // tslint:disable-next-line:no-any
    params.bank_id = this.props.bankCard.bankList.filter((v: any) => {
      return v.name === params.bank_name;
    })[0].id;
    params.role = 1; // 用户传1
    params.uid = this.props.userId;
    params.cid = this.state.cid; // 编辑得传银行卡号

    return this.props
      .dispatch({
        type: 'bankCard/editBankCard',
        payload: params
      })
      .then(showBackMesaage)
      .then(this.loadData.bind(this));
  }
  // 配置
  config = (useFor: 'create' | 'edit' | 'table') => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('银行账号'),
        dataIndex: 'card',
        formItemRender: () => <Input />,
        formRules: () => [
          { pattern: /^(\d{16,19})$/, message: site('银行账号必须为16到19个纯数字组成') },
          { required: true, message: site('银行账号为必填') }
        ]
      },
      {
        title: site('银行名称'),
        dataIndex: 'bank_name',
        formItemRender: () => {
          if (useFor === 'create' || 'edit') {
            return (
              <Select>
                {this.props.bankCard.bankList.map((v: { id: string; name: string }, i: number) => {
                  return (
                    <Option value={v.name} key={i}>
                      {v.name}
                    </Option>
                  );
                })}
              </Select>
            );
          } else {
            return null;
          }
        },
        formRules: rules
      },
      {
        title: site('开户支行'),
        dataIndex: 'address',
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        title: site('户名'),
        dataIndex: 'accountname',
        formItemRender: () => (useFor === 'create' ? <Input /> : <Input disabled={true} />),
        formRules: rules
      },
      {
        title: site('状态'),
        dataIndex: 'state',
        render: (text: string) => {
          if (useFor === 'table') {
            if (text === 'enabled') {
              return <Tag className="account-opened">{site('启用')}</Tag>;
            } else if (text === 'disabled') {
              return <Tag className="account-close">{site('停用')}</Tag>;
            } else {
              return <Tag className="account-disabled">{site('删除')}</Tag>;
            }
          } else {
            return null;
          }
        },
        formItemRender: () => null
      },
      {
        title: site('建立时间'),
        dataIndex: 'created_time',
        formItemRender: () => null
      },
      {
        title: site('最后修改时间'),
        dataIndex: 'updated_time',
        formItemRender: () => null
      },
      {
        title: site('操作'),
        dataIndex: '',
        render: (text: string, record: ColumnsRecord) => {
          return (
            <TableActionComponent>
              <LinkComponent
                hidden={record.state === 'deleted'}
                onClick={() => this.onEditBankCard(record)}
              >
                {site('修改')}
              </LinkComponent>
              <LinkComponent
                onClick={() => this.onSetBankCardTtatus(record)}
                hidden={record.state === 'disabled' || record.state === 'deleted'}
              >
                {site('停用')}
              </LinkComponent>
              <LinkComponent
                onClick={() => this.onSetBankCardTtatus(record)}
                hidden={record.state === 'enabled' || record.state === 'deleted'}
              >
                {site('启用')}
              </LinkComponent>
            </TableActionComponent>
          );
        },
        formItemRender: () => null
      }
    ];
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { site = () => null, form, bankCard } = this.props;
    const { tableData, isLoading } = bankCard;
    const { newVisible, editVisible, editing } = this.state;
    return (
      <BankCardCon>
        <div className="header">
          <h2>{site('银行信息')}</h2>
          <div className="tips">
            <span>{site('注')}:</span>
            {site('当会员存在真实姓名，新增或编辑银行卡默认户名为会员的真实姓名！')}
          </div>
          <div className="btn-con">
            <Button type="primary" size="small" onClick={this.onAddBankCard}>
              {site('新增银行卡')}
            </Button>
          </div>
        </div>
        <EditFormComponent
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('添加银行账号')}
          modalVisible={newVisible}
          onCancel={this.onNew}
          onSubmit={this.onAddSubmit}
        />
        <EditFormComponent
          form={form}
          fieldConfig={this.config('edit')}
          onSubmit={this.onEditSubmit}
          modalTitle={site('修改银行账号')}
          modalVisible={editVisible}
          onCancel={this.onEdit}
          values={editing}
        />
        <Table
          columns={this.config('table')}
          dataSource={tableData}
          bordered={true}
          loading={isLoading}
        />
      </BankCardCon>
    );
  }
}
