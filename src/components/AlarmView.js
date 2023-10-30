/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {colors} from '../global';
import Button from '../components/Button';

export default function ({
  times,
  uid,
  title,
  hour,
  minutes,
  days,
  onPress,
  isActive,
  onChange,
}) {
  const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', uid, [
      {
        text: uid,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  return (
    <TouchableOpacity onPress={() => onPress(uid)} style={styles.container}>
      <View style={styles.leftInnerContainer}>
        <Text style={styles.clock}>{title}</Text>
        {times.map((t, i) => (
          <Text key={i}>{t}</Text>
        ))}

        <Button fill={true} onPress={createTwoButtonAlert} title={'Edit'} />
        <View style={styles.descContainer}>
          <Text>{getAlphabeticalDays(days)}</Text>
        </View>
      </View>
      <View style={styles.rightInnerContainer}>
        <Switch
          ios_backgroundColor={'black'}
          trackColor={{false: colors.GREY, true: colors.BLUE}}
          value={isActive}
          onValueChange={onChange}
        />
      </View>
    </TouchableOpacity>
  );
}

function getAlphabeticalDays(days) {
  let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let activeDays = [];
  for (let i = 0; i < days.length; i++) {
    activeDays.push(weekdays[parseInt(days[i])] + ' ');
  }
  return activeDays;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftInnerContainer: {
    margin: 5,
    flex: 1,
    alignItems: 'flex-start',
  },
  rightInnerContainer: {
    margin: 5,
    marginRight: 0,
    flex: 1,
    alignItems: 'flex-end',
  },
  descContainer: {
    flexDirection: 'row',
    color: 'grey',
  },
  clock: {
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 10,
  },
});
