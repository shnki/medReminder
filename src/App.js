/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import Home from './screens/Alarms';
import Settings from './screens/Edit';
import Ring from './screens/Ring';
import Settings2 from './screens/Edit-2';
import Settings3 from './screens/Edit-3';
import Settings4 from './screens/Edit-4';
import rtlTransition from './navConfig';

const Stack = createStackNavigator();

export default function () {
  const {t, i18n} = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Alarms"
          component={Home}
          options={params => ({
            ...headerStyles,
            title: t('Reminders'),
            headerRight: () => (
              <AddButton
                title={'+ '}
                onPress={() => params.navigation.navigate('Edit')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Edit"
          component={Settings}
          options={{
            ...headerStyles,
            title: 'Alarm',
          }}
        />

        <Stack.Screen
          name="Edit-2"
          component={Settings2}
          options={{
            ...headerStyles,
            title: 'Alarm',
            cardStyleInterpolator: rtlTransition.cardStyleInterpolator,
          }}
        />

        <Stack.Screen
          name="Edit-3"
          component={Settings3}
          options={{
            ...headerStyles,
            title: 'Alarm',
            cardStyleInterpolator: rtlTransition.cardStyleInterpolator,
          }}
        />

        <Stack.Screen
          name="Edit-4"
          component={Settings4}
          options={{
            ...headerStyles,
            title: 'Alarm',
            cardStyleInterpolator: rtlTransition.cardStyleInterpolator,
          }}
        />

        <Stack.Screen
          name="Ring"
          component={Ring}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AddButton({title, onPress}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      underlayColor="#fff">
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export const headerStyles = {
  headerStyle: {
    elevation: 0,
  },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
  },
});
