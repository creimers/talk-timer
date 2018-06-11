import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";

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

const Settings = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  cursor: pointer;
`;

class App extends Component {
  state = {
    running: false,
    totalSeconds: 100,
    minutesRemaining: 5,
    secondsRemaining: 0,
    warnAtSeconds: 30,
    showSettingsModal: false
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

    if (!running) {
      let totalSeconds = minutesRemaining * 60 + secondsRemaining;
      this.setState(
        { running: true, totalSeconds },
        () =>
          (this.interval = setInterval(() => {
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
      showSettingsModal
    } = this.state;
    const minutes =
      minutesRemaining < 10 ? `0${minutesRemaining}` : minutesRemaining;
    const seconds =
      secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;
    const color = this._getColor(totalSeconds);
    const background = this._getBackground(totalSeconds);
    return (
      <Wrapper background={background}>
        <RemainingTime color={color}>
          {minutes}:{seconds}
        </RemainingTime>
        <Settings onClick={this.toggleSettingsModal}>
          <Icon name="setting" inverted style={{ color: color }} />
          <SettingsModal
            minutes={minutesRemaining}
            seconds={secondsRemaining}
            warnAtSeconds={warnAtSeconds}
            handleSave={this.saveSettings}
            handleCancel={this.toggleSettingsModal}
            open={showSettingsModal}
          />
        </Settings>
      </Wrapper>
    );
  }
}

export default App;
