export interface DirItem {
  id: number;
  dirtype: string;
  folder: string;
  name: string;
}

export interface FileItem {
  id: number;
  size: number;
  filetype: string;
  folder: string;
  name: string;
  url: string;
}

export interface ResourceFile {
  countdir: number;
  countfile: number;
  dir: Array<DirItem>;
  file: Array<FileItem>;
}
