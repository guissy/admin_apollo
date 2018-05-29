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

export interface ResourceFile {
  countdir: number;
  countfile: number;
  dir: Array<DirItem>;
  file: Array<FileItem>;
}
