export interface DirItem {
  dirtype: string;
  folder: string;
  name: string;
}

export interface FileItem {
  filesize: number;
  filetype: string;
  folder: string;
  name: string;
  url: string;
}

export interface ResourceManageState {
  countdir: number;
  countfile: number;
  dir: Array<DirItem>;
  file: Array<FileItem>;
  isLoading: boolean;
}
