import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type OptionType = {
  id: string;
  title: string;
  icon?: string;
};

interface SelectorProps {
  options: OptionType[];
  placeholder?: string;
  value?: any;
  onSelect: (selectedItem: OptionType | null, index: number) => void;
}

export const Selector: React.FC<SelectorProps> = ({ options, placeholder, value, onSelect }) => {
  return (
    <SelectDropdown
      data={options}
      defaultValue={value || null}
      onSelect={onSelect}
      renderButton={(selectedItem, isOpened) => (
        <View style={styles.dropdownButtonStyle}>
          {selectedItem && selectedItem.icon && (
            <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
          )}
          <Text style={styles.dropdownButtonTxtStyle}>
            {(selectedItem && selectedItem.title) || placeholder || ''}
          </Text>
          <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={{
            ...styles.dropdownItemStyle,
            ...(isSelected && { backgroundColor: '#D2D9DF' }),
          }}
        >
          {item.icon && (
            <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
          )}
          <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
