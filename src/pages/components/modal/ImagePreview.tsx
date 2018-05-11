import * as React from 'react';
import { Modal } from 'antd';

interface Props {
  visible: boolean;
  imgSrc: string;
  onClose: () => void;
}

/** 预览大图 */
export default function ImagePreview(props: Props) {
  return (
    <Modal visible={props.visible} footer={null} onCancel={props.onClose}>
      <img src={props.imgSrc} alt="loading..." style={{ width: '100%' }} />
    </Modal>
  );
}
