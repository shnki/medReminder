/* eslint-disable prettier/prettier */
import React from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';
import {colors} from '../global';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ({onChangeText, value, description, placeholder}) {
  return (
    <View style={styles.container}>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    color: colors.BLACK,
    borderColor: colors.GREY,
    backgroundColor: colors.GREY,
    width: wp('80%'),
    fontWeight: 'bold',
  },
  descriptionContainer: {
    margin: 10,
    marginLeft: 0,
  },
  descriptionText: {
    fontWeight: 'bold',
    color: colors.BLACK,
  },
});
