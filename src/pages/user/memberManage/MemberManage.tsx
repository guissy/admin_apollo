import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { MemberManageState } from './MemberManage.model';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import DetailModal, { ViewFormConfig } from '../../components/modal/DetailModal';
import { SearchUI, SearchFormConfig } from '../../components/form/SearchUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import QuickDate from '../../components/date/QuickDateComponent';
import MemberDetail from './MemberDetail';
import { showMessageForResult } from '../../../utils/showMessage';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { Table, Icon, Tag, Pagination, Modal, Row, Col, Select, Input, Form } from 'antd';

const Option = Select.Option;
const MemberManagementWrap = styled.div`
  .img {
    width: 100px;
    height: 100px;
    display: inline-block;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
`;

interface Props {
  form?: any; // tslint:disable-line:no-any
  site?: (p: IntlKeys) => React.ReactNode;
  memberManage: MemberManageState;
  dispatch: Dispatch;
}
interface State {
  detailViewVisible: boolean;
  itemObj: object;
  isDetailVisible: boolean;
  userId: number;
  isTagVisible: boolean;
  userName: string;
  tagId: string;
}
interface ColumnsRecord {
  id: number;
  username: string;
  truename: string;
  agent: string;
  amount: number;
  created: string;
  channel: string;
  tags: string;
  online: string;
  state: string;
  tid: string;
  tags_id: string;
}

