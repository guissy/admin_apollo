import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Button, Col, Form, Modal, Row, Select, Table, Tag } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import AddEmailModal from './components/AddEmailModal';
import { EmailListState } from './EmailList.model';
const Option = Select.Option;
const FormItem = Form.Item;

interface EmailItem {
  content: string;
  created: string;
  hyper_text: string;
  id: string;
  recipient: string;
  send_type: string;
  status: string;
  title: string;
  updated: string;
}

interface Props {
  tableData: Array<object>;
  isLoading: boolean;
  dispatch: Dispatch;
  form: WrappedFormUtils;
  site: (p: IntlKeys) => React.ReactNode;
  emailList: EmailListState;
}

interface State {
  selectedRows: Array<EmailItem>;
  selectedRowKeys: Array<number>;
  tableData: Array<object>;
  isLoading: boolean;
  isShowModal: boolean;
  isShowNewEmailModel: boolean;
  modalContent: EmailItem;
}

/** 邮件管理 */
@withLocale
@Form.create()
@select('emailList')
export default class EmailList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
      tableData: [],
      isLoading: true,
      isShowModal: false,
      isShowNewEmailModel: false,
      modalContent: {
        content: '',
        created: '',
        hyper_text: '',
        id: '',
        recipient: '',
        send_type: '',
        status: '',
        title: '',
        updated: ''
      }
    };
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
      tableData: nextProps.emailList.tableData,
      isLoading: false
    });
  }

  loadData = () => {
    this.props.dispatch({
      type: 'emailList/loadData',
      payload: {
        page: '1',
        page_size: '20'
      }
    });
  }

  test = (data: string) => {
    console.log(data);
  }

  render() {
    const columns = [
      {
        title: this.props.site('邮件标题'),
        dataIndex: 'title'
      },
      {
        title: this.props.site('发送时间'),
        dataIndex: 'created'
      },
      {
        title: this.props.site('发送状态'),
        dataIndex: 'status',
        render: (status: string) => {
          if (status === '1') {
            return <Tag className={'account-opened'}>{this.props.site('已发送')}</Tag>;
          } else {
            return <Tag className={'account-close'}>{this.props.site('未发送')}</Tag>;
          }
        }
      },
      {
        title: this.props.site('超文本格式'),
        dataIndex: 'hyper_text',
        render: (status: string) => {
          if (status === '1') {
            return <Tag className={'account-opened'}>{this.props.site('是')}</Tag>;
          } else {
            return <Tag className={'account-close'}>{this.props.site('否')}</Tag>;
          }
        }
      },
      {
        title: this.props.site('操作'),
        dataIndex: 'id',
        render: (text: string, record: EmailItem) => {
          if (record.status === '0') {
            return (
              <div>
                <Button
                  style={{ marginRight: '10px' }}
                  size="small"
                  type="primary"
                  onClick={() => {
                    this.setState({
                      isShowModal: true,
                      modalContent: record
                    });
                  }}
                >
                  {this.props.site('查看')}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    this.setState({ isLoading: true });
                    this.props.dispatch({
                      type: 'emailList/sendEmail',
                      payload: {
                        id: record.id
                      }
                    });
                  }}
                >
                  {this.props.site('发送')}
                </Button>
              </div>
            );
          } else {
            return (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  this.setState({
                    isShowModal: true,
                    modalContent: record
                  });
                }}
              >
                {this.props.site('查看')}
              </Button>
            );
          }
        }
      }
    ];

    const { getFieldDecorator } = this.props.form;

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

    return (
      <div>
        <Row gutter={24} style={{ marginBottom: '10px' }}>
          <Col span={19}>
            {this.state.selectedRows.length > 0 ? (
              <span>
                您选择了{this.state.selectedRows.length}条数据
                <Button
                  type="danger"
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    let id = '';
                    this.state.selectedRows.forEach((item, index) => {
                      if (index + 1 !== this.state.selectedRows.length) {
                        id += item.id + ',';
                      } else {
                        id += item.id;
                      }
                    });
                    this.setState({ isLoading: true });
                    this.props.dispatch({
                      type: 'emailList/deleteRowData',
                      payload: {
                        ids: id
                      }
                    });
                  }}
                >
                  {this.props.site('删除')}
                </Button>
              </span>
            ) : (
              ''
            )}
          </Col>
          <Col span={5}>
            <Button
              style={{ marginRight: '5px' }}
              type="primary"
              onClick={() => {
                this.setState({
                  isShowNewEmailModel: true
                });
              }}
            >
              {this.props.site('新增邮件')}
            </Button>
            <Button
              type="primary"
              loading={this.state.isLoading}
              onClick={() => {
                this.setState({ isLoading: true });
                this.loadData();
              }}
            >
              {this.props.site('刷新')}
            </Button>
          </Col>
        </Row>
        <Table
          rowKey={(r, i) => String(i)}
          rowSelection={{
            // tslint:disable-next-line:no-any
            onChange: (selectedRowKeys: any, selectedRows: any) => {
              this.setState({
                selectedRows,
                selectedRowKeys
              });
            }
          }}
          columns={columns}
          dataSource={this.state.tableData}
          bordered={true}
          loading={this.state.isLoading}
        />
        <AddEmailModal
          visible={this.state.isShowNewEmailModel}
          onChange={(visible: boolean) => {
            this.setState({
              isShowNewEmailModel: visible
            });
          }}
        />
        <Modal
          title="邮件"
          visible={this.state.isShowModal}
          onOk={() => this.setState({ isShowModal: false })}
          onCancel={() => this.setState({ isShowModal: false })}
        >
          <Row gutter={24}>
            <Col span={5}>{this.props.site('超文本')}：</Col>
            {this.state.modalContent.hyper_text === '0' ? '是' : '否'}
          </Row>
          <Row gutter={24}>
            <Col span={5}>{this.props.site('邮件标题')}：</Col>
            {this.state.modalContent.title}
          </Row>
          <Row gutter={24}>
            <Col span={5}>{this.props.site('发送时间')}：</Col>
            {this.state.modalContent.created}
          </Row>
          <Row gutter={24}>
            <Col span={5}>{this.props.site('发送类型')}：</Col>
            <Sendtype data={this.state.modalContent.send_type} />,
            {this.state.modalContent.recipient}
          </Row>
          <Row gutter={24}>
            <Col span={5}>{this.props.site('发送内容')}：</Col>
            {this.state.modalContent.content}
          </Row>
        </Modal>
      </div>
    );
  }
}

// tslint:disable-next-line:no-any
const Sendtype = (props: any) => {
  if (props.data === '1') {
    return <span>会员层级</span>;
  } else if (props === '2') {
    return <span>代理</span>;
  } else {
    return <span>自定义</span>;
  }
};
