import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Alarm, {removeAlarm, scheduleAlarm, updateAlarm} from '../alarm';
import TextInput from '../components/TextInput';
import DayPicker from '../components/DayPicker';
import TimePicker from '../components/TimePicker';
import Button from '../components/Button';
import {globalStyles} from '../global';
import SwitcherInput from '../components/SwitcherInput';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';

export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const [mode, setMode] = useState(null);

  function getNextTimeTimeStamp(hour, minute) {
    const now = new Date();
    const nextTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
    );
    if (nextTime < now) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    return Math.floor(nextTime.getTime() / 1000);
  }

  function getHourFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.getHours();
  }

  function getMinuteFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.getMinutes();
  }
  function update(updates) {
    const a = Object.assign({}, alarm);
    for (let u of updates) {
      a[u[0]] = u[1];
    }
    setAlarm(a);
    console.log('updated alarm: ', JSON.stringify(a));
  }

  useEffect(() => {
    if (route.params && route.params.alarm) {
      setAlarm(route.params.alarm);
      setMode(route.params.mode);
      console.log('alarm in edit-3 :', route.params.alarm);
      console.log('mode in edit-3 :', route.params.mode);
    } else {
      setAlarm(new Alarm());
      setMode('CREATE');
    }
  }, []);

  if (!alarm) {
    return <View />;
  }
  return (
    <View>
      <Text>When Do You Want To Start</Text>
      <TimePicker
        onChange={(h, m) =>
          update([
            ['initialHour', h],
            ['initialMinute', m],
          ])
        }
        hour={alarm.initialHour}
        minutes={alarm.initialMinute}
      />

      <Text>{JSON.stringify(alarm)}</Text>
      <Button
        fill={true}
        onPress={() => console.log(JSON.stringify(alarm))}
        title={'print alarm'}
      />
      <Button
        fill={true}
        onPress={() =>
          navigation.navigate('Edit-4', {alarm: alarm, mode: mode})
        }
        title={'go to edit-4'}
      />
    </View>
  );
}
