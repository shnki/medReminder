/* eslint-disable prettier/prettier */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../global';

export default function CustomButton({onPress, title, fill = false}) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        fill ? styles.fillContainer : styles.normalContainer,
      ]}
      onPress={onPress}
      underlayColor="#fff">
      <View style={styles.buttonWrapper}>
        <Text
          style={[
            styles.buttonText,
            fill ? styles.fillText : styles.normalText,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    borderColor: colors.SLATE_BLUE,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillContainer: {
    backgroundColor: colors.GREY,
  },
  normalContainer: {
    backgroundColor: 'transparent',
  },
  buttonWrapper: {
    textAlign: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  fillText: {
    color: colors.BLACK,
  },
  normalText: {
    color: colors.BLUE,
  },
});
