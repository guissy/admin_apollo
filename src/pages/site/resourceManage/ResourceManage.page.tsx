import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Breadcrumb, Button, Card, Form, Input, message, Modal, Select, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import withLocale from '../../../utils/withLocale';
import { DirItem, ResourceManageState } from './ResourceManage.model';
import environment from '../../../utils/environment';
import ImagePreview from '../../components/modal/ImagePreview';
import { copyToClipboard } from '../../components/copyText/CopyText';
import UploadComponent from '../../components/upload/UploadComponent';
import showMessage, { messageError } from '../../../utils/showMessage';
import { Result } from '../../../utils/result';

const confirm = Modal.confirm;

const TitleWrap = styled.div`
  button {
    margin: 0 4px;
  }
`;
const FileItem = styled.ul`
  height: 43px;
  border-bottom: 1px solid #f2f6fd;
  font-size: 14px;
  color: #888;
  padding-left: 0;
  display: flex;

  .name {
    cursor: pointer;
    width: 45%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 36px;
    list-style-type: none;
  }
  .size {
    width: 20%;
    line-height: 36px;
    list-style-type: none;
  }
  .operating {
    width: 35%;
    line-height: 36px;
    list-style-type: none;
  }
`;

interface Props {
  dispatch: Dispatch;
  form: WrappedFormUtils;
  site: (p: string) => React.ReactNode;
  resourceManage: ResourceManageState;
}

interface State {
  breadcrumbs: Array<string>;
  viewImgSrc: string;
  viewImgVisible: boolean;
  isLoading: boolean;
  uploadVisible: boolean;
  uploadFolder: string;
}

