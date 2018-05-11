import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Row, Col, Table, Tag, Button, Modal, message, Form, Input, Select } from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { TableRow, AgentLinkState } from './AgentLink.model';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import RefreshComponent from '../../components/refresh/RefreshComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { hostNamePattern } from '../../../utils/formRule';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

interface Props {
  dispatch: Dispatch;
  site: (p: IntlKeys, values?: object) => React.ReactNode;
  agentLink: AgentLinkState;
  form: WrappedFormUtils;
}

interface State {
  visible: boolean;
  modalTitle: string;
  domain: string;
  comment: string;
  status: string;
  id: string;
}

/** 代理推广链接 */
@withLocale
@Form.create()
@select('agentLink')
export default class AgentLink extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      modalTitle: '',
      domain: '',
      comment: '',
      status: '',
      id: ''
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'agentLink/loadData',
      payload: {
        page: '1',
        pageSize: '20'
      }
    });
  }

  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'agentLink/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }

  onSubmit = () => {
    const { getFieldsValue } = this.props.form;
    this.setState({ visible: false });
    if (this.state.modalTitle === '新增') {
      this.props.dispatch({
        type: 'agentLink/add',
        payload: getFieldsValue()
      });
    } else {
      this.props.dispatch({
        type: 'agentLink/edit',
        payload: {
          ...getFieldsValue(),
          id: this.state.id
        }
      });
    }
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: this.props.site('地址'),
        dataIndex: 'domain'
      },
      {
        title: this.props.site('备注'),
        dataIndex: 'comment'
      },
      {
        title: this.props.site('状态'),
        dataIndex: 'status',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className={'account-opened'}>{this.props.site('启用')}</Tag>;
          } else if (text === '0') {
            return <Tag className={'account-close'}>{this.props.site('停用')}</Tag>;
          } else {
            return '';
          }
        }
      },
      {
        title: this.props.site('操作'),
        render: (text: string, record: TableRow) => {
          return (
            <TableActionComponent>
              <LinkComponent
                onClick={() => {
                  this.setState({
                    visible: true,
                    modalTitle: '修改',
                    domain: record.domain,
                    comment: record.comment,
                    status: record.status,
                    id: record.id
                  });
                }}
              >
                {this.props.site('修改')}
              </LinkComponent>
              <LinkComponent
                onClick={() => {
                  this.props.dispatch({
                    type: 'agentLink/delete',
                    payload: {
                      id: record.id
                    }
                  });
                }}
              >
                {this.props.site('删除')}
              </LinkComponent>
              <LinkComponent
                hidden={record.status === '0'}
                onClick={() => {
                  this.props.dispatch({
                    type: 'agentLink/transformStatus',
                    payload: {
                      id: Number(record.id),
                      status: '0'
                    }
                  });
                }}
              >
                {this.props.site('停用')}
              </LinkComponent>
              <LinkComponent
                hidden={record.status === '1'}
                onClick={() => {
                  this.props.dispatch({
                    type: 'agentLink/transformStatus',
                    payload: {
                      id: Number(record.id),
                      status: '1'
                    }
                  });
                }}
              >
                {this.props.site('启用')}
              </LinkComponent>
            </TableActionComponent>
          );
        }
      }
    ];

    return (
      <div>
        <Modal
          title={this.state.modalTitle}
          visible={this.state.visible}
          onOk={this.onSubmit}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form>
            <FormItem {...formItemLayout} label={this.props.site('网址')}>
              {getFieldDecorator('domain', {
                rules: [
                  {
                    required: true,
                    message: '请输入网址'
                  },
                  {
                    pattern: hostNamePattern(),
                    message: '网址格式为http://www.***.com或者https://www.***.com'
                  }
                ],
                initialValue: this.state.domain
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={this.props.site('备注')}>
              {getFieldDecorator('comment', {
                initialValue: this.state.comment
              })(<TextArea />)}
            </FormItem>
            <FormItem {...formItemLayout} label={this.props.site('状态')}>
              {getFieldDecorator('status', {
                initialValue: this.state.status
              })(
                <Select>
                  <Option value="1">{this.props.site('启用')}</Option>
                  <Option value="0">{this.props.site('停用')}</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Row gutter={24} style={{ marginBottom: '10px' }}>
          <Col span={2}>
            <RefreshComponent
              actionType="agentLink/loadData"
              type="auto"
              attributes={this.props.agentLink.attributes}
            />
          </Col>
          <Col span={3}>
            <Button
              onClick={() => {
                this.setState({
                  visible: true,
                  modalTitle: '新增',
                  domain: '',
                  comment: '',
                  status: ''
                });
              }}
            >
              新增
            </Button>
          </Col>
        </Row>
        <TableComponent
          columns={columns}
          dataSource={this.props.agentLink.tableData}
          pagination={getPagination(this.props.agentLink.attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
