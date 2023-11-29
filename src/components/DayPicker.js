/* eslint-disable prettier/prettier */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../global';
import {useTranslation} from 'react-i18next';

export default function ({activeDays = [], onChange = () => null}) {
  // NOTICE: days doesn't change if prop activeDays changes
  const [days, setDays] = useState(activeDays);
  function onDayChange(dayIndex) {
    let selectedBtn = getSelected(days);
    selectedBtn[dayIndex] = !selectedBtn[dayIndex];
    const newDays = getDays(selectedBtn);
    setDays(newDays);
    onChange(newDays);
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {getSelected(days).map((isSelected, index) => (
          <Day
            key={index}
            isActive={isSelected}
            dayIndex={index}
            onUpdate={onDayChange}
          />
        ))}
      </View>
    </View>
  );
}

function Day({isActive, dayIndex, onUpdate}) {
  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={[
          isActive ? styles.selectedBtn : styles.unselectedBtn,
          styles.btnContainer,
        ]}
        onPress={() => onUpdate(dayIndex)}>
        <Text
          style={[
            styles.text,
            isActive ? styles.selectedText : styles.unselectedText,
          ]}>
          {getDay(dayIndex, t)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function getSelected(activeDays) {
  let selectedBtn = new Array(7).fill(false);
  for (let i = 0; i < activeDays.length; i++) {
    selectedBtn[activeDays[i]] = true;
  }
  return selectedBtn;
}

export function getDays(selectedBtn) {
  let activeDays = [];
  for (let i = 0; i < selectedBtn.length; i++) {
    if (selectedBtn[i]) activeDays.push(i);
  }
  return activeDays;
}

function getDay(number, t) {
  let weekdays = [
    t('Sun'),
    t('Mon'),
    t('Tue'),
    t('Wed'),
    t('Thu'),
    t('Fri'),
    t('Sat'),
  ];
  return weekdays[number];
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 10,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  btnContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBtn: {
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: colors.BLUE,
  },
  unselectedBtn: {
    color: 'black',
    borderWidth: 1,
    borderColor: colors.GREY,
  },
  text: {
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: 'black',
  },
});