/** 资源站管理 */
@withLocale
@Form.create()
@select('resourceManage')
export default class ResourceManagePage extends React.PureComponent<Props, State> {
  // tslint:disable-next-line:no-any
  fileCotent: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      breadcrumbs: [],
      viewImgSrc: '',
      viewImgVisible: false,
      isLoading: false,
      uploadVisible: false,
      uploadFolder: ''
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'resourceManage/loadData',
      payload: {}
    });
  }

  componentDidUpdate() {
    const fileCotent = ReactDOM.findDOMNode(this.fileCotent) as HTMLElement;
    if (fileCotent) {
      fileCotent.style.height = window.innerHeight - 350 + 'px';
      fileCotent.style.maxHeight = window.innerHeight - 350 + 'px';
    }
  }

  // tslint:disable-next-line:member-ordering
  static getDerivedStateFromProps(nextProps: Props) {
    return {
      isLoading: nextProps.resourceManage.isLoading
    };
  }

  openChildFolder = (dirData: DirItem) => {
    let breadcrumbList;
    if (this.state.breadcrumbs.length === 0) {
      breadcrumbList = [];
      breadcrumbList.push(dirData.name);
    } else {
      breadcrumbList = this.state.breadcrumbs;
      breadcrumbList.push(dirData.name);
    }
    this.setState({
      breadcrumbs: breadcrumbList,
      isLoading: false
    });
    this.props.dispatch({
      type: 'resourceManage/openFolder',
      payload: {
        folder: dirData.folder
      }
    });
  }

  breadcrumbNavigate = (breadcrumbItem: string, breadcrumbIndex: number) => {
    let breadcrumbs = this.state.breadcrumbs;
    breadcrumbs.splice(breadcrumbIndex + 1, breadcrumbs.length - 1);
    this.setState({
      breadcrumbs: breadcrumbs,
      isLoading: false
    });
    let param = '';
    breadcrumbs.forEach((item, index) => {
      param = param + '/' + item;
    });
    this.props.dispatch({
      type: 'resourceManage/openFolder',
      payload: {
        folder: param
      }
    });
  }

  delectResources = (url: string) => {
    confirm({
      title: this.props.site('确认删除吗？该操作不可恢复'),
      onOk: () => {
        this.setState({ isLoading: false });
        this.props
          .dispatch({
            type: 'resourceManage/delete',
            payload: {
              url: url
            }
          })
          .then(res => {
            if (res.state === '0') {
              this.refresh();
            }
          });
      }
    });
  }

  rename = (name: string, folder: string) => {
    let breadcrumbs = this.state.breadcrumbs;
    let url = '';
    breadcrumbs.forEach((item, index) => {
      url = url + '/' + item;
    });
    let value: string;
    confirm({
      title: this.props.site('请输入新的名称'),
      content: <Input defaultValue={name} onChange={e => (value = e.target.value)} />,
      onOk: () => {
        this.setState({ isLoading: false });
        this.props
          .dispatch({
            type: 'resourceManage/rename',
            payload: {
              name: value,
              url: folder
            }
          })
          .then(res => {
            if (res.state === '0') {
              this.refresh();
            }
          });
      }
    });
  }

  addDir = () => {
    let breadcrumbs = this.state.breadcrumbs;
    let url = '';
    breadcrumbs.forEach((item, index) => {
      url = url + '/' + item;
    });
    let value: string;
    confirm({
      title: this.props.site('请输入新文件夹名称'),
      content: <Input defaultValue={name} onChange={e => (value = e.target.value)} />,
      onOk: () => {
        this.setState({ isLoading: false });
        this.props
          .dispatch({
            type: 'resourceManage/addDir',
            payload: {
              name: value,
              url: url === '' ? '/' : url
            }
          })
          .then(res => {
            if (res.state === '0') {
              this.refresh();
            }
          });
      }
    });
  }

  uploadFile = () => {
    let breadcrumbs = this.state.breadcrumbs;
    this.setState({ uploadVisible: true });
    let folder = '';
    breadcrumbs.forEach((item, index) => {
      folder = folder + '/' + item;
    });
    this.setState({ uploadFolder: folder });
  }

  refresh = () => {
    this.setState({ isLoading: false });
    let breadcrumbs = this.state.breadcrumbs;
    let folder = '';
    breadcrumbs.forEach((item, index) => {
      folder = folder + '/' + item;
    });
    this.props.dispatch({
      type: 'resourceManage/openFolder',
      payload: {
        folder: folder
      }
    });
  }

  render() {
    return (
      <div>
        <Modal
          title={this.props.site('上传文件')}
          visible={this.state.uploadVisible}
          onOk={() => this.setState({ uploadVisible: false })}
          onCancel={() => this.setState({ uploadVisible: false })}
          cancelText="取消"
        >
          <UploadComponent
            folder={this.state.uploadFolder}
            // tslint:disable-next-line:no-any
            onDone={(res: Result<{}>) => {
              if (res.state === 0) {
                showMessage(true);
                this.refresh();
                this.setState({ uploadVisible: false });
              } else {
                messageError(res.message);
              }
            }}
          />
        </Modal>
        <ImagePreview
          imgSrc={this.state.viewImgSrc}
          visible={this.state.viewImgVisible}
          onClose={() => {
            this.setState({
              viewImgVisible: false
            });
          }}
        />
        <Card
          title={
            <TitleWrap>
              <Button onClick={this.uploadFile}>{this.props.site('上传文件')}</Button>
              <Button onClick={this.addDir}>{this.props.site('新建文件夹')}</Button>
            </TitleWrap>
          }
        >
          <Breadcrumb>
            <Breadcrumb.Item
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ isLoading: false, breadcrumbs: [] });
                this.props.dispatch({ type: 'resourceManage/loadData', payload: {} });
              }}
            >
              {this.props.site('全部文件')}
            </Breadcrumb.Item>
            {this.state.breadcrumbs.map((item, index) => {
              return (
                <Breadcrumb.Item
                  style={{ cursor: 'pointer' }}
                  key={index}
                  onClick={() => this.breadcrumbNavigate(item, index)}
                >
                  {item}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          {this.state.isLoading ? (
            <div>
              <FileItem>
                <li className={'name'}>
                  <span>{this.props.site('文件名')}</span>
                </li>
                <li className={'size'}>
                  <span>{this.props.site('大小')}</span>
                </li>
                <li className={'operating'}>
                  <span>{this.props.site('操作')}</span>
                </li>
              </FileItem>
              <div
                style={{ overflow: 'scroll' }}
                ref={fileCotent => (this.fileCotent = fileCotent)}
              >
                {this.props.resourceManage.dir.map((dirItem, dirIndex) => {
                  return (
                    <FileItem key={dirIndex}>
                      <li className={'name'} onClick={() => this.openChildFolder(dirItem)}>
                        {dirItem.dirtype === 'sys' ? (
                          <img
                            width="40"
                            height="40"
                            src="../../../assets/images/resourcesManagement/default.svg"
                          />
                        ) : (
                          ''
                        )}
                        <img
                          style={{ margin: '0 5px' }}
                          width="20"
                          height="20"
                          src="../../../assets/images/resourcesManagement/folder.svg"
                        />
                        <span>{dirItem.name}</span>
                      </li>
                      <li className={'size'}>
                        <span>-</span>
                      </li>
                      <li className={'operating'}>
                        {dirItem.dirtype !== 'sys' ? (
                          <div>
                            <Button onClick={() => this.rename(dirItem.name, dirItem.folder)}>
                              {this.props.site('重命名')}
                            </Button>
                            <Button
                              style={{ marginLeft: '5px' }}
                              type="danger"
                              onClick={() => this.delectResources(dirItem.folder)}
                            >
                              {this.props.site('删除')}
                            </Button>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </li>
                    </FileItem>
                  );
                })}
                {this.props.resourceManage.file.map((fileItem, fileIndex) => {
                  return (
                    <FileItem key={fileIndex}>
                      <li
                        className={'name'}
                        onClick={() => {
                          this.setState({
                            viewImgSrc: environment.imgHost + fileItem.url,
                            viewImgVisible: true
                          });
                        }}
                      >
                        <img
                          style={{ margin: '0 5px' }}
                          width="20"
                          height="20"
                          src={environment.imgHost + fileItem.url}
                        />
                        <span>{fileItem.name}</span>
                      </li>
                      <li className={'size'}>
                        <span>{fileItem.filesize / 1000}k</span>
                      </li>
                      <li className={'operating'}>
                        <Button
                          onClick={() => {
                            copyToClipboard(environment.imgHost + fileItem.url, '复制成功');
                          }}
                        >
                          {this.props.site('复制图片路径')}
                        </Button>
                        <Button
                          style={{ margin: '0 5px' }}
                          onClick={() => this.rename(fileItem.name, fileItem.folder)}
                        >
                          {this.props.site('重命名')}
                        </Button>
                        <Button type="danger" onClick={() => this.delectResources(fileItem.url)}>
                          {this.props.site('删除')}
                        </Button>
                      </li>
                    </FileItem>
                  );
                })}
              </div>
            </div>
          ) : (
            <Spin />
          )}
        </Card>
      </div>
    );
  }
}
