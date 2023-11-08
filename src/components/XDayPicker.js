import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default function ({minValue, maxValue, defaultValue, onChange}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const onValueChange = value => {
    setSelectedValue(value);
    onChange(value);
  };

  const renderPickerItems = () => {
    const items = [];
    for (let i = minValue; i <= maxValue; i++) {
      items.push(<Picker.Item label={i.toString()} value={i} key={i} />);
    }
    return items;
  };

  return (
    <View style={styles.container}>
      <Text>Every</Text>
      <Picker
        style={{width: 100, height: 150}}
        selectedValue={selectedValue}
        onValueChange={onValueChange}>
        {renderPickerItems()}
      </Picker>
      <Text>days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
