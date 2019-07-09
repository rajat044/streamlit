/**
 * @license
 * Copyright 2019 Streamlit Inc. All rights reserved.
 */

import React from 'react'
import { Textarea as UITextArea } from 'baseui/textarea'
import { Map as ImmutableMap } from 'immutable'
import { WidgetStateManager } from 'lib/WidgetStateManager'

interface Props {
  disabled: boolean;
  element: ImmutableMap<string, any>;
  widgetMgr: WidgetStateManager;
  width: number;
}

interface State {
  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, it's undefined.
   */
  value?: string;

  /**
   * True if the user-specified state.value has not yet been synced to the WidgetStateManager.
   */
  dirty: boolean;
}

class TextArea extends React.PureComponent<Props, State> {
  public state: State = {
    dirty: false,
  }

  /**
   * Return the user-entered value, or the widget's default value
   * if the user hasn't interacted with it yet.
   */
  private get valueOrDefault(): string {
    if (this.state.value === undefined) {
      return this.props.element.get('value') as string
    } else {
      return this.state.value
    }
  }

  private onKeyPress = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const event = e as React.KeyboardEvent<HTMLTextAreaElement>

    if (event.key === 'Enter' && event.ctrlKey && this.state.dirty) {
      this.setWidgetValue()
    }
  }

  private onBlur = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    if (this.state.dirty) {
      this.setWidgetValue()
    }
  }

  private onChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const value = (e.target as HTMLTextAreaElement).value
    this.setState({
      value,
      dirty: true,
    })
  }

  private setWidgetValue(): void {
    if (this.state.value === undefined) {
      throw new Error('Assertion error: value is undefined')
    }
    const widgetId = this.props.element.get('id')
    this.props.widgetMgr.setStringValue(widgetId, this.state.value)
    this.setState({ dirty: false })
  }

  public render(): React.ReactNode {
    const label = this.props.element.get('label')
    const style = { width: this.props.width }

    return (
      <div className="Widget stTextArea" style={style}>
        <label>{label}</label>
        <UITextArea
          value={this.valueOrDefault}
          disabled={this.props.disabled}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          onBlur={this.onBlur}
        />
      </div>
    )
  }
}

export default TextArea