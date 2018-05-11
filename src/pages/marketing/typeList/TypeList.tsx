import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import styled from 'styled-components';
import { Form, Input, Divider, Button } from 'antd';
import { TypeListState, Record } from './TypeList.model';

import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';

import { EditFormComponent } from '../../components/form/EditFormComponent';
import { SearchFormConfig } from '../../components/form/SearchComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import LinkComponent from '../../components/link/LinkComponent';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import { showMessageForResult } from '../../../utils/showMessage';

interface Props {
  dispatch: Dispatch;
  typeList: TypeListState;
  form?: WrappedFormUtils;
  site?: (p: IntlKeys) => React.ReactNode;
}

interface State {
  newVisible: boolean;
  editVisible: boolean;
  editing: object;
  page: number;
  pageSize: number;
}

/** 优惠类型 */
@Form.create()
@withLocale
@select('typeList')
export default class TypeList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newVisible: false,
      editVisible: false,
      editing: {},
      page: 1,
      pageSize: 10
    };
  }
  componentDidMount() {
    this.loadTableData();
  }
  loadTableData = (page: number = this.state.page, pageSize: number = this.state.pageSize) => {
    this.props.dispatch({
      type: 'typeList/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  onChange = (page: number, pageSize: number) => {
    this.setState({
      page,
      pageSize
    });
    this.loadTableData(page, pageSize);
  }
  doDelete = (record: Record) => {
    this.props
      .dispatch({
        type: 'typeList/deleteActive',
        payload: record
      })
      .then(res => showMessageForResult(res, '删除成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  config = (useFor: 'create' | 'edit' | 'table'): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        dataIndex: 'id',
        title: site('序号'),
        notInTable: true,
        formItemRender: () => (useFor === 'edit' ? <input type="hidden" /> : null)
      },
      {
        dataIndex: 'name',
        title: site('优惠类型'),
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        dataIndex: 'description',
        title: site('优惠类型描述'),
        formItemRender: () => <Input.TextArea />,
        formRules: rules
      },
      {
        dataIndex: 'created_uname',
        title: site('创建人'),
        formItemRender: () => null
      },
      {
        dataIndex: 'sort',
        title: site('排序'),
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        dataIndex: 'created',
        title: site('创建时间'),
        formItemRender: () => null
      },
      {
        dataIndex: 'updated',
        title: site('最后修改时间'),
        formItemRender: () => null
      },
      {
        dataIndex: 'operation',
        title: site('操作'),
        formItemRender: () => null,
        render: (text: string, record: Record) => {
          return (
            <div>
              <span>
                <a onClick={() => this.doEdit(record)}>编辑</a>
                <Divider type="vertical" />
                <LinkComponent confirm={true} onClick={() => this.doDelete(record)}>
                  {site('删除')}
                </LinkComponent>
              </span>
            </div>
          );
        }
      }
    ];
  }
  doEdit = (record: Record) => {
    this.setState({
      editVisible: true,
      editing: {
        id: record.id,
        name: record.name,
        description: record.description,
        sort: record.sort
      }
    });
  }
  doAdd = () => {
    this.setState({
      newVisible: true
    });
  }
  // tslint:disable-next-line:no-any
  cancel = (visible: any) => {
    this.setState({
      [visible]: false,
      editing: {
        name: '',
        description: '',
        sort: ''
      }
    });
  }
  onSubmit = (values: object) => {
    this.setState({
      newVisible: false
    });
    return this.props
      .dispatch({
        type: 'typeList/addActive',
        payload: values
      })
      .then(res => showMessageForResult(res, '新增成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  onEditSubmit = (values: { id: string }) => {
    this.setState({
      editVisible: false
    });
    return this.props
      .dispatch({
        type: 'typeList/editActive',
        payload: {
          id: values.id,
          data: values
        }
      })
      .then(res => showMessageForResult(res, '编辑成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  render() {
    const { site = () => '', form, typeList = {} as TypeListState } = this.props;
    const { newVisible, editVisible } = this.state;
    return (
      <div>
        <ButtonBarComponent onCreate={this.doAdd} />
        <EditFormComponent
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑')}
          modalVisible={editVisible}
          onCancel={() => this.cancel('editVisible')}
          onSubmit={this.onEditSubmit}
          values={this.state.editing}
        />
        <EditFormComponent
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增')}
          modalVisible={newVisible}
          onSubmit={this.onSubmit}
          onCancel={() => this.cancel('newVisible')}
        />
        <TableComponent
          dataSource={typeList.data}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(typeList.attributes, this.onChange)}
        />
      </div>
    );
  }
}
