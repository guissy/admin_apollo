import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { MemberLabelState } from './MemberLabel.model';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { showMessageForResult } from '../../../utils/showMessage';
import withLocale from '../../../utils/withLocale';
import { Form, Input } from 'antd';
const Textarea = Input.TextArea;

const MemberLabelCon = styled.div``;

interface Props {
  form?: WrappedFormUtils;
  site?: (words: string) => React.ReactNode;
  dispatch?: Dispatch;
  memberLabel?: MemberLabelState;
}
interface State {
  nowId: string;
  newVisible: boolean;
  editVisible: boolean;
  editing: object;
}

/** 会员标签 */
@withLocale
@Form.create()
@select('memberLabel')
export default class MemberLabel extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nowId: '', // 编辑时暂存当前item的id
      newVisible: false,
      editVisible: false,
      editing: {}
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props.dispatch!({
      type: 'memberLabel/loadData',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    console.log(pageSize);
    return this.props.dispatch!({
      type: 'memberLabel/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  // 新增
  onAddLabel = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
    console.log(this.props.memberLabel);
  }
  onCloseAddLabelModal = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
  }
  onAddLabelSubmit = (values: { title: string; content: string }) => {
    const params: { desc: string; id: number; name: string } = {
      desc: values.content,
      name: values.title,
      id: -1
    };
    return this.props.dispatch!({
      type: 'memberLabel/addMemberLabel',
      payload: params
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 编辑
  onEditLaber = ({ id, ...obj }: { id: string }) => {
    this.setState({
      editVisible: !this.state.editVisible,
      editing: obj,
      nowId: id
    });
  }
  onCloseEditLabelModal = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  onEditLabelSubmit = (values: { title: string; content: string }) => {
    const params: { desc: string; id: string; name: string } = {
      desc: values.content,
      name: values.title,
      id: this.state.nowId
    };
    return this.props.dispatch!({
      type: 'memberLabel/editMemberLabel',
      payload: params
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 删除
  onDeleteLabel = (id: string) => {
    this.props.dispatch!({
      type: 'memberLabel/deleteMemberLabel',
      payload: {
        id: id
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 配置
  config = () => {
    const { site = () => null } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('标签名称'),
        dataIndex: 'title',
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        title: site('描述'),
        dataIndex: 'content',
        formItemRender: () => <Textarea />
      },
      {
        title: site('建立人'),
        dataIndex: 'admin_name',
        formItemRender: () => null
      },
      {
        title: site('建立时间'),
        dataIndex: 'inserted',
        formItemRender: () => null
      },
      {
        title: site('操作'),
        dataIndex: 'action',
        render: (text: string, record: { id: string }) => {
          return (
            <TableActionComponent>
              <LinkComponent onClick={() => this.onEditLaber(record)}>{site('编辑')}</LinkComponent>
              <LinkComponent confirm={true} onClick={() => this.onDeleteLabel(record.id)}>
                {site('删除')}
              </LinkComponent>
            </TableActionComponent>
          );
        },
        formItemRender: () => null
      }
    ];
  }
  render() {
    const { site = () => null, form, memberLabel = {} as MemberLabelState } = this.props;
    const { newVisible, editVisible, editing } = this.state;
    return (
      <MemberLabelCon>
        <ButtonBarComponent onCreate={this.onAddLabel} />
        {/* 新增 */}
        <EditFormComponent
          form={form}
          fieldConfig={this.config()}
          modalTitle={site('新增')}
          modalVisible={newVisible}
          onCancel={this.onCloseAddLabelModal}
          onSubmit={this.onAddLabelSubmit}
        />
        {/* 编辑 */}
        <EditFormComponent
          form={form}
          fieldConfig={this.config()}
          modalTitle={site('编辑')}
          modalVisible={editVisible}
          onSubmit={this.onEditLabelSubmit}
          onCancel={this.onCloseEditLabelModal}
          values={editing}
        />
        {/* 表格 */}
        <TableComponent
          dataSource={memberLabel.data ? memberLabel.data : []}
          columns={this.config()}
          form={form}
          pagination={getPagination(memberLabel.attributes, this.onPageChange)}
        />
      </MemberLabelCon>
    );
  }
}
