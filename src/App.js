import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import styled from "styled-components";
import { Button } from "semantic-ui-react";

import buzzer from "./buzzer.mp3";
import SettingsModal from "./SettingsModal";

const GREEN = "#1DC664";
const YELLOW = "#ffff00";
const RED = "#f44336";
const BLACK = "#000000";
const WHITE = "#ffffff";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.background};
  position: relative;
`;

const RemainingTime = styled.div`
  color: ${props => props.color};
  font-size: 25rem;
  font-family: "Roboto Mono", monospace;
`;

const ButtonsRow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

class App extends Component {
  state = {
    running: false,
    minutes: 5,
    seconds: 0,
    totalSeconds: 100,
    minutesRemaining: 5,
    secondsRemaining: 0,
    warnAtSeconds: 30,
    showSettingsModal: false,
    paused: false
  };

  componentDidMount() {
    this.buzzer = new Audio(buzzer);
    window.addEventListener("keypress", e => {
      if (e.key === " " || e.key === "Spacebar") {
        this._startCountdown();
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("keypress");
  }

  _reset = () => {
    clearInterval(this.interval);
    let totalSeconds = this.state.minutes * 60 + this.state.seconds;
    this.setState({
      minutesRemaining: this.state.minutes,
      secondsRemaining: this.state.seconds,
      running: false,
      paused: false,
      totalSeconds
    });
  };

  _pause = () => {
    this.setState({ paused: true });
  };

  _resume = () => {
    this.setState({ paused: false });
  };

  _getBackground = seconds => {
    const { warnAtSeconds } = this.state;
    if (seconds === 0) {
      return RED;
    }
    if (seconds <= warnAtSeconds) {
      return YELLOW;
    }
    return GREEN;
  };

  _getColor = seconds => {
    const { warnAtSeconds } = this.state;
    if (seconds === 0) {
      return WHITE;
    }
    if (seconds <= warnAtSeconds) {
      return BLACK;
    }
    return WHITE;
  };

  _startCountdown = () => {
    let { running, minutesRemaining, secondsRemaining } = this.state;
    this.setState({ paused: false });

    if (!running) {
      let totalSeconds = minutesRemaining * 60 + secondsRemaining;
      this.setState(
        { running: true, totalSeconds },
        () =>
          (this.interval = setInterval(() => {
            const { paused } = this.state;
            if (!paused) {
              let { totalSeconds } = this.state;
              if (totalSeconds > 1) {
                totalSeconds = totalSeconds - 1;
                const minutesRemaining = Math.floor(totalSeconds / 60);
                const secondsRemaining = totalSeconds - minutesRemaining * 60;
                this.setState({
                  totalSeconds,
                  minutesRemaining,
                  secondsRemaining
                });
              } else {
                this.setState({
                  totalSeconds: 0,
                  minutesRemaining: 0,
                  secondsRemaining: 0
                });
                this._playBuzzer();
              }
            }
          }, 1000))
      );
    }
  };

  _playBuzzer = () => {
    this.buzzer.play();
    clearInterval(this.interval);
  };

  toggleSettingsModal = () => {
    const { showSettingsModal } = this.state;
    this.setState({ showSettingsModal: !showSettingsModal });
  };

  saveSettings = (minutes, seconds, warnAtSeconds) => {
    minutes = parseInt(minutes, 10);
    seconds = parseInt(seconds, 10);
    warnAtSeconds = parseInt(warnAtSeconds, 10);
    this.setState({
      minutesRemaining: minutes,
      secondsRemaining: seconds,
      minutes,
      seconds,
      warnAtSeconds
    });
    this.toggleSettingsModal();
  };

  render() {
    const {
      minutesRemaining,
      secondsRemaining,
      warnAtSeconds,
      totalSeconds,
      showSettingsModal,
      running,
      paused
    } = this.state;
    const minutes =
      minutesRemaining < 10 ? `0${minutesRemaining}` : minutesRemaining;
    const seconds =
      secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;
    const color = this._getColor(totalSeconds);
    const background = this._getBackground(totalSeconds);
    const blackIcons = totalSeconds <= warnAtSeconds;
    return (
      <Wrapper background={background}>
        <RemainingTime color={color}>
          {minutes}:{seconds}
        </RemainingTime>
        <ButtonsRow>
          {(minutesRemaining === 0 &&
            secondsRemaining === 0 &&
            totalSeconds === 0) ||
          paused ? (
            <Button
              icon="undo"
              basic
              onClick={this._reset}
              inverted={!blackIcons}
              color={blackIcons ? "black" : "grey"}
            />
          ) : null}
          <Button
            icon={!running || paused ? "play" : "pause"}
            basic
            inverted={!blackIcons}
            color={blackIcons ? "black" : "grey"}
            onClick={() => {
              if (!running) {
                this._startCountdown();
                return;
              }
              if (paused) {
                this._resume();
              } else {
                this._pause();
              }
            }}
          />
          <Button
            icon="setting"
            basic
            onClick={this.toggleSettingsModal}
            inverted={!blackIcons}
            color={blackIcons ? "black" : "grey"}
          />
        </ButtonsRow>
        <SettingsModal
          minutes={minutesRemaining}
          seconds={secondsRemaining}
          warnAtSeconds={warnAtSeconds}
          handleSave={this.saveSettings}
          handleCancel={this.toggleSettingsModal}
          open={showSettingsModal}
        />
      </Wrapper>
    );
  }
}

export default App;
