/* eslint-disable prettier/prettier */
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native';

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
import {getHourFromTimestamp, getMinuteFromTimestamp} from '../utils';

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
  often,
  many,
}) {
  function m(arr) {
    let message = '';
    for (let i = 0; i < arr.length; i++) {
      message +=
        (getHourFromTimestamp(arr[i]) < 10
          ? '0' + getHourFromTimestamp(arr[i])
          : getHourFromTimestamp(arr[i])) +
        ':' +
        getMinuteFromTimestamp(arr[i]) +
        ' \n';
    }
    return message;
  }
  const createTwoButtonAlert = () =>
    Alert.alert(`${title} is set to ring on these times`, m(times), [
      {
        text: uid,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  const {width} = Dimensions.get('window');
  const editIconSize = width / 10;

  return (
    <TouchableOpacity onPress={createTwoButtonAlert} style={styles.container}>
      <View style={styles.leftInnerContainer}>
        <Text style={styles.clock}>{title}</Text>
        {times.map((t, i) => (
          <Text key={i}>{t}</Text>
        ))}

        <View style={styles.descContainer}>
          <Text>{getAlphabeticalDays(days)}</Text>
        </View>
      </View>
      <View style={styles.rightInnerContainer}>
        <Switch
          ios_backgroundColor={'black'}
          trackColor={{false: colors.GREY, true: colors.SLATE_BLUE}}
          value={isActive}
          onValueChange={onChange}
        />
        <Icon
          name="edit"
          size={editIconSize}
          onPress={() => onPress(uid)}
          color={colors.SLATE_BLUE}
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
    flexDirection: 'row-reverse',
    margin: 5,
    marginRight: 0,
    flex: 1,
    alignItems: 'center',
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
