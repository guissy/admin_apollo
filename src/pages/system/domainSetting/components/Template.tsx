import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Form, Select, Input, Button, Modal, Collapse, Table } from 'antd';
import withLocale from '../../../../utils/withLocale';
import { IntlKeys } from '../../../../locale/zh_CN';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { queryWebsiteStyleData } from '../DomainSetting.service';
import ImagePreview from '../../../components/modal/ImagePreview';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;

const OperationWrap = styled.div`
  button {
    margin: 0 3px;
  }
`;

const isDev = /^(192\.168|127\.0\.0\.1|localhost)/.test(window.location.host);
const imgUrl = isDev ? 'http://admin.98095.net' : '';

/** 模板详情 */
export interface StyleItem {
  id: string;
  key: string;
  checked: number;
}

interface Props {
  m_tname: string;
  www_tname: string;
  onChangeMobile: Function;
  onChangePc: Function;
  site?: (p: IntlKeys) => React.ReactNode;
}

interface State {
  h5: Array<StyleItem>;
  pc: Array<StyleItem>;
  previewSrc: string;
  previewVisible: boolean;
  m_tname: string;
  www_tname: string;
}

/** 模板 */
@Form.create()
@withLocale
@select('gameAccount')
export default class Template extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      h5: [],
      pc: [],
      previewSrc: '',
      previewVisible: false,
      m_tname: '',
      www_tname: ''
    };
  }

  componentWillMount() {
    const result = queryWebsiteStyleData();
    // tslint:disable-next-line:no-any
    result.then((res: any) => {
      if (res.state === 0) {
        this.setState({
          h5: res.data.h5,
          pc: res.data.pc
        });
      }
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.m_tname !== '' && this.state.www_tname !== '') {
      return;
    }
    this.setState({
      m_tname: nextProps.m_tname,
      www_tname: nextProps.www_tname
    });
  }

  render() {
    const { site = () => null } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    return (
      <div>
        <ImagePreview
          imgSrc={this.state.previewSrc}
          visible={this.state.previewVisible}
          onClose={() => {
            this.setState({
              previewVisible: false
            });
          }}
        />
        <FormItem {...formItemLayout} label={site('PC模板')}>
          <Collapse>
            <Panel
              header={
                <img
                  width="50"
                  style={{ marginLeft: '10px' }}
                  src={imgUrl + '/static/img/pc_new/' + this.state.www_tname + '.jpg'}
                />
              }
              key="1"
            >
              <Table
                dataSource={this.state.pc}
                rowKey={(r, i) => String(i)}
                pagination={false}
                columns={[
                  {
                    title: site('模板'),
                    dataIndex: 'key',
                    key: 'key',
                    render: (text: string, record: StyleItem) => {
                      return (
                        <img
                          width="50"
                          src={imgUrl + '/static/img/pc_new/' + record.key + '.jpg'}
                        />
                      );
                    }
                  },
                  {
                    title: site('操作'),
                    dataIndex: 'id',
                    key: 'id',
                    width: '30%',
                    render: (text: string, record: StyleItem) => {
                      return (
                        <OperationWrap>
                          <Button
                            size={'small'}
                            onClick={() => {
                              this.setState({
                                previewVisible: true,
                                previewSrc: imgUrl + '/static/img/pc_new/' + record.key + '.jpg'
                              });
                            }}
                          >
                            {site('预览')}
                          </Button>
                          <Button
                            size={'small'}
                            onClick={() => {
                              this.props.onChangePc(record);
                              this.setState({
                                www_tname: record.key
                              });
                            }}
                          >
                            {site('选择')}
                          </Button>
                        </OperationWrap>
                      );
                    }
                  }
                ]}
              />
            </Panel>
          </Collapse>
        </FormItem>
        <FormItem {...formItemLayout} label={site('H5前台模板')}>
          <Collapse>
            <Panel
              header={
                <img
                  width="50"
                  style={{ marginLeft: '10px' }}
                  src={imgUrl + '/static/img/mobile_new/' + this.state.m_tname + '.jpg'}
                />
              }
              key="1"
            >
              <Table
                dataSource={this.state.h5}
                rowKey={(r, i) => String(i)}
                pagination={false}
                columns={[
                  {
                    title: site('模板'),
                    dataIndex: 'key',
                    key: 'key',
                    render: (text: string, record: StyleItem) => {
                      return (
                        <img
                          width="50"
                          src={imgUrl + '/static/img/mobile_new/' + record.key + '.jpg'}
                        />
                      );
                    }
                  },
                  {
                    title: site('操作'),
                    dataIndex: 'id',
                    key: 'id',
                    width: '30%',
                    render: (text: string, record: StyleItem) => {
                      return (
                        <OperationWrap>
                          <Button
                            size={'small'}
                            onClick={() => {
                              this.setState({
                                previewVisible: true,
                                previewSrc: imgUrl + '/static/img/mobile_new/' + record.key + '.jpg'
                              });
                            }}
                          >
                            {site('预览')}
                          </Button>
                          <Button
                            size={'small'}
                            onClick={() => {
                              this.props.onChangeMobile(record);
                              this.setState({
                                m_tname: record.key
                              });
                            }}
                          >
                            {site('选择')}
                          </Button>
                        </OperationWrap>
                      );
                    }
                  }
                ]}
              />
            </Panel>
          </Collapse>
        </FormItem>
      </div>
    );
  }
}
