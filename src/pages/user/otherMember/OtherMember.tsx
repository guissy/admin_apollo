import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { OtherMemberState } from './OtherMember.model';
import { SearchComponent, SearchFormConfig } from '../../components/form/SearchComponent';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { showMessageForResult } from '../../../utils/showMessage';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale, { siteFunction } from '../../../utils/withLocale';
import { Form, Input, Select } from 'antd';

const Option = Select.Option;

interface Props {
  form?: WrappedFormUtils;
  site?: siteFunction;
  dispatch?: Dispatch;
  otherMember?: OtherMemberState;
}

/** 第三方会员查询 */
@withLocale
@Form.create()
@select('otherMember')
export default class OtherMember extends React.PureComponent<Props, {}> {
  componentDidMount() {
    this.loadData();
    this.props.dispatch!({
      type: 'otherMember/queryOtherGameList',
      payload: {}
    });
  }
  loadData = () => {
    this.props.dispatch!({
      type: 'otherMember/queryOtherMember',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'agentAudit/queryAgentAudit',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  config = (useFor: 'table' | 'search'): SearchFormConfig[] => {
    const { site = () => '', otherMember = {} as OtherMemberState } = this.props;
    return [
      {
        title: site('会员账号'),
        dataIndex: 'uname',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('第三方游戏'),
        dataIndex: 'name',
        formItemRender: () => {
          if (useFor === 'search') {
            return (
              <Select>
                {otherMember.gameList.map((item: { game_id: string; game_name: string }, index) => {
                  return (
                    <Option value={item.game_id} key={index}>
                      {item.game_name}
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
        title: site('第三方账号'),
        dataIndex: 'game_username',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      }
    ];
  }
  render() {
    const { site = () => '', form, otherMember = {} as OtherMemberState } = this.props;
    const { data, attributes } = otherMember;
    return (
      <div>
        {/* 搜索 */}
        <SearchComponent
          form={form}
          fieldConfig={this.config('search')}
          actionType="otherMember/queryOtherMember"
          pageSize={20}
        />
        {/* 第三方会员表格列表 */}
        <TableComponent
          dataSource={data ? data : []}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
