import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Alarm, {scheduleAlarm, updateAlarm} from '../alarm';
import Button from '../components/Button';
import Tp from '../components/TimePicker';
// import TimePicker from '../components/timePicker';

export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const [mode, setMode] = useState(null);
  const [tempTimes, setTempTimes] = useState([]);

  useEffect(() => {
    if (route.params && route.params.alarm) {
      setAlarm(route.params.alarm);
      setMode(route.params.mode);
      console.log('alarm in edit-4 :', route.params.alarm);
      console.log('mode in edit-4:', route.params.mode);
      navigation.setOptions({
        title: route.params.mode,
      });
      const times = getHowManyTimesNum(route.params.alarm.many);
      setTempTimes(
        generateAlarmTimes(
          route.params.alarm.initialHour,
          route.params.alarm.initialMinute,
          times,
        ),
      );
    } else {
      setAlarm(new Alarm());
      setMode('CREATE');
    }
  }, []);

  function getNextTimeTimeStamp(hour, minute) {
    console.log('hour passed to the function: ', hour);
    console.log('minute passed to the function: ', minute);
    const now = new Date();
    const nextTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
    );

    console.log('next time: ', nextTime.getTime(), ' now: ', now.getTime());
    if (nextTime.getTime() <= now.getTime()) {
      console.log('next time is in the past');
      // If the specified time has already passed today, add 1 day (24 hours)
      nextTime.setDate(nextTime.getDate() + 1);
    } else {
      console.log('next time is in the future');
    }

    return Math.floor(nextTime.getTime() / 1000);
  }

  function generateAlarmTimes(initialHour, initialMinute, numRings) {
    const alarmTimes = [];
    for (let i = 0; i < numRings; i++) {
      const time = new Date();
      time.setHours(initialHour + Math.floor((i * 24) / numRings));
      time.setMinutes(
        initialMinute + Math.floor((((i * 24) / numRings) % 1) * 60),
      );
      alarmTimes.push({hour: time.getHours(), minutes: time.getMinutes()});
    }
    return alarmTimes;
  }

  async function update() {
    const newTimes = [];

    for (let i = 0; i < tempTimes.length; i++) {
      console.log(`this tempTimes from button ${JSON.stringify(tempTimes)}`);
      newTimes.push(
        getNextTimeTimeStamp(tempTimes[i].hour, tempTimes[i].minutes),
      );
    }

    const updates = [['times', newTimes]];

    const a = Object.assign({}, alarm);
    for (let u of updates) {
      a[u[0]] = u[1];
    }
    //setAlarm(a);

    console.log('updated alarm:  a ', JSON.stringify(a));
    if (mode === 'EDIT') {
      a.active = true;
      await updateAlarm(a);
    }
    if (mode === 'CREATE') {
      await scheduleAlarm(a);
      console.log('created alarm: a ', JSON.stringify(a));
    }
    navigation.navigate('Alarms');
  }
  function getHowManyTimesNum(many) {
    if (many == 'Once a day') {
      return 1;
    } else if (many == 'Twice a day') {
      return 2;
    } else if (many == 'Thrice a day') {
      return 3;
    } else {
      return 4;
    }
  }

  async function updateTimes() {
    const newTimes = [];

    for (let i = 0; i < tempTimes.length; i++) {
      newTimes.push(
        getNextTimeTimeStamp(tempTimes[i].hour, tempTimes[i].minutes),
      );
    }
    await update([['times', newTimes]]);
    console.log(
      'alarm times after updated in updateTimes()',
      JSON.stringify(alarm.times),
    );

    console.log(
      `this tempTimes from updateTimes() ${JSON.stringify(tempTimes)}`,
    );
  }
  async function onSave() {
    await updateTimes();

    if (mode === 'EDIT') {
      alarm.active = true;
      await updateAlarm(alarm);
    }
    if (mode === 'CREATE') {
      await scheduleAlarm(alarm);
      console.log('created alarm: ', JSON.stringify(alarm));
    }
    navigation.navigate('Alarms');
  }

  const zopr = () => {
    const newTimes = [];

    for (let i = 0; i < tempTimes.length; i++) {
      console.log(`this tempTimes from button ${JSON.stringify(tempTimes)}`);
      newTimes.push(
        getNextTimeTimeStamp(tempTimes[i].hour, tempTimes[i].minutes),
      );
    }
    update([['times', newTimes]]);
    console.log(JSON.stringify(alarm.times));
  };

  if (!alarm) {
    return <View />;
  }
  return (
    <View>
      {tempTimes.map((t, i) => (
        <Tp
          key={i}
          onChange={(h, m) => {
            tempTimes[i] = {hour: h, minutes: m};
            setTempTimes([...tempTimes]);
          }}
          hour={t.hour}
          minutes={t.minutes}
        />
      ))}

      <Button fill={true} onPress={update} title={'Save'} />
    </View>
  );
}
