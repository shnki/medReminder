/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {Text, View} from 'react-native';
import {getAlarmState, getAllAlarms, disableAlarm, enableAlarm} from '../alarm';
import AlarmView from '../components/AlarmView';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../global';
import {ScrollView} from 'react-native-gesture-handler';

export default function ({navigation}) {
  const [alarms, setAlarms] = useState(null);
  const [scheduler, setScheduler] = useState(null);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      setAlarms(await getAllAlarms());
      setScheduler(setInterval(fetchState, 10000));
    });
    navigation.addListener('blur', async () => {
      clearInterval(scheduler);
    });
    fetchState();
  }, []);

  async function fetchState() {
    const alarmUid = await getAlarmState();
    if (alarmUid) {
      navigation.navigate('Ring', {alarmUid});
    }
  }

  return (
    <View>
      <View>
        {alarms && alarms.length === 0 && <Text>No alarms</Text>}
        <ScrollView>
          {alarms &&
            alarms.map(a => (
              <AlarmView
                times={a.times}
                key={a.uid}
                uid={a.uid}
                onChange={async active => {
                  if (active) {
                    await enableAlarm(a.uid);
                  } else {
                    await disableAlarm(a.uid);
                  }
                }}
                onPress={() => navigation.navigate('Edit', {alarm: a})}
                title={a.title}
                hour={a.hour}
                minutes={a.minutes}
                days={a.days}
                isActive={a.active}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
}
