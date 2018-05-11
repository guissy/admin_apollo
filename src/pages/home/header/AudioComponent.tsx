import * as React from 'react';
import ReactDOM from 'react-dom';

/** 语音播报 */
export default function AudioComponent({ name, onRef }: AudioProps) {
  return (
    <audio
      src={`../../../assets/music/${name}.wav`}
      preload="metadata"
      ref={audio => audio && onRef(ReactDOM.findDOMNode(audio) as HTMLAudioElement)}
    />
  );
}

interface AudioProps {
  name: string;
  onRef: (audio: HTMLAudioElement) => void; // tslint:disable-line:no-any
}
