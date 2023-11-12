/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Alarm, {removeAlarm, scheduleAlarm, updateAlarm} from '../alarm';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import {globalStyles} from '../global';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const [mode, setMode] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (route.params && route.params.alarm) {
      setAlarm(new Alarm(route.params.alarm));
      setMode('EDIT');
      console.log('alarm is on create :', route.params.alarm);
      if (route.params.alarm.uri != null) {
        setImageUri(route.params.alarm.uri);
      }
    } else {
      setAlarm(new Alarm());
      setMode('CREATE');
    }

    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
  }, []);

  function update(updates) {
    const a = Object.assign({}, alarm);
    for (let u of updates) {
      a[u[0]] = u[1];
    }
    setAlarm(a);
  }

  async function onSave(obj) {
    if (mode === 'EDIT') {
      alarm.active = true;
      await updateAlarm(alarm);
    }
    if (mode === 'CREATE') {
      await scheduleAlarm(alarm);
      console.log('created alarm: ', JSON.stringify(alarm));
    }
    navigation.goBack();
  }

  async function onDelete() {
    await removeAlarm(alarm.uid);
    navigation.goBack();
  }

  async function takePhoto() {
    const result = await launchCamera({mediaType: 'photo'});
    if (result) {
      setImageUri(result.assets[0].uri);
      console.log('result', result);
      console.log('uri', result.assets[0].uri);
      console.log('imageUri', imageUri);
      await savePhotoToHiddenFolder(result.assets[0].originalPath);
    }
  }

  const createTwoButtonAlert = () =>
    Alert.alert(
      `Use an image of your medication`,
      'Choose an option to proceed',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Pick Photo From Gallery',
          onPress: () => choosePhoto(),
        },
        {text: 'Take Photo Using Camera', onPress: () => takePhoto()},
      ],
    );

  async function choosePhoto() {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result) {
      setImageUri(result.assets[0].uri);
      console.log('result', result);
      console.log('uri', result.assets[0].uri);
      console.log('imageUri', imageUri);
      await savePhotoToHiddenFolder(result.assets[0].uri);
    }
  }

  const savePhotoToHiddenFolder = async photoUri => {
    try {
      // Create a hidden directory in your app's documents folder
      const hiddenDirPath = `${RNFS.DocumentDirectoryPath}/.hidden_photos`;
      await RNFS.mkdir(hiddenDirPath);

      // Get the photo's filename from the URI
      const photoFileName = photoUri.substring(photoUri.lastIndexOf('/') + 1);

      // Construct the destination path for the hidden photo
      const destinationPath = `${hiddenDirPath}/${photoFileName}`;

      // Move the photo from its current location to the hidden folder
      await RNFS.moveFile(photoUri, destinationPath);

      // Optionally, you can delete the original file if you don't need it anymore

      // If you want to access the hidden photo in your app, you can use 'destinationPath'

      // If you want to hide it from the Camera Roll, you can use CameraRoll's 'deletePhotos' function
      // await CameraRoll.deletePhotos([photoUri]);

      console.log('Photo saved to hidden folder:', destinationPath);
      alarm.uri = 'file://' + destinationPath;
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  if (!alarm) {
    return <View />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.innerContainer, styles.container]}>
        <TouchableOpacity onPress={createTwoButtonAlert}>
          {!isKeyboardVisible && (
            <Image
              source={
                imageUri
                  ? {uri: imageUri}
                  : require('../assets/DefaultImage.png')
              }
              style={{width: wp('70%'), height: hp('40%')}}
              onError={error => {
                console.log(error);
              }}
            />
          )}
        </TouchableOpacity>
        <View styles={styles.inputsContainer}>
          <TextInput
            description={'Name of Medication'}
            style={styles.textInput}
            onChangeText={v => {
              update([['title', v]]);
            }}
            value={alarm.title ?? alarm.title}
            placeholder={'Name of Medication'}
          />
          <TextInput
            description={'Description'}
            style={styles.textInput}
            onChangeText={v => update([['description', v]])}
            value={alarm.description ?? alarm.description}
            placeholder={'Write a description to show what you are taking'}
          />
        </View>
        {!isKeyboardVisible && (
          <View style={styles.buttonContainer}>
            {mode === 'EDIT' && <Button onPress={onDelete} title={'Delete'} />}
            {mode === 'EDIT' && (
              <Button fill={true} onPress={onSave} title={'Save'} />
            )}
            <Button
              fill={true}
              onPress={() => {
                setAlarm(alarm);
                if (alarm.title.trim() !== '') {
                  navigation.navigate('Edit-2', {alarm: alarm, mode: mode});
                } else {
                  alert('Please enter a name for your medication');
                }
              }}
              title={'NEXT'}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  inputsContainer: {
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
