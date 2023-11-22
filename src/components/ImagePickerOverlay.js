import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

export default function ({
  isVisible,
  onClose,
  optionOneText,
  onOption1Press,
  optionTwoText,
  onOption2Press,
}) {
  const {t, i18n} = useTranslation();
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <Text style={{marginBottom: 20}}>{t('Choose an option')}</Text>
          <TouchableOpacity
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: 'lightblue',
              borderRadius: 5,
            }}
            onPress={onOption1Press}>
            <Text>{optionOneText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{padding: 10, backgroundColor: 'lightblue', borderRadius: 5}}
            onPress={onOption2Press}>
            <Text>{optionTwoText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 10}} onPress={onClose}>
            <Text style={{color: 'blue'}}>{t('Cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
