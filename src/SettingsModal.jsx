import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Form, Modal } from "semantic-ui-react";
import styled from "styled-components";

const propTypes = {
  open: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  warnAtSeconds: PropTypes.number.isRequired
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

class SettingsModal extends Component {
  state = {
    minutes: 0,
    seconds: 0,
    warnAtSeconds: 0
  };

  componentDidMount() {
    const { minutes, seconds, warnAtSeconds } = this.props;
    this.setState({ minutes, seconds, warnAtSeconds });
  }

  _onChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  _save = () => {
    const { minutes, seconds, warnAtSeconds } = this.state;
    this.props.handleSave(minutes, seconds, warnAtSeconds);
  };

  render() {
    return (
      <div>
        <Modal open={this.props.open}>
          <Modal.Header>Timer Settings</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this._save}>
              <Form.Input
                type="number"
                label="Minutes"
                name="minutes"
                value={this.state.minutes}
                onChange={this._onChange}
                min={0}
              />
              <Form.Input
                type="number"
                label="Seconds"
                name="seconds"
                value={this.state.seconds}
                onChange={this._onChange}
                min={0}
                max={59}
              />
              <Form.Input
                type="number"
                label="Warning at seconds"
                name="warnAtSeconds"
                value={this.state.warnAtSeconds}
                onChange={this._onChange}
                min={0}
                max={59}
              />
            </Form>
            <ButtonRow>
              <Button type="button" onClick={this.props.handleCancel}>
                cancel
              </Button>
              <Button type="submit" primary onClick={this._save}>
                save
              </Button>
            </ButtonRow>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

SettingsModal.propTypes = propTypes;

export default SettingsModal;
