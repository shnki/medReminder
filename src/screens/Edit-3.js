import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Alarm from '../alarm';
import Tp from '../components/TimePicker';
import Button from '../components/Button';
// import TimePicker from '../components/TimePicker';
import {colors, globalStyles} from '../global';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

export default function ({route, navigation}) {
  const {t, i18n} = useTranslation();

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
      if (route.params.mode === 'EDIT') {
        navigation.setOptions({title: t('Edit reminder')});
      }
      if (route.params.mode === 'CREATE') {
        navigation.setOptions({title: t('Add Reminder')});
      }
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
        <Text style={globalStyles.title}>{t('When you want to start ?')}</Text>
        <Tp
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
          title={t('NEXT')}
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
