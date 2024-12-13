import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useBoards } from '../context/BoardsContext';

type ColumnModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  column?: { id: string; name: string; color: string } | null;
  boardId: string;
  onClose: () => void;
};

const availableColors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F1C40F',
  '#9B59B6',
  '#E74C3C',
  '#1ABC9C',
];

export const ColumnModal: React.FC<ColumnModalProps> = ({
  visible,
  mode,
  column,
  boardId,
  onClose,
}) => {
  const { addColumn, editColumn } = useBoards();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit') {
      setName(column?.name || '');
      setColor(column?.color || '#ffffff');
    } else {
      clearFields();
    }
  }, [mode, column]);

  const handleSave = () => {
    if (name.trim() === '') {
      setError('Назва колонки не може бути порожньою.');
      return;
    }
    setError(null);

    if (name && color) {
      if (mode === 'add') {
        addColumn(boardId, name, color);
      } else if (mode === 'edit' && column) {
        editColumn(boardId, column.id, name, color);
      }
      onClose();
    }

    clearFields();
    onClose();
  };

  const clearFields = () => {
    setName('');
    setColor('#ffffff');
    setError(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {mode === 'edit' ? 'Редагувати колонку' : 'Додати нову колонку'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Назва колонки"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.subtitle}>Виберіть колір:</Text>
          <View style={styles.colorPicker}>
            {availableColors.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: item,
                    borderWidth: color === item ? 2 : 0,
                    borderColor: color === item ? '#000' : 'transparent',
                  },
                ]}
                onPress={() => setColor(item)}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Скасувати</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Зберегти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
