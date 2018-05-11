import * as React from 'react';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { Dispatch } from 'dva';
import { select } from '../../../../utils/model';
import { AddDiscountState, Level, Game } from './AddDiscount.model';
import { Tabs, Form, Checkbox, Input, Button } from 'antd';
import CheckboxComponent from '../../../components/checkbox/CheckboxComponent';
import { showMessageForResult } from '../../../../utils/showMessage';
import QuickDate from '../../../components/date/QuickDateComponent';
import { Result } from './../../../../utils/result';
import { WrappedFormUtils } from 'antd/es/form/Form';
import QueryDetail from '../query/QueryDetail';

interface Props {
  dispatch?: Dispatch;
  addDiscount?: AddDiscountState;
  site?: (p: IntlKeys) => string;
  form?: any; // tslint:disable-line:no-any
}

interface State {
  levelOptions: Array<Level>;
  gameOptions: Array<Game>;
  levelCheckList: Array<{ id: string; name: string }>;
  gameCheckList: Array<{ id: string; name: string }>;
  queryData: object;
  queryVisible: boolean;
}
interface Value {
  date: string[];
  games: Game[];
  level: Array<{ id: string; name: string }>;
  user_name: string;
}
/** 新增反水详情 */

@withLocale
@Form.create()
@select('addDiscount')
export default class AddDiscount extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      queryVisible: false,
      levelOptions: [],
      levelCheckList: [],
      gameOptions: [],
      gameCheckList: [],
      queryData: {
        date_from: '',
        date_to: '',
        games: [],
        type: 'level',
        coupon_type: '',
        level_id: '',
        user_name: ''
      }
    };
  }
  componentDidMount() {
    this.getLevel();
    this.getGames();
  }
  getLevel = () => {
    this.props.dispatch!({
      type: 'addDiscount/getLevel',
      payload: {}
    })
      .then(result => showMessageForResult(result, '__skip__'))
      .then((res: Result<Level[]>) => {
        this.setState({
          levelOptions: res.data,
          levelCheckList: res.data
        });
      });
  }
  getGames = () => {
    this.props.dispatch!({
      type: 'addDiscount/getGames',
      payload: {}
    })
      .then(result => showMessageForResult(result, '__skip__'))
      .then((res: Result<Game[]>) => {
        this.setState({
          gameOptions: res.data,
          gameCheckList: res.data
        });
      });
  }
  // 会员层级
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err: string, values: Value) => {
      if (!err) {
        this.setState({
          queryVisible: true,
          queryData: {
            date_from: values.date[0].split(' ')[0],
            date_to: values.date[1].split(' ')[0],
            games: JSON.stringify(
              values.games.map(item => ({ game_type: item.game_type, game_id: item.game_id }))
            ),
            level_id: values.level.map(item => item.id).join(','),
            coupon_type: '1',
            type: this.state.queryData.type,
            game_name:
              values.games.length === this.state.gameOptions.length
                ? '全部'
                : values.games.map(item => item.game_name).join(','),
            level_name:
              values.level.length === this.state.levelOptions.length
                ? '全部'
                : values.level.map(item => item.name).join(',')
          }
        });
      }
    });
  }
  // 单个会员查询
  onSingleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err: string, values: Value) => {
      if (!err) {
        this.setState({
          queryVisible: true,
          queryData: {
            date_from: values.date[0].split(' ')[0],
            date_to: values.date[1].split(' ')[0],
            games: JSON.stringify(
              values.games.map(item => ({ game_type: item.game_type, game_id: item.game_id }))
            ),
            coupon_type: '1',
            type: this.state.queryData.type,
            game_name:
              values.games.length === this.state.gameOptions.length
                ? '全部'
                : values.games.map(item => item.game_name).join(','),
            user_name: values.user_name
          }
        });
      }
    });
  }
  changeVisible = () => {
    this.setState({
      queryVisible: false
    });
  }
  onTabChange = (key: string) => {
    this.setState({
      queryData: {
        type: key
      }
    });
  }
  render() {
    const { site = () => '' } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {this.state.queryVisible ? (
          <QueryDetail changeVisible={this.changeVisible} queryData={this.state.queryData} />
        ) : (
          <Tabs type="card" onChange={this.onTabChange}>
            <Tabs.TabPane tab={site('所有会员')} key="level">
              <Form onSubmit={this.onSubmit}>
                <Form.Item label={site('日期')}>
                  {getFieldDecorator('date', {
                    rules: [{ required: true, message: site('请选择日期') }]
                  })(<QuickDate />)}
                </Form.Item>
                {this.state.queryData.type === 'level' ? (
                  <Form.Item label={site('会员层级')}>
                    {getFieldDecorator('level', {
                      rules: [{ required: true, message: site('请选择会员层级') }],
                      initialValue: this.state.levelCheckList
                    })(
                      <CheckboxComponent
                        options={this.state.levelOptions}
                        name="name"
                        formatOut={['id', 'name']}
                        key="id"
                      />
                    )}
                  </Form.Item>
                ) : (
                  ''
                )}
                <Form.Item label={site('游戏平台')}>
                  <div>
                    <Checkbox>{site('电子')}</Checkbox>
                    <Checkbox>{site('快讯')}</Checkbox>
                  </div>
                  {getFieldDecorator('games', {
                    rules: [{ required: true, message: site('请选择游戏平台') }],
                    initialValue: this.state.gameCheckList
                  })(
                    <CheckboxComponent
                      options={this.state.gameOptions}
                      value={this.state.gameCheckList}
                      name="game_name"
                      formatOut={['game_id', 'game_type', 'game_name']}
                      key="game_id"
                    />
                  )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    {site('统计会员')}
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab={site('单个会员')} key="uname">
              <Form onSubmit={this.onSingleSubmit}>
                <Form.Item label={site('日期')}>
                  {getFieldDecorator('date', {
                    rules: [{ required: true, message: site('请选择日期') }]
                  })(<QuickDate />)}
                </Form.Item>
                {this.state.queryData.type === 'level' ? (
                  ''
                ) : (
                  <Form.Item label={site('会员账号')}>
                    {getFieldDecorator('user_name', {
                      rules: [{ required: true, message: site('请填写会员账号') }]
                    })(
                      <Input.TextArea
                        placeholder={site('输入会员账号,多个会员账号之间用英文逗号隔开')}
                      />
                    )}
                  </Form.Item>
                )}
                <Form.Item label={site('游戏平台')}>
                  <div>
                    <Checkbox>{site('电子')}</Checkbox>
                    <Checkbox>{site('快讯')}</Checkbox>
                  </div>
                  {getFieldDecorator('games', {
                    rules: [{ required: true, message: site('请选择游戏平台') }],
                    initialValue: this.state.gameCheckList
                  })(
                    <CheckboxComponent
                      options={this.state.gameOptions}
                      value={this.state.gameCheckList}
                      name="game_name"
                      formatOut={['game_id', 'game_type', 'game_name']}
                      key="game_id"
                    />
                  )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    {site('统计会员')}
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    );
  }
}
