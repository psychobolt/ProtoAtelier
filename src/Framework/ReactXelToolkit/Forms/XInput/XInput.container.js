// @flow
import * as React from 'react';
import styled from 'styled-components';

export type XInputEvent = {
  type: string,
  target: HTMLInputElement,
  keyCode?: number
}

type FallbackProps = {
  onKeyUp: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  defaultValue?: string
}

type Props = {
  onKeyup: (event: XInputEvent) => void,
  value: string,
  className: string,
  fallback: (props: FallbackProps) => React.Element<'input'>
};

type State = {
  fallbackEnabled: boolean
};

export const EVENT_KEYUP = 'keyup';

export class XInput extends React.Component<Props, State> {
  static defaultProps = {
    value: '', // eslint-disable-line react/default-props-match-prop-types
    fallback: (props: FallbackProps) => // eslint-disable-line react/default-props-match-prop-types
      <input {...props} />,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      fallbackEnabled: false,
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.input = this.ref.current ? this.ref.current['#input'] : null;
    if (this.input) {
      this.input.value = this.props.value;
      this.input.addEventListener(EVENT_KEYUP, this.onKeyboardEvent);
    } else {
      this.onMount(() => {
        this.setState({
          fallbackEnabled: true,
        });
      });
    }
  }

  componentDidUpdate() {
    /* istanbul ignore else */
    if (this.input) {
      this.input.value = this.props.value;
    }
  }

  componentWillUnmount() {
    if (this.input) {
      this.input.removeEventListener(EVENT_KEYUP, this.onKeyboardEvent);
    }
  }

  onSyntheticEvent = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.onKeyUp(event.currentTarget, event.keyCode);
  };

  onKeyboardEvent = (event: KeyboardEvent) => {
    /* istanbul ignore else */
    if (event.target instanceof HTMLInputElement) {
      this.onKeyUp(event.target, event.keyCode);
    }
  }

  onKeyUp = (target: HTMLInputElement, keyCode: number) => {
    this.props.onKeyup({
      type: EVENT_KEYUP,
      target,
      keyCode,
    });
  }

  onMount = (callback: () => void) => {
    callback();
  }

  props: Props;
  input: ?HTMLInputElement;
  ref: React.createRef<React.ElementType>;

  render() {
    const { className, fallback, value } = this.props;
    return (
      <x-input class={className} ref={this.ref}>
        {this.state.fallbackEnabled && fallback({
          onKeyUp: this.onSyntheticEvent,
          defaultValue: value,
        })}
      </x-input>
    );
  }
}

export default styled(XInput)`
  /* stylelint-disable-line block-no-empty */
`;
