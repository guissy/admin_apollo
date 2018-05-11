import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect } from 'dva';
import { Form, Select } from 'antd';
import withLocale from '../../../../utils/withLocale';
import { queryLanguagesData } from '../DomainSetting.service';
import { IntlKeys } from '../../../../locale/zh_CN';
const { Option } = Select;

interface LanguageItem {
  id: string;
  name: string;
  code: string;
  pic: string;
}

interface Props {
  language: string;
  onChange: Function;
  site?: (p: IntlKeys) => React.ReactNode;
}

interface State {
  languages: Array<LanguageItem>;
  selectValue: string;
}

/** 语言 */
@Form.create()
@withLocale
@select('gameAccount')
export default class Language extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      languages: [],
      selectValue: ''
    };
  }

  componentWillMount() {
    const result = queryLanguagesData();
    // tslint:disable-next-line:no-any
    result.then((res: any) => {
      if (res.state === 0) {
        this.setState({
          languages: res.data
        });
      }
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.selectValue !== '') {
      return;
    }
    this.setState({
      ...this.state,
      selectValue: nextProps.language
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
      <Form.Item {...formItemLayout} label={site('语言')}>
        <Select
          value={this.state.selectValue}
          onChange={(value: string) => {
            this.props.onChange(value);
            this.setState({
              selectValue: value
            });
          }}
        >
          {this.state.languages.map(item => {
            return (
              <Option value={item.code} key={item.id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
}
