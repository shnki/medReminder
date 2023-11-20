import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Alarm from '../alarm';
import Button from '../components/Button';
import TimePicker from '../components/timePicker';
import {colors, globalStyles} from '../global';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
      navigation.setOptions({
        title: route.params.mode,
      });
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
    <View style={globalStyles.initialTimeContainer}>
      <View style={globalStyles.timePickerContainer}>
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
      </View>
      <View style={styles.buttonContainer}>
        <Button
          fill={true}
          onPress={() =>
            navigation.navigate('Edit-4', {alarm: alarm, mode: mode})
          }
          title={'Next'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timePickerContainer: {
    height: hp('50%'),
    width: wp('90%'),
    alignContent: 'center',
  },
  buttonContainer: {
    height: hp('40%'),
    width: wp('40%'),
    alignContent: 'center',
    justifyContent: 'center',
  },
});
