import * as React from 'react';
import environment from '../../../utils/environment';
import { Modal, Button, Form, Tag } from 'antd';
import ImagePreview from './ImagePreview';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { SearchFormConfig } from '../form/SearchComponent';

interface Props {
  site?: (p: IntlKeys) => React.ReactNode;
  title: string; // 标题
  visible: boolean; // modal显示
  onClose: Function; // 关闭modal事件
  itemObj: object; // 当前查看item数据
  columns: ViewFormConfig[]; // 配置字段
}
interface State {
  isImgVisible: boolean; // 图片放大显示
  imgFileSrc: string; // 图片的路径
}
/** 针对调用view组件的表格的columns增加两个属性 */
export interface ViewFormConfig extends SearchFormConfig {
  viewRender?: (text: string) => React.ReactNode; // 专门为详情渲染
  notInView?: boolean; // 是否在详情中显示
}

/**
 * 详情弹出框
 * 用于表格操作区的查看详情
 */
@withLocale
export default class DetailModal extends React.PureComponent<Props, State> {
  state = {
    isImgVisible: false,
    imgFileSrc: ''
  };

  onClose = (e: React.FormEvent<HTMLFormElement>) => {
    return this.props.onClose();
  }
  // 图片
  onViewImg = (src: string) => {
    this.setState({
      imgFileSrc: src,
      isImgVisible: !this.state.isImgVisible
    });
  }
  onCloseImg = () => {
    this.setState({
      isImgVisible: !this.state.isImgVisible
    });
  }
  render() {
    const { site = () => null } = this.props;
    const { itemObj, columns } = this.props;

    const viewArr = columns.filter(v => v.notInView !== true);
    const list = viewArr.map(v => {
      // dataIndex包含pictrue和img的默认为图片渲染
      if (v.dataIndex.includes('picture') || v.dataIndex.includes('img')) {
        const imgHtml = (
          <a
            style={{ display: 'inline-block', width: 300, overflow: 'hidden' }}
            onClick={() => this.onViewImg(environment.imgHost + itemObj[v.dataIndex])}
          >
            <img
              style={{ width: '100%' }}
              src={environment.imgHost + itemObj[v.dataIndex]}
              alt="loading"
            />
          </a>
        );
        return { title: v.title, val: imgHtml };
      } else {
        // 渲染的优先级 render > viewrender > ...
        if (v.render) {
          return { title: v.title, val: v.render(itemObj[v.dataIndex], itemObj) };
        } else if (v.viewRender) {
          return { title: v.title, val: v.viewRender };
        } else {
          return { title: v.title, val: itemObj[v.dataIndex] };
        }
      }
    });

    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    return (
      <>
        <Modal
          title={site(this.props.title)}
          visible={this.props.visible}
          onCancel={this.onClose}
          footer={[
            <Button key="back" onClick={this.onClose}>
              {site('关闭')}
            </Button>
          ]}
        >
          <Form>
            {list.map((v, i) => {
              return (
                <FormItem key={i} label={v.title} {...formItemLayout}>
                  {v.val}
                </FormItem>
              );
            })}
          </Form>
        </Modal>
        <ImagePreview
          imgSrc={this.state.imgFileSrc}
          visible={this.state.isImgVisible}
          onClose={this.onCloseImg}
        />
      </>
    );
  }
}
