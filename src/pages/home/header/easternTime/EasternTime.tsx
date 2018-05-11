import * as React from 'react';
import styled from 'styled-components';
import { EDTtime } from 'joys-react-common';
import moment from 'moment';
import withLocale from '../../../../utils/withLocale';

const Wrap = styled.span`
  font-size: 16px;
`;

/** 时钟 */
@withLocale
export default class EasternTime extends React.PureComponent<EasternTimeProps> {
  private time: number;

  constructor(props: EasternTimeProps) {
    super(props);
  }

  componentDidMount() {
    window.clearInterval(this.time);
    this.time = window.setInterval(
      () => {
        this.setState({ time: new Date() });
      },
      1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.time);
  }

  render() {
    const { site = () => '' } = this.props;

    return (
      <Wrap>
        {site('美东时间')} ( -04:00 ) {moment(EDTtime()).format('YYYY-MM-DD HH:mm:ss')}
      </Wrap>
    );
  }
}

interface EasternTimeProps {
  site?: (words: string) => React.ReactNode;
}
