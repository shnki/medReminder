import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';

export default ({hour, minutes, onChange = () => null}) => {
  const d = new Date();
  d.setHours(hour);
  d.setMinutes(minutes);
  const [date, setDate] = useState(d);
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setOpen(true)}>
        <Text style={styles.clockText}>
          {date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:
          {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
        </Text>
      </TouchableOpacity>
      <DatePicker
        theme="light"
        modal
        open={open}
        date={date}
        mode="time"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          onChange(date.getHours(), date.getMinutes());
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    color: 'black',
    fontSize: 70,
    fontFamily: 'DS-DIGIT',
  },
});
