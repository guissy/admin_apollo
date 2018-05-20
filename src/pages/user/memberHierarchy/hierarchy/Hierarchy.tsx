import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import { HierarchyState } from './Hierarchy.model';
import TableActionComponent from '../../../components/table/TableActionComponent';
import LinkComponent from '../../../components/link/LinkComponent';
import { SearchUI, SearchFormConfig } from '../../../components/form/SearchUI';
import { EditFormUI, EditConsumer } from '../../../components/form/EditFormUI';
import TableComponent, { getPagination } from '../../../components/table/TableComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonBarComponent from '../../../components/buttonBar/ButtonBarComponent';
import { showMessageForResult } from '../../../../utils/showMessage';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale, { siteFunction } from '../../../../utils/withLocale';
import { Form, Input, DatePicker, Modal, Button, Table, Row, Col } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

interface Props {
  form?: WrappedFormUtils;
  site?: siteFunction;
  dispatch?: Dispatch;
  hierarchy?: HierarchyState;
}

/** 会员层级 */
@withLocale
@Form.create()
@select('hierarchy')
// tslint:disable-next-line:no-consecutive-blank-lines
export default class Hierarchy extends React.PureComponent<Props, {}> {
  state = {
    newVisible: false,
    editVisible: false,
    setVisible: false,
    layeredVisible: false,
    limitVisible: false,
    editing: {
      id: '0'
    },
    citem: {
      id: '',
      level_id: '',
      name: ''
    },
    selectedRows: []
  };
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props.dispatch!({
      type: 'hierarchy/loadData',
      payload: {
        page: 1,
        page_size: 20
      }
    });
    this.props.dispatch!({
      type: 'hierarchy/queryAllMemberHierarchy',
      payload: {}
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'hierarchy/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  // 新增
  onNew = () => {
    this.setState({
      newVisible: !this.state.newVisible
    });
  }
  onAddSubmit = (values: object) => {
    console.log(values);
    return this.props.dispatch!({
      type: 'hierarchy/addMemberHierarchy',
      payload: values
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 编辑
  onEdit = (values: object) => {
    this.setState({
      editVisible: !this.state.editVisible,
      editing: values
    });
  }
  onEditSubmit = (values: { id: string }) => {
    console.log(values);
    values.id = this.state.editing.id;
    return this.props.dispatch!({
      type: 'hierarchy/editMemberHierarchy',
      payload: values
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 删除
  onDeleteSubmit = (id: string) => {
    this.props.dispatch!({
      type: 'hierarchy/deleteMemberHierarchy',
      payload: {
        id: id
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 回归
  onRestore = (id: string) => {
    this.props.dispatch!({
      type: 'hierarchy/restoreMemberHierarchy',
      payload: {
        id: id
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  // 设定
  onSetting = (item: { id: string }) => {
    this.props.dispatch!({
      type: 'hierarchy/queryMemberHierarchySet',
      payload: {
        id: item.id
      }
    });
    this.setState({
      citem: item,
      setVisible: !this.state.setVisible
    });
  }
  onCloseSetting = () => {
    this.setState({
      setVisible: !this.state.setVisible
    });
  }
  onSettingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tslint:disable-next-line:no-any
    this.props.form!.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        // return;
        const { hierarchy = {} as HierarchyState } = this.props;
        values.onlines = JSON.stringify(values.onlines);
        values.id = hierarchy.setData.id;
        values.level_id = hierarchy.setData.level_id;
        Object.keys(values).forEach((key: string) => {
          if (key !== 'onlines') {
            console.log(values[key]);
            values[key] = Number(values[key]);
          }
        });
        console.log(values);
        this.props.dispatch!({
          type: 'hierarchy/setMemberHierarchy',
          payload: values
        })
          .then(showMessageForResult)
          .then(() => {
            this.loadData();
            this.onCloseSetting();
          });
      }
    });
  }
  // 分层
  onCloseLayerd = () => {
    this.setState({
      layeredVisible: !this.state.layeredVisible
    });
  }
  onSetLayerd = (item: object) => {
    this.setState({
      citem: item,
      layeredVisible: !this.state.layeredVisible
    });
  }
  onLayerdSubmit = () => {
    const ids = this.state.selectedRows
      .map((item: { id: string }) => {
        return item.id;
      })
      .join(',');
    this.props.dispatch!({
      type: 'hierarchy/layerdMemberHierarchy',
      payload: {
        ids: ids,
        to: this.state.citem.level_id
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.setState({
          layeredVisible: !this.state.layeredVisible
        });
        this.loadData();
      });
  }
  // todo限额

  config = (useFor: 'table' | 'create' | 'edit') => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('层级名称'),
        dataIndex: 'name',
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        title: site('描述'),
        dataIndex: 'memo',
        formItemRender: () => <TextArea />
      },
      {
        title: site('会员加入时间'),
        dataIndex: 'register_stime,register_etime',
        render: (text: string, record: { register_stime: string; register_etime: string }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: record.register_stime + '<br/>' + record.register_etime
            }}
          />
        ),
        formItemRender: () => <DatePicker.RangePicker />
      },
      {
        title: site('存款时间'),
        dataIndex: 'deposit_stime,deposit_etime',
        render: (text: string, record: { deposit_stime: string; deposit_etime: string }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: record.deposit_stime + '<br/>' + record.deposit_etime
            }}
          />
        ),
        formItemRender: () => <DatePicker.RangePicker />
      },
      {
        title: site('区间存款总额'),
        dataIndex: 'deposit_min',
        render: (text: string, record: { deposit_min: string; deposit_max: string }) =>
          record.deposit_min + '-' + record.deposit_max,
        formItemRender: () => null
      },
      {
        title: site('存款最小金额'),
        dataIndex: 'deposit_min',
        notInTable: true,
        formItemRender: () => <Input type="number" />
      },
      {
        title: site('存款最大金额'),
        dataIndex: 'deposit_max',
        notInTable: true,
        formItemRender: () => <Input type="number" />
      },
      {
        title: site('存款次数'),
        dataIndex: 'deposit_times',
        formItemRender: () => <Input type="number" />,
        formRules: rules
      },
      {
        title: site('存款总额'),
        dataIndex: 'deposit_money',
        formItemRender: () => <Input type="number" />,
        formRules: rules
      },
      {
        title: site('最大存款额'),
        dataIndex: 'max_deposit_money',
        formItemRender: () => <Input type="number" />,
        formRules: rules
      },
      {
        title: site('提款次数'),
        dataIndex: 'withdraw_times',
        formItemRender: () => <Input type="number" />,
        formRules: rules
      },
      {
        title: site('提款总额'),
        dataIndex: 'withdraw_count',
        formItemRender: () => <Input type="number" />,
        formRules: rules
      },
      {
        title: site('会员人数'),
        dataIndex: 'num',
        formItemRender: () => null
      },
      {
        title: site('备注'),
        dataIndex: 'comment',
        formItemRender: () => <TextArea />
      },
      {
        title: site('操作'),
        dataIndex: 'action',
        width: 160,
        render: (text: string, record: { id: string; level_id: string; num: string }) => {
          return (
            <TableActionComponent>
              <LinkComponent onClick={() => this.onSetting(record)}>{site('设定')}</LinkComponent>
              <LinkComponent hidden={record.id === '1'} onClick={() => this.onSetLayerd(record)}>
                {site('分层')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                // 层级下有会员才回归为分层
                hidden={record.id === '1' || record.num === '0'}
                onClick={() => this.onRestore(record.level_id)}
              >
                {site('回归')}
              </LinkComponent>
              <LinkComponent hidden={record.id === '1'} onClick={() => this.onEdit(record)}>
                {site('编辑')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                // 层级下没有会员才能删除
                hidden={record.id === '1' || record.num !== '0'}
                onClick={() => this.onDeleteSubmit(record.id)}
              >
                {site('删除')}
              </LinkComponent>
              <LinkComponent hidden={record.id === '1'}>{site('限额')}</LinkComponent>
            </TableActionComponent>
          );
        },
        formItemRender: () => null
      }
    ];
  }
  levelConfig = () => {
    const { site = () => '' } = this.props;
    return [
      {
        title: site('层级名称'),
        dataIndex: 'name'
      },
      {
        title: site('描述'),
        dataIndex: 'memo'
      }
    ];
  }
  render() {
    const { getFieldDecorator } = this.props.form!;
    const { site = () => '', form, hierarchy = {} as HierarchyState } = this.props;
    const { newVisible, editVisible, editing, layeredVisible, setVisible, citem } = this.state;
    const { id, level_id, name } = citem;
    const { levelList, data, attributes, setData } = hierarchy;
    const {
      wechat,
      alipay,
      qqpay,
      cyberbank,
      jdpay,
      tenpay,
      unionpay,
      baidupay,
      kapay,
      quickpay
    } = setData.onlines;
    // 各个支付列表
    const onlinesList: Array<object> = [
      {
        label_min: '微信入款最低',
        prop_min: 'onlines.wechat.min',
        min: wechat.min,
        label_max: '微信入款最高',
        prop_max: 'onlines.wechat.max',
        max: wechat.max
      },
      {
        label_min: '支付宝入款最低',
        prop_min: 'onlines.alipay.min',
        min: alipay.min,
        label_max: '支付宝入款最高',
        prop_max: 'onlines.alipay.max',
        max: alipay.max
      },
      {
        label_min: 'QQ钱包入款最低',
        prop_min: 'onlines.qqpay.min',
        min: qqpay.min,
        label_max: 'QQ钱包入款最高',
        prop_max: 'onlines.qqpay.max',
        max: qqpay.max
      },
      {
        label_min: '网银入款最低',
        prop_min: 'onlines.cyberbank.min',
        min: cyberbank.min,
        label_max: '网银入款最高',
        prop_max: 'onlines.cyberbank.max',
        max: cyberbank.max
      },
      {
        label_min: '京东入款最低',
        prop_min: 'onlines.jdpay.min',
        min: jdpay.min,
        label_max: '京东入款最高',
        prop_max: 'onlines.jdpay.max',
        max: jdpay.max
      },
      {
        label_min: '财付通入款最低',
        prop_min: 'onlines.tenpay.min',
        min: tenpay.min,
        label_max: '财付通入款最高',
        prop_max: 'onlines.tenpay.max',
        max: tenpay.max
      },
      {
        label_min: '快捷支付入款最低',
        prop_min: 'onlines.unionpay.min',
        min: unionpay.min,
        label_max: '快捷支付入款最高',
        prop_max: 'onlines.unionpay.max',
        max: unionpay.max
      },
      {
        label_min: '百度支付入款最低',
        prop_min: 'onlines.baidupay.min',
        min: baidupay.min,
        label_max: '百度支付入款最高',
        prop_max: 'onlines.baidupay.max',
        max: baidupay.max
      },
      {
        label_min: '点卡支付入款最低',
        prop_min: 'onlines.kapay.min',
        min: kapay.min,
        label_max: '点卡支付入款最高',
        prop_max: 'onlines.kapay.max',
        max: kapay.max
      },
      {
        label_min: '云闪付入款最低',
        prop_min: 'onlines.quickpay.min',
        min: quickpay.min,
        label_max: '云闪付入款最高',
        prop_max: 'onlines.quickpay.max',
        max: quickpay.max
      }
    ];
    // 分层过滤掉当前操作层级
    const levelListFiter = levelList.filter((item: { id: string }) => {
      return Number(item.id) !== Number(id);
    });
    const rowSelection = {
      onChange: (selectedRowKeys: Array<string>, selectedRows: Array<object>) => {
        this.setState({
          selectedRows: selectedRows
        });
      }
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <div>
        <ButtonBarComponent onCreate={this.onNew} />
        {/* 新增 */}
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增')}
          modalVisible={newVisible}
          onCancel={this.onNew}
          onSubmit={this.onAddSubmit}
        />
        {/* 编辑 */}
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑')}
          modalVisible={editVisible}
          onCancel={this.onEdit}
          onSubmit={this.onEditSubmit}
          values={editing}
        />
        {/* 会员层级列表 */}
        <TableComponent
          dataSource={data ? data : []}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(attributes, this.onPageChange)}
        />
        {/* 分层 */}
        <Modal
          title={site('分层')}
          visible={layeredVisible}
          onCancel={this.onCloseLayerd}
          onOk={this.onLayerdSubmit}
        >
          <h4>{site('将下面会员分层导入至:') + name}</h4>
          <div>
            <Table
              rowSelection={rowSelection}
              columns={this.levelConfig()}
              dataSource={levelListFiter}
              pagination={{ pageSize: 50 }}
            />
          </div>
        </Modal>
        {/* 设定 */}
        <Modal
          title={site('设定')}
          visible={setVisible}
          onCancel={this.onCloseSetting}
          width={1000}
          footer={null}
        >
          <Form onSubmit={this.onSettingSubmit}>
            <Row type="flex">
              <Col span={24}>{site('入款相关')}</Col>
              {// tslint:disable-next-line:no-any
              onlinesList.map((item: any, index: number) => {
                return (
                  <Col span={12} key={index}>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={site(item.label_min)}>
                        {getFieldDecorator(item.prop_min, { initialValue: item.min })(
                          <Input type="number" />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={site(item.label_max)}>
                        {getFieldDecorator(item.prop_max, { initialValue: item.max })(
                          <Input type="number" />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                );
              })}
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('公司最低入款金额')}>
                  {getFieldDecorator('offline_min_in', { initialValue: setData.offline_min_in })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('公司最高入款金额')}>
                  {getFieldDecorator('offline_max_in', { initialValue: setData.offline_max_in })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('线上入款流水倍数')}>
                  {getFieldDecorator('online_glide_multi', {
                    initialValue: setData.online_glide_multi
                  })(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('公司入款流水倍数')}>
                  {getFieldDecorator('offline_glide_multi', {
                    initialValue: setData.offline_glide_multi
                  })(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col span={24}>{site('出款相关')}</Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('每次最低出款金额')}>
                  {getFieldDecorator('each_min_out', { initialValue: setData.each_min_out })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('每次最高出款金额')}>
                  {getFieldDecorator('each_max_out', { initialValue: setData.each_max_out })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('每日出款次数限制')}>
                  {getFieldDecorator('day_out_times', { initialValue: setData.day_out_times })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('每日出款免手续费笔数')}>
                  {getFieldDecorator('day_out_times_nofee', {
                    initialValue: setData.day_out_times_nofee
                  })(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('提现行政费（%）')}>
                  {getFieldDecorator('withdraw_expenese', {
                    initialValue: setData.withdraw_expenese
                  })(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('行政上限')}>
                  {getFieldDecorator('max_expenese', { initialValue: setData.max_expenese })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('提现手续费')}>
                  {getFieldDecorator('withdraw_fee', { initialValue: setData.withdraw_fee })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={site('免稽核额度')}>
                  {getFieldDecorator('nocheck', { initialValue: setData.nocheck })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className="button-con">
              <Button htmlType="submit" type="primary">
                {site('保存')}
              </Button>
            </Row>
          </Form>
        </Modal>
      </div>
    );
    // tslint:disable-next-line:tsx-file
  }
}
