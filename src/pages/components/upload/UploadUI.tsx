import * as React from 'react';
import styled from 'styled-components';
import { Button, Icon, Upload, Modal } from 'antd';
import environment from '../../../utils/environment';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';
import withLocale from '../../../utils/withLocale';
import { messageError } from '../../../utils/showMessage';
import { getFullSrc } from '../../../utils/env.utils';

const UploadContainer = styled.div`
  .tip {
    font-size: 12px;
  }
`;

function initValue(props: Props): UploadFile[] {
  const { value = '' } = props;
  const file: UploadFile = {
    url: getFullSrc(value),
    uid: Date.now(),
    size: 0,
    name: value,
    type: 'img'
  };
  return value ? [file] : [];
}

interface Props {
  limit?: number; // image大小, 单位mb  选填
  value?: string; // 默认展示图片的地址  选填
  onChange?: Function; // 子组件返给父组件的值  选填
  onDone?: Function;
  folder?: string; // 上传图片的文件夹地址  选填
  site?: (p: string) => string;
}
interface State {
  fileList: Array<UploadFile>;
  previewVisible: boolean;
  previewImage: string | undefined;
}
const token = window.sessionStorage.getItem(environment.tokenName);
const headers = { Authorization: 'Bearer ' + token };

/**
 * 上传图片
 * @example
 * <UploadComponent
 *   limit={3}
 *   onChange={this.onChange}
 *   value={2.jpg'}
 *   folder = {'web'}
 * />
 */
@withLocale
export default class UploadUI extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    limit: 10,
    folder: ''
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const value = prevState.fileList && prevState.fileList[0] && prevState.fileList[0].name;
    if (nextProps.value !== value) {
      return { ...prevState, fileList: initValue(nextProps) };
    } else {
      return prevState;
    }
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      fileList: initValue(props),
      previewVisible: false,
      previewImage: ''
    };
  }

  beforeUpload = (file: UploadFile) => {
    const { site = () => '' } = this.props;
    const isJPG = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type);
    if (!isJPG) {
      messageError(site('只能上传 jpg、 jpeg、 png、 gif文件'));
    }
    const names = file.name.split('.');
    names.pop();
    const isName = /^[a-zA-Z0-9_]+$/.test(names.join('.')); // 英文、数字、下划线
    if (!isName) {
      // 检查图片名是否合法
      messageError(site('文件名只能是英文、数字、下划线'));
    }
    const { limit = 10 } = this.props;
    const isSizeOk = file.size / 1024 / 1024 < limit;
    if (!isSizeOk) {
      messageError(site(`图片体积必须小于${this.props.limit}M`));
    }
    return isSizeOk && isName && isJPG;
  }
  onChange = (file: UploadChangeParam) => {
    const { site = () => '' } = this.props;
    // 去最后一张用于展示
    const lastFile = file.fileList.slice().pop();
    if (lastFile) {
      this.setState({
        fileList: [lastFile]
      });
    }
    if (file.file.status === 'done') {
      // 把服务器返回的值 抛给父组件
      const first = file.fileList[0];
      console.log(first.response.data.file[0].url);
      if (this.props.onChange && first) {
        this.props.onChange(first.response.data.file[0].url);
      }
      if (this.props.onDone && first) {
        this.props.onDone(first.response);
      }
    }
  }
  onRemove = () => {
    this.setState({
      fileList: []
    });
  }
  handleCancel = () => this.setState({ previewVisible: false });
  onPreview = (file: UploadFile) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }
  render() {
    const { site = () => '' } = this.props;
    return (
      <UploadContainer>
        <Upload
          action={`${environment.imgHost}/api/${this.props.folder}`}
          listType="picture"
          fileList={this.state.fileList}
          headers={headers}
          name={'upfile[]'}
          data={{
            post_type: 'upfile'
          }}
          beforeUpload={this.beforeUpload}
          onChange={this.onChange}
          onRemove={this.onRemove}
          onPreview={this.onPreview}
        >
          <Button>
            <Icon type="upload" /> {site('点击上传文件')}
          </Button>
        </Upload>
        <span className="tip">
          {site(
            '只能上传 jpg、 jpeg、 png、 gif文件,文件名只能是英文、数字、下划线, 且单个文件大小不能超过10M ,图片建议分辨率大小为460*180'
          )}
        </span>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </UploadContainer>
    );
  }
}
