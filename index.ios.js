import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  NavigatorIOS, 
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Sound from 'react-native-sound';
import TimerMixin from 'react-timer-mixin';

class TimerPage extends Component {
  mixins: [TimerMixin]

  constructor(props) {
    super(props);

    this.props.minutes = this.props.minutes || 3;
    this.state = {
      time: 1000000,
      minutes: this.props.minutes,
      seconds: 0,
      timeUp: false
    }
    startTime = new Date().getTime();
  }

  componentDidMount() {
    this.timer = TimerMixin.setInterval(() => {
      this._update();
    }, 100);
    this._playSound();
  }

  _playSound() {

    const whoosh = new Sound('efx_finish.wav', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else {
        // loaded successfully
        console.log('duration in seconds: ' + whoosh.getDuration() +
          'number of channels: ' + whoosh.getNumberOfChannels());

        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    });
  }

  componentWillUnmount() {
    TimerMixin.clearTimeout(this.timer);
  }

  _update() {
    time = this.props.minutes * 60 * 1000 - (new Date().getTime() - startTime);
    rm = Math.floor((time) / (1000 * 60));
    rs = Math.floor((time) / 1000) % 60;

    if (time < 0) {
      rm = '+' + ((rm + (rs == 0 ? 0 : 1))* -1);
      rs *= -1;
    }

    this.setState({
      time: time,
      minutes: rm,
      seconds: rs
    });
    
    if (!this.state.timeUp && this.state.minutes == 0 && this.state.seconds == 0) {
      this._playSound();
      this.setState({ timeUp: true });
    }
  }
  
  _style() {
    return {
      backgroundColor: !this.state.timeUp ? '#F6F600': '#ff0000',
      padding: 10,
      paddingTop: 74,
      flex: 1
    };
  } 

  render() {
    return (
      <View style={this._style()}>
        <View style={styles.timeView}>
          <Text style={styles.minutes}>{this.state.minutes}</Text>
          <Text style={styles.seconds}>{this.state.seconds}</Text>
        </View>
      </View>
    );
  }
}

class MainPage extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {title: '1 min.', minutes: 1},
        {title: '3 min.', minutes: 3},
        {title: '5 min.', minutes: 5},
        {title: '7 min.', minutes: 7},
        {title: '10 min.', minutes: 10},
        {title: '15 min.', minutes: 15},
        {title: '30 min.', minutes: 30},
        {title: '60 min.', minutes: 60},
      ])
    };
  }
  
  _onPressed = (item) => {
    this.props.navigator.push({title: item.title , component: TimerPage, passProps: { minutes: item.minutes } });
  }

  _renderRow(item, sectionID: number, rowID: number) {
    return (
      <TouchableHighlight onPress={() => this._onPressed(item)}>
        <View>
          <View style={styles.listViewRow}>
            <Text style={styles.listViewText}>
              {item.title}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionID: number, rowID: number) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: 1,
          backgroundColor: '#CCCCCC',
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.mainPage}>
        <ListView
          style={{flex: 1}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator}
        />
      </View>
    );
  }
}

export default class BasicProject extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{ 
          component: MainPage,
          title: 'Lightning Talk Timer'
        }}
        style= {styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  
  mainPage: {
    flex: 1,
  },
  listViewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    height: 50,
  },
  listViewThumb: {
    width: 64,
    height: 64,
  },
  listViewText: {
    flex: 1,
    fontSize: 16,
  },

  timeView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  minutes: {
    fontSize: 240,
    textAlign: 'center',
    margin: 10,
    color: '#000000',
    fontWeight: '700',
  },
  seconds: {
    fontSize: 140,
    textAlign: 'center',
    margin: 10,
    color: '#000000',
    fontWeight: '900',
  },
});

AppRegistry.registerComponent('BasicProject', () => BasicProject);
