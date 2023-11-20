/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
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
import ImagePickerOverlay from '../components/ImagePickerOverlay';

export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const [mode, setMode] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    let keyboardDidShowListener;
    let keyboardDidHideListener;
    if (route.params && route.params.alarm) {
      setAlarm(new Alarm(route.params.alarm));
      setMode('EDIT');
      navigation.setOptions({title: 'EDIT'});
      console.log('alarm is on create :', route.params.alarm);
      if (route.params.alarm.uri != null) {
        setImageUri(route.params.alarm.uri);
      }
    } else {
      setAlarm(new Alarm());
      setMode('CREATE');
      navigation.setOptions({title: 'CREATE'});
    }

    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleOption1 = () => {
    choosePhoto();
    setShowOverlay(false);
  };

  const handleOption2 = () => {
    takePhoto();
    setShowOverlay(false);
  };

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
    if (result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      await savePhotoToHiddenFolder(result.assets[0].originalPath, photoUri);
    }
  }

  async function choosePhoto() {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      await savePhotoToHiddenFolder(result.assets[0].uri, photoUri);
    }
  }

  const savePhotoToHiddenFolder = async (photoUri, actualUri) => {
    try {
      const hiddenDirPath = `${RNFS.DocumentDirectoryPath}/.hidden_photos`;
      await RNFS.mkdir(hiddenDirPath);
      const photoFileName = photoUri.substring(photoUri.lastIndexOf('/') + 1);
      const destinationPath = `${hiddenDirPath}/${photoFileName}`;
      await RNFS.moveFile(actualUri, destinationPath);
      setImageUri('file://' + destinationPath); // Update imageUri directly here

      const updatedAlarm = {...alarm, uri: 'file://' + destinationPath};
      setAlarm(updatedAlarm);
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  if (!alarm) {
    return <View />;
  }

  return (
    <View style={globalStyles.container}>
      <ImagePickerOverlay
        isVisible={showOverlay}
        onClose={() => setShowOverlay(false)}
        onOption1Press={handleOption1}
        onOption2Press={handleOption2}
        optionOneText={'Pick Photo From Gallery'}
        optionTwoText={'Take Photo Using Camera'}
      />
      <View style={[globalStyles.innerContainer, styles.container]}>
        <TouchableOpacity onPress={() => setShowOverlay(true)}>
          {!isKeyboardVisible && imageUri && (
            <Image
              source={{uri: imageUri}}
              style={{width: wp('70%'), height: hp('40%')}}
              onError={error => {
                console.log(error);
              }}
            />
          )}
          {!isKeyboardVisible && !imageUri && (
            <Image
              source={require('../assets/DefaultImage.png')}
              style={{width: wp('70%'), height: hp('40%')}}
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