/** 会员管理 */
@withLocale
@Form.create()
@select('memberManage')
// tslint:disable-next-line:top-level-comment
export default class MemberManage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      detailViewVisible: false,
      isDetailVisible: false,
      itemObj: {},
      userId: 0,
      isTagVisible: false,
      userName: '',
      tagId: ''
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'memberManage/queryTableData',
      payload: {
        name: 'xiaoming',
        page: 1,
        page_size: 20
      }
    });
    this.props.dispatch({
      type: 'memberManage/loadTagList',
      payload: {}
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    this.props.dispatch({
      type: 'memberManage/loadData',
      payload: {
        name: 'xiaoming',
        page: page,
        page_size: pageSize
      }
    });
  }
  // 标签
  onAddLabel = (item: ColumnsRecord) => {
    console.log(item);
    this.setState({
      tagId: item.tags_id,
      userId: item.id,
      userName: item.username,
      isTagVisible: !this.state.isTagVisible
    });
  }
  onDoTag = () => {
    this.props
      .dispatch({
        type: 'memberManage/doSetUserTags',
        payload: {
          id: this.state.userId,
          tag: this.state.tagId
        }
      })
      .then(showMessageForResult)
      .then(() => {
        this.setState({
          tagId: '',
          isTagVisible: !this.state.isTagVisible
        });
        // 刷新表格
      });
  }
  onHiddenTag = () => {
    this.setState({
      tagId: '',
      isTagVisible: !this.state.isTagVisible
    });
  }
  onChangeTag = (value: string) => {
    console.log(value);
    this.setState({
      tagId: value
    });
  }
  onCancelTag = (item: ColumnsRecord) => {
    this.props
      .dispatch({
        type: 'memberManage/doSetUserTags',
        payload: {
          id: item.id,
          tag: 0
        }
      })
      .then(showMessageForResult)
      .then(() => {
        // 刷新表格
      });
  }
  // 会员资料详情
  onDetail = (item: ColumnsRecord) => {
    this.setState({
      isDetailVisible: !this.state.isDetailVisible,
      userId: item.id
    });
  }
  onCallBackPage = () => {
    this.setState({
      isDetailVisible: !this.state.isDetailVisible
    });
  }
  //   启用,  停用, 解封, 封号
  onSetUserStatus = (item: ColumnsRecord, flag: string) => {
    let oPayload: { ids: number; state: number } = { ids: item.id, state: 0 };
    switch (flag) {
      case 'enable':
        oPayload.state = 1;
        break;
      case 'disable':
        oPayload.state = 0;
        break;
      case 'close':
        oPayload.state = 4;
        break;
      default:
        return;
    }
    this.props
      .dispatch({
        type: 'memberManage/doSetUserStatus',
        payload: oPayload
      })
      .then(showMessageForResult)
      .then(() => {
        // 刷新表格
      });
  }
  // 时间选择
  onGetSelectTime = (obj: object) => {
    console.log(obj);
  }
  // 查看
  onViewDetail = (item: ColumnsRecord) => {
    this.setState({
      itemObj: item,
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  onViewCallback = () => {
    this.setState({
      itemObj: {},
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  // 字段配置
  config = (useFor: 'table' | 'search' | 'view'): ViewFormConfig[] => {
    const { site = () => null, memberManage } = this.props;
    const { tagList } = memberManage;
    return [
      {
        title: site('会员账号'),
        dataIndex: 'username',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('真实姓名'),
        dataIndex: 'truename',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('上级代理'),
        dataIndex: 'agent',
        render: (text: string) => <a>{text}</a>,
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('总余额'),
        dataIndex: 'amount',
        formItemRender: () => null
      },
      {
        title: site('注册时间'),
        dataIndex: 'created',
        formItemRender: () => (useFor === 'search' ? <QuickDate /> : null)
      },
      {
        title: site('Ip'),
        dataIndex: 'ip',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('注册来源'),
        dataIndex: 'channel',
        render: (text: string) => {
          if (text === 'pc') {
            return <span>PC</span>;
          } else if (text === 'h5') {
            return <span>H%</span>;
          } else if (text === 'app') {
            return <span>APP</span>;
          } else {
            return <span>其他</span>;
          }
        },
        formItemRender: () => {
          if (useFor === 'search') {
            return (
              <Select>
                <Option value={'pc'}>{site('PC')}</Option>
                <Option value={'h5'}>{site('H5')}</Option>
                <Option value={'reserved'}>{site('其他')}</Option>
              </Select>
            );
          } else {
            return null;
          }
        }
      },
      {
        title: site('标签'),
        dataIndex: 'tags',
        formItemRender: () => {
          if (useFor === 'search') {
            return (
              <Select>
                {tagList.map((item: { title: string }, index) => {
                  return (
                    <Option value={item.title} key={index}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            );
          } else {
            return null;
          }
        }
      },
      {
        title: site('在线状态'),
        dataIndex: 'online',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className="account-opened">{site('在线')}</Tag>;
          } else {
            return <Tag className="account-close">{site('离线')}</Tag>;
          }
        },
        viewRender: () => '',
        formItemRender: () => {
          if (useFor === 'search') {
            return (
              <Select>
                <Option value={1}>{site('在线')}</Option>
                <Option value={0}>{site('离线')}</Option>
              </Select>
            );
          } else {
            return null;
          }
        }
      },
      {
        title: site('账号状态'),
        dataIndex: 'state',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className="account-opened">{site('启用')}</Tag>;
          } else if (text === '0') {
            return <Tag className="account-close">{site('停用')}</Tag>;
          } else if (text === '4') {
            return <Tag className="account-disabled">{site('封号')}</Tag>;
          } else {
            return <Tag>{site('未知')}</Tag>;
          }
        },
        formItemRender: () => {
          if (useFor === 'search') {
            return (
              <Select>
                <Option value={1}>{site('启用')}</Option>
                <Option value={0}>{site('停用')}</Option>
                <Option value={4}>{site('封号')}</Option>
              </Select>
            );
          } else {
            return null;
          }
        }
      },
      {
        title: site('操作'),
        dataIndex: '',
        notInView: true,
        render: (text: string, record: ColumnsRecord) => {
          let stateButton: React.ReactNode = '';
          let tagButton: React.ReactNode = '';
          if (record.state === '0') {
            stateButton = (
              <LinkComponent onClick={() => this.onSetUserStatus(record, 'enable')}>
                {site('启用')}
              </LinkComponent>
            );
          } else if (record.state === '4') {
            stateButton = (
              <LinkComponent onClick={() => this.onSetUserStatus(record, 'enable')}>
                {site('解封')}
              </LinkComponent>
            );
          } else {
            stateButton = [
              <LinkComponent key="0">{site('停用')}</LinkComponent>,
              <LinkComponent key="2">{site('封号')}</LinkComponent>
            ];
          }
          if (record.tags !== null) {
            tagButton = <LinkComponent key="0">{site('取消标签')}</LinkComponent>;
          } else {
            tagButton = null;
          }

          return (
            <TableActionComponent>
              <LinkComponent onClick={() => this.onAddLabel(record)}>
                {site('打标签')}
              </LinkComponent>
              <LinkComponent onClick={() => this.onDetail(record)}>{site('资料')}</LinkComponent>
              <LinkComponent>{site('调整余额')}</LinkComponent>
              <LinkComponent>{site('下注')}</LinkComponent>
              <LinkComponent>{site('现金')}</LinkComponent>
              {stateButton}
              {tagButton}
              <LinkComponent>{site('限额')}</LinkComponent>
              <LinkComponent onClick={() => this.onViewDetail(record)}>
                {site('查看')}
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
    const { site = () => null, form, memberManage } = this.props;
    const { tagList, data, attributes } = memberManage;
    const {
      detailViewVisible,
      itemObj,
      isTagVisible,
      userName,
      isDetailVisible,
      userId,
      tagId
    } = this.state;
    return (
      <MemberManagementWrap>
        <h3>{site('用户管理')}</h3>
        {/* 详情 */}
        <DetailModal
          title="会员详情"
          visible={detailViewVisible}
          columns={this.config('view')}
          itemObj={itemObj}
          onClose={this.onViewCallback}
        />
        {/* 搜索 */}
        <SearchUI
          form={form}
          fieldConfig={this.config('search')}
          actionType="memberManage/queryTableData"
          pageSize={20}
        />
        {/* 会员列表 */}
        <TableComponent
          dataSource={data ? data : []}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(attributes, this.onPageChange)}
        />
        {/* 打标签modal */}
        <Modal
          title={site('打标签')}
          visible={isTagVisible}
          onOk={this.onDoTag}
          onCancel={this.onHiddenTag}
        >
          <div>
            <Row>
              <Col span={8}>{site('用户名')}</Col>
              <Col span={16}>{userName}</Col>
            </Row>
            <Row>
              <Col span={8}>{site('标签')}</Col>
              <Col span={16}>
                {
                  <Select value={tagId} style={{ width: 150 }} onChange={this.onChangeTag}>
                    {tagList.map((option: { id: string; title: string }, index: number) => {
                      return (
                        <Option value={option.id} key={index}>
                          {option.title}
                        </Option>
                      );
                    })}
                  </Select>}
              </Col>
            </Row>
          </div>
        </Modal>
        {/* 会员详细资料modal */}
        <Modal visible={isDetailVisible} width="1000px" closable={false} footer={false}>
          <MemberDetail callBackPage={this.onCallBackPage} userId={userId} />
        </Modal>
      </MemberManagementWrap>
    );
  }
}
