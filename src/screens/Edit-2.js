import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Alarm from '../alarm';
import DayPicker from '../components/DayPicker';
import XDayPicker from '../components/XDayPicker';
import Button from '../components/Button';
import {colors, globalStyles} from '../global';
import SelectDropdown from 'react-native-select-dropdown';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const [mode, setMode] = useState(null);
  const [isDaysPickerVisible, setDaysPickerVisible] = useState(false);
  const [isXDayPickerVisible, setXDayPickerVisible] = useState(false);

  const often = [
    'Every Day',
    'Every Other Day',
    'Specific Days of the week',
    'Every X Days',
  ];
  const howManyTimes = [
    'Once a day',
    'Twice a day',
    'Thrice a day',
    'Four times a day',
  ];

  useEffect(() => {
    if (route.params && route.params.alarm) {
      setAlarm(route.params.alarm);
      setMode(route.params.mode);
      console.log('alarm in edit-2 :', route.params.alarm);
      console.log('mode in edit-2 :', route.params.mode);
      navigation.setOptions({
        title: route.params.mode,
      });
      if (route.params.alarm.often === 2) {
        setDaysPickerVisible(true);
      }
      if (route.params.alarm.often === 3) {
        setXDayPickerVisible(true);
      }
    } else {
      setAlarm(new Alarm());
      setMode('CREATE');
    }
  }, []);

  function update(updates) {
    const a = Object.assign({}, alarm);
    for (let u of updates) {
      a[u[0]] = u[1];
    }
    setAlarm(a);
    console.log('updated alarm: ', JSON.stringify(a));
  }

  if (!alarm) {
    return <View />;
  }
  return (
    <View style={globalStyles.periodicSelectContainer}>
      <View style={styles.oftenContainer}>
        <Text style={globalStyles.title}>How often</Text>
        <SelectDropdown
          buttonStyle={{
            width: wp('90%'),
            height: hp('10%'),
            backgroundColor: colors.GREY,
            borderRadius: 10,
          }}
          defaultValue={often[alarm.often]}
          data={often}
          onSelect={(selectedItem, index) => {
            update([['often', index]]);
            if (selectedItem === 'Specific Days of the week') {
              setDaysPickerVisible(true);
            } else {
              setDaysPickerVisible(false);
            }
            if (selectedItem === 'Every X Days') {
              setXDayPickerVisible(true);
            } else {
              setXDayPickerVisible(false);
            }
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return (
              <Text style={{color: colors.SLATE_BLUE}}>{selectedItem}</Text>
            );
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
        {isDaysPickerVisible && (
          <DayPicker
            activeDays={alarm.days}
            onChange={newDays => update([['days', newDays]])}
          />
        )}
        {isXDayPickerVisible && (
          <XDayPicker
            defaultValue={alarm.often}
            minValue={3}
            maxValue={32}
            onChange={XDays => update([['often', XDays]])}
          />
        )}
      </View>

      <View style={styles.manyContainer}>
        <Text style={globalStyles.title}>How Many Times</Text>

        <SelectDropdown
          buttonStyle={{
            width: wp('90%'),
            height: hp('10%'),
            backgroundColor: colors.GREY,
            borderRadius: 10,
          }}
          defaultValue={alarm.many}
          data={howManyTimes}
          onSelect={(selectedItem, index) => {
            update([['many', selectedItem]]);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return (
              <Text style={{color: colors.SLATE_BLUE}}>{selectedItem}</Text>
            );
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
      </View>
      <Button
        fill={true}
        onPress={() =>
          navigation.navigate('Edit-3', {alarm: alarm, mode: mode})
        }
        title={'NEXT'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  oftenContainer: {
    height: hp('40%'),
    width: wp('90%'),
    alignContent: 'center',
  },
  manyContainer: {
    height: hp('30%'),
    width: wp('90%'),
  },
});
