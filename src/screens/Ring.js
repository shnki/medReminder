/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {getAlarm, snoozeAlarm, stopAlarm} from '../alarm';
import Button from '../components/Button';
import {colors, globalStyles} from '../global';

import {} from 'react-native';

export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const nowHour = new Date().getHours();
  const nowMinutes = new Date().getMinutes();

  useEffect(() => {
    const alarmUid = route.params.alarmUid;
    (async function () {
      const myAlarm = await getAlarm(alarmUid);
      console.log('myAlarm is ', JSON.stringify(myAlarm));
      setAlarm(myAlarm);
    })();
  }, []);

  if (!alarm) {
    return <View />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.innerContainer, styles.container]}>
        <View style={styles.textContainer}>
          <Text style={styles.clockText}>
            {nowHour} : {nowMinutes}
          </Text>
          <Text style={styles.title}>{alarm.title}</Text>
          <Image
            source={{uri: alarm.uri}}
            style={{width: 200, height: 200}}
            onError={error => {
              console.log(error);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={'Snooze'}
            onPress={async () => {
              await snoozeAlarm();
              navigation.goBack();
            }}
          />
          <Button
            title={'Stop'}
            onPress={async () => {
              await stopAlarm();
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  clockText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.GREY,
  },
});
