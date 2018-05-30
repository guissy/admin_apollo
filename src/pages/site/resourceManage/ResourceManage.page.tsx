import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import styled from 'styled-components';
import { Breadcrumb, Button, Card, Form, Input, Modal, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import withLocale from '../../../utils/withLocale';
import { DirItem, FileItem, ResourceFile } from './ResourceManage.model';
import environment from '../../../utils/environment';
import ImagePreview from '../../components/modal/ImagePreview';
import { copyToClipboard } from '../../components/copyText/CopyText';
import UploadComponent from '../../components/upload/UploadComponent';
import showMessage, { messageError, messageResult } from '../../../utils/showMessage';
import { Result } from '../../../utils/result';
import { compose, graphql, MutationFn, Query } from 'react-apollo';
import gql from 'graphql-tag';

const confirm = Modal.confirm;

const Div = styled.div`
  .ant-breadcrumb-link {
    cursor: pointer;
  }
  .title {
    button {
      margin: 0 4px;
    }
  }
  .files {
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
  }
`;

interface Props {
  dispatch: Dispatch;
  form: WrappedFormUtils;
  site: (p: string) => React.ReactNode;
  resourceManage: ResourceFile;
  delResourceMutation: MutationFn;
  renameResourceMutation: MutationFn;
  addResourceMutation: MutationFn;
}

/** 资源站管理 */
@withLocale
@Form.create()
@compose(
  graphql<{}, {}, {}>(
    gql`
      mutation delResourceMutation($id: Int!) {
        delResource(id: $id)
          @rest(type: "DelResourceResult", path: "/resourceFiles/:id", method: "DELETE") {
          state
          message
        }
      }
    `,
    {
      name: 'delResourceMutation',
      options: {
        refetchQueries: ['resourceFiles']
      }
    }
  ),
  graphql<{}, {}, {}>(
    gql`
      mutation renameResourceMutation($id: Int!, $body: RenameInput) {
        renameResource(id: $id, body: $body)
          @rest(
            type: "RenameResourceResult"
            path: "/resourceFiles/:id"
            method: "PATCH"
            bodyKey: "body"
          ) {
          state
          message
        }
      }
    `,
    {
      name: 'renameResourceMutation'
    }
  ),
  graphql<{}, {}, {}>(
    gql`
      mutation addResourceMutation($body: AddResourceInput!) {
        addResource(body: $body)
          @rest(
            type: "RenameResourceResult"
            path: "/resourceFiles"
            method: "PATCH"
            bodyKey: "body"
          ) {
          state
          message
        }
      }
    `,
    {
      name: 'addResourceMutation'
    }
  )
)
@select('')
export default class ResourceManagePage extends React.PureComponent<Props, {}> {
  fileContent: React.ReactInstance;
  nameInput = React.createRef<Input>();
  refetch: Function;

  state = {
    breadcrumbs: [] as string[],
    viewImgSrc: '',
    viewImgVisible: false,
    isLoading: false,
    uploadVisible: false,
    uploadFolder: ''
  };

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
    this.refetch({ folder: dirData.folder });
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
    this.refetch({ folder: param });
  }

  deleteFile = (id: number) => {
    confirm({
      title: this.props.site('确认删除吗？该操作不可恢复'),
      onOk: () => {
        this.props.delResourceMutation({ variables: { id } }).then(messageResult('delResource'));
      }
    });
  }

  rename = (name: string, id: number) => {
    let breadcrumbs = this.state.breadcrumbs;
    let url = '';
    breadcrumbs.forEach((item, index) => {
      url = url + '/' + item;
    });
    confirm({
      title: this.props.site('请输入新的名称'),
      content: <Input defaultValue={name} ref={this.nameInput} />,
      onOk: () => {
        const input = this.nameInput.current as React.ReactInstance;
        const elm = ReactDOM.findDOMNode(input) as HTMLInputElement;
        this.props
          .renameResourceMutation({ variables: { id, body: { name: elm && elm.value } } })
          .then(messageResult('renameResource'));
      }
    });
  }

  addDir = () => {
    let breadcrumbs = this.state.breadcrumbs;
    let url = '';
    breadcrumbs.forEach((item, index) => {
      url = url + '/' + item;
    });

    confirm({
      title: this.props.site('请输入新文件夹名称'),
      content: <Input defaultValue={name} ref={this.nameInput} />,
      onOk: () => {
        const input = this.nameInput.current as React.ReactInstance;
        const elm = ReactDOM.findDOMNode(input) as HTMLInputElement;
        this.props
          .addResourceMutation({ variables: { body: { name: elm && elm.value } } })
          .then(messageResult('addResource'));
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

  render() {
    return (
      <Div>
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
                // this.refresh();
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
            <span className="title">
              <Button onClick={this.uploadFile}>{this.props.site('上传文件')}</Button>
              <Button onClick={this.addDir}>{this.props.site('新建文件夹')}</Button>
            </span>
          }
        >
          <Breadcrumb>
            <Breadcrumb.Item>
              <span
                onClick={() => {
                  this.setState({ isLoading: false, breadcrumbs: [] });
                  this.props.dispatch({ type: 'resourceManage/loadData', payload: {} });
                }}
              >
                {this.props.site('全部文件')}
              </span>
            </Breadcrumb.Item>
            {this.state.breadcrumbs.map((item, index) => {
              return (
                <Breadcrumb.Item key={index}>
                  <span onClick={() => this.breadcrumbNavigate(item, index)}>{item}</span>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <Query
            query={gql`
              query resourceFiles($folder: String = "") {
                resourceFiles(folder: $folder)
                  @rest(type: "ResourceFileResult", path: "/resourceFiles/:folder") {
                  data {
                    countdir
                    countfile
                    dir {
                      id
                      name
                      dirtype
                      folder
                    }
                    file {
                      id
                      name
                      url
                      size
                    }
                  }
                }
              }
            `}
          >
            {({
              data: { resourceFiles = { data: {} as ResourceFile } } = {},
              loading,
              refetch
            }) => {
              this.refetch = refetch;
              return !loading ? (
                <div>
                  <ul className="files">
                    <li className={'name'}>
                      <span>{this.props.site('文件名')}</span>
                    </li>
                    <li className={'size'}>
                      <span>{this.props.site('大小')}</span>
                    </li>
                    <li className={'operating'}>
                      <span>{this.props.site('操作')}</span>
                    </li>
                  </ul>
                  <div ref={fileContent => (this.fileContent = fileContent as React.ReactInstance)}>
                    {resourceFiles.data.dir.map((dirItem: DirItem, i: number) => {
                      return (
                        <ul key={i} className="files">
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
                                <Button onClick={() => this.rename(dirItem.name, dirItem.id)}>
                                  {this.props.site('重命名')}
                                </Button>
                                <Button
                                  style={{ marginLeft: '5px' }}
                                  type="danger"
                                  onClick={() => this.deleteFile(dirItem.id)}
                                >
                                  {this.props.site('删除')}
                                </Button>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </li>
                        </ul>
                      );
                    })}
                    {resourceFiles.data.file.map((fileItem: FileItem, i: number) => {
                      return (
                        <ul key={i} className="files">
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
                              src={fileItem.url}
                            />
                            <span>{fileItem.name}</span>
                          </li>
                          <li className={'size'}>
                            <span>{fileItem.size / 1000}k</span>
                          </li>
                          <li className={'operating'}>
                            <Button
                              onClick={() => {
                                copyToClipboard(fileItem.url, '复制成功');
                              }}
                            >
                              {this.props.site('复制图片路径')}
                            </Button>
                            <Button
                              style={{ margin: '0 5px' }}
                              onClick={() => this.rename(fileItem.name, fileItem.id)}
                            >
                              {this.props.site('重命名')}
                            </Button>
                            <Button type="danger" onClick={() => this.deleteFile(fileItem.id)}>
                              {this.props.site('删除')}
                            </Button>
                          </li>
                        </ul>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Spin />
              );
            }}
          </Query>
        </Card>
      </Div>
    );
  }
}
