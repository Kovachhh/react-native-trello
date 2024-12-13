import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';

type DropdownOption = {
  label: string;
  value: string;
};

interface CustomSelectorProps {
  options: DropdownOption[]; 
  selectedIndex: number;
  onSelect: (selectedValue: string) => void;
  placeholder?: string;
  dropdownStyle?: object;
  buttonStyle?: object;
  buttonTextStyle?: object;
}

export const CustomSelector: React.FC<CustomSelectorProps> = ({
  options,
  selectedIndex,
  onSelect,
  placeholder = 'Select an option',
  dropdownStyle,
  buttonStyle,
  buttonTextStyle,
}) => {
  return (
    <View style={styles.container}>
      <SelectDropdown
        data={options}
        defaultValueByIndex={selectedIndex}
        onSelect={(selectedItem, index) => {
          onSelect(selectedItem.value);
        }}
        renderButton={(selectedItem, isOpened) => (
          <View style={[styles.dropdownButton, buttonStyle]}>
            <Text style={[styles.dropdownButtonText, buttonTextStyle]}>
              {selectedItem ? selectedItem.label : placeholder}
            </Text>
            <Icon
              name="arrow-drop-down"
              size={20}
              color="black"
            />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={[
              styles.dropdownItem,
              isSelected && styles.selectedItem,
            ]}
          >
            <Text style={styles.dropdownItemText}>{item.label}</Text>
          </View>
        )}
        dropdownStyle={[styles.dropdown, dropdownStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  dropdownButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedValue: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
