import * as React from 'react';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { DiscountSettingState, Record } from './DiscountSetting.model';
import { SearchUI } from '../../components/form/SearchUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { Form, Input } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';

interface Props {
  dispatch: Dispatch;
  discountSetting: DiscountSettingState;
  form?: WrappedFormUtils;
  site?: (p: IntlKeys) => React.ReactNode;
}
interface State {}
/** 返水活动 */

@withLocale
@Form.create()
@select('discountSetting')
export default class DiscountSetting extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  config = () => {
    const { site = () => '' } = this.props;
    return [
      {
        title: site('有效总投注金额'),
        dataIndex: 'valid_bet',
        formItemRender: () => null
      },
      {
        title: site('备注'),
        dataIndex: 'memo',
        formItemRender: () => null
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        formItemRender: () => null
      },
      {
        title: site('优惠上限'),
        dataIndex: 'upper_limit',
        formItemRender: () => null
      },
      {
        title: site('创建人'),
        dataIndex: 'created_uname',
        formItemRender: () => null
      },
      {
        dataIndex: '',
        title: site('操作'),
        formItemRender: () => null,
        render: (text: string, record: Record) => {
          const { status = '' } = record;
          return (
            <TableActionComponent>
              <a onClick={() => this.doEdit(record)}>{site('修改')}</a>
              <LinkComponent confirm={true} onClick={() => this.doDelete(record)}>
                {site('删除')}
              </LinkComponent>
            </TableActionComponent>
          );
        }
      }
    ];
  }
  componentDidMount() {
    this.loadTableData(1, 10);
  }
  loadTableData = (page: number, pageSize: number) => {
    this.props.dispatch({
      type: 'discount/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    this.loadTableData(page, pageSize);
  }
  onNew = () => {
    console.log('new');
  }
  doEdit = value => {
    console.log('edit');
  }
  doDelete = value => {
    console.log('dadad');
  }
  render() {
    const { form, discountSetting } = this.props;
    return (
      <section>
        <ButtonBarComponent onCreate={this.onNew} />
        <TableComponent columns={this.config()} form={form} />
      </section>
    );
  }
}
