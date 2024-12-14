import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

type BoardModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
};

export const BoardModal = ({
  visible,
  onClose,
  onSubmit,
  initialName = '',
}: BoardModalProps) => {
  const [boardName, setBoardName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBoardName(initialName);
    setError(null);
  }, [initialName]);

  const handleSave = () => {
    if (boardName.trim()) {
      onSubmit(boardName.trim());
      setBoardName('');
      setError(null); 
      onClose();
    } else {
      setError('Name is required');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {initialName ? 'Edit board' : 'New board'}
            </Text>
            <TextInput
              style={[
                styles.input,
                error ? styles.inputError : null,
              ]}
              placeholder="Enter a name"
              value={boardName}
              onChangeText={(text) => {
                setBoardName(text);
                setError(null);
              }}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.actionButtons}>
              <Button title="Cancel" onPress={onClose} color="red" />
              <Button
                title={initialName ? 'Save' : 'Create'}
                onPress={handleSave}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
