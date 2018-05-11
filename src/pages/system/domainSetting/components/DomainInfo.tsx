import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect } from 'dva';
import styled from 'styled-components';
import { Form, Input, Table } from 'antd';
import withLocale from '../../../../utils/withLocale';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IntlKeys } from '../../../../locale/zh_CN';

const FormItem = Form.Item;

const OperationWrap = styled.div`
  a {
    margin: 0 3px;
  }
`;
const DomainInput = styled(FormItem)`
  margin-bottom: 0px;
`;

interface Columns {
  created: string;
  domain: string;
  first: string;
  id: string;
  type: string;
  editable: boolean;
  add?: boolean;
}

interface DomainDetail {
  created: string;
  domain: string;
  first: string;
  id: string;
  type: string;
}

interface Props {
  domains: Array<DomainDetail>;
  form: WrappedFormUtils;
  onChange: Function;
  site?: (p: IntlKeys) => React.ReactNode;
}

interface State {
  tableData: Array<Columns>;
}

/** 域名输入框 */
@withLocale
@Form.create()
@select('gameAccount')
export default class DomainInfo extends React.PureComponent<Props, State> {
  cacheData: Array<Columns>;
  constructor(props: Props) {
    super(props);
    this.state = {
      tableData: []
    };
    this.cacheData = this.state.tableData.map(item => ({ ...item }));
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.tableData.length > 0) {
      return;
    }
    const tableData = nextProps.domains.map((item: Columns) => {
      item.editable = false;
      return item;
    });
    this.setState({ tableData });
  }

  add(key: string) {
    const newData = [...this.state.tableData];
    newData.push({
      created: '',
      domain: '',
      first: '',
      id: Math.random() + '',
      type: '',
      editable: true,
      add: true
    });
    this.setState({
      tableData: newData
    });
  }

  delete(index: number) {
    const newData = [...this.state.tableData];
    newData.splice(index, 1);
    this.setState({
      tableData: newData
    });
    this.props.onChange(newData);
  }

  edit(key: string) {
    const newData = [...this.state.tableData];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({ tableData: newData });
      this.props.onChange(newData);
    }
  }

  save(key: string) {
    const { validateFields } = this.props.form;
    validateFields((error, values) => {
      if (!error) {
        const newData = [...this.state.tableData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          delete target.editable;
          delete target.add;
          this.setState({ tableData: newData });
          this.cacheData = newData.map(item => ({ ...item }));
          this.props.onChange(newData);
        }
      }
    });
  }

  cancel(key: string) {
    const newData = [...this.state.tableData];
    const target = newData.filter(item => key === item.id)[0];
    if (target && !target.add) {
      Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
      delete target.editable;
      this.setState({ tableData: newData });
    } else {
      newData.splice(newData.length - 1, 1);
      this.setState({ tableData: newData });
    }
  }

  render() {
    const { site = () => null } = this.props;
    const { getFieldDecorator } = this.props.form;
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

    const columns = [
      {
        title: '域名',
        dataIndex: 'domain',
        key: 'domain',
        render: (text: string, record: Columns) => {
          return (
            <DomainInput>
              {record.editable
                ? getFieldDecorator('domain', {
                    initialValue: text,
                    rules: [
                      {
                        pattern: /^(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
                        message: '域名不合法'
                      },
                      {
                        required: true,
                        message: '域名不能为空'
                      }
                    ]
                  })(
                    <Input
                      style={{ margin: '-5px 0' }}
                      onChange={e => {
                        const newData = [...this.state.tableData];
                        const target = newData.filter(item => item.id === record.id)[0];
                        if (target) {
                          target.domain = e.target.value;
                          this.setState({ tableData: newData });
                        }
                      }}
                    />
                  )
                : text}
            </DomainInput>
          );
        }
      },
      {
        title: site('操作'),
        dataIndex: 'operation',
        width: '25%',
        render: (text: string, record: Columns, index: number) => {
          return (
            <div>
              {record.editable ? (
                <OperationWrap>
                  <a onClick={() => this.save(record.id)}>{site('保存')}</a>
                  <a onClick={() => this.cancel(record.id)}>{site('取消')}</a>
                </OperationWrap>
              ) : (
                operationBtn(this, index, record)
              )}
            </div>
          );
        }
      }
    ];

    return (
      <div>
        <FormItem {...formItemLayout} label={site('域名列表')}>
          <Table
            rowKey={(r, i) => String(i)}
            pagination={false}
            bordered={true}
            dataSource={this.state.tableData}
            columns={columns}
            expandedRowRender={(record: Columns) => {
              const domainDetails = [
                { use: site('主域'), domain: '', directionDomain: 'www.baidu.com' },
                { use: site('PC站'), domain: 'www.', directionDomain: 'www.baidu.com' },
                { use: 'H5', domain: 'm.', directionDomain: 'm.baidu.com' },
                { use: site('代理站'), domain: 'agent.', directionDomain: 'agent.baidu.com' },
                { use: 'API', domain: 'api.', directionDomain: 'api.baidu.com' },
                { use: site('资源'), domain: 'res.', directionDomain: 'res.baidu.com' }
              ];
              domainDetails.forEach(item => {
                item.domain += record.domain;
              });
              return (
                <Table
                  rowKey={(r, i) => String(i)}
                  dataSource={domainDetails}
                  pagination={false}
                  size={'small'}
                  columns={[
                    {
                      title: site('用途'),
                      dataIndex: 'use',
                      key: 'use'
                    },
                    {
                      title: site('域名'),
                      dataIndex: 'domain',
                      key: 'domain'
                    },
                    {
                      title: site('指向域名'),
                      dataIndex: 'directionDomain',
                      key: 'directionDomain'
                    }
                  ]}
                />
              );
            }}
          />
        </FormItem>
      </div>
    );
  }
}

// tslint:disable-next-line:no-any
const operationBtn = function(self: any, index: number, record: Columns) {
  const { site = () => null } = self.props;
  if (index === self.state.tableData.length - 1) {
    return (
      <OperationWrap>
        <a onClick={() => self.edit(record.id)}>{site('编辑')}</a>
        <a onClick={() => self.add(record.id)}>{site('新增')}</a>
        {self.state.tableData.length !== 1 ? (
          <a onClick={() => self.delete(index)}>{site('删除')}</a>
        ) : (
          ''
        )}
      </OperationWrap>
    );
  } else {
    return (
      <OperationWrap>
        <a onClick={() => self.edit(record.id)}>{site('编辑')}</a>
        {self.state.tableData.length !== 1 ? (
          <a onClick={() => self.delete(index)}>{site('删除')}</a>
        ) : (
          ''
        )}
      </OperationWrap>
    );
  }
};
