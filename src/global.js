/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';

export const colors = {
  GREY: '#D9D9D9',
  BLUE: '#1992fe',
  BLACK: '#000000',
  SLATE_BLUE: '#804FCF',
};

export const globalStyles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerContainer: {
    width: '90%',
    height: '90%',
    display: 'flex',
    alignItems: 'center',
  },

  alarmsContainer: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.BLACK,
  },
  periodicSelectContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  initialTimeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
});
