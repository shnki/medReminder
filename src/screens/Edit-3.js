import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Alarm from '../alarm';
import Button from '../components/Button';
import TimePicker from '../components/timePicker';
import {colors, globalStyles} from '../global';

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

  const date = new Date();
  date.setHours(alarm.initialHour);
  date.setMinutes(alarm.initialMinute);
  return (
    <View>
      <Text style={globalStyles.title}>When you want to start ?</Text>

      <TimePicker
        hour={alarm.initialHour}
        minutes={alarm.initialMinute}
        onChange={(h, m) =>
          update([
            ['initialHour', h],
            ['initialMinute', m],
          ])
        }
      />

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
