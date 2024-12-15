import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useBoards } from '../context/BoardsContext';
import { CustomSelector } from './CustomSelector';
import { Card } from '../types/Card';

type CardModalProps = {
  visible: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  boardId: string;
  columnId: string;
  card?: Card;
};

export const CardModal = ({
  visible,
  onClose,
  mode,
  boardId,
  columnId,
  card,
}: CardModalProps) => {
  const { addCard, editCard, boards, moveCard } = useBoards();
  const columns = boards.find((item) => item.id === boardId)?.columns || [];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiredDate, setExpiredDate] = useState<Date | null>(null);
  const [assignee, setAssignee] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(columnId);

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    expiredDate: '',
    assignee: '',
    author: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && card) {
      setTitle(card.title);
      setDescription(card.description);
      setExpiredDate(card.expiredDate ? new Date(card.expiredDate) : null);
      setAssignee(card.assignee);
      setAuthor(card.author);
      setSelectedColumn(columnId);
    } else {
      clearFields();
      setSelectedColumn(columnId);
    }
  }, [mode, card, columnId]);

  const validateFields = () => {
    const newErrors = {
      title: title ? '' : 'Name is required',
      description: description ? '' : 'Description is required',
      expiredDate: expiredDate ? '' : 'Expiration date is required',
      assignee: assignee ? '' : 'Assignee is required',
      author: author ? '' : 'Author is required',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSave = () => {
    if (validateFields()) {
      const expiredDateISO = expiredDate?.toISOString() || '';
      if (mode === 'add') {
        addCard(boardId, columnId, title, description, expiredDateISO, assignee, author);
      } else if (mode === 'edit' && card) {
        const updatedCard = { title, description, expiredDate: expiredDateISO, assignee, author };
        editCard(boardId, selectedColumn, card.id, updatedCard);

        if (columnId !== selectedColumn) {
          moveCard(boardId, columnId, selectedColumn, card.id);
        }
      }
      onClose();
      clearFields();
    }
  };

  const clearFields = () => {
    setTitle('');
    setDescription('');
    setExpiredDate(null);
    setAssignee('');
    setAuthor('');
    setErrors({
      title: '',
      description: '',
      expiredDate: '',
      assignee: '',
      author: '',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setExpiredDate(selectedDate);
      setErrors({ ...errors, expiredDate: '' });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Add card' : 'Edit card'}
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.title ? styles.inputError : null]}
            placeholder="Enter a name"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors({ ...errors, title: '' });
            }}
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

          {mode === 'edit' && (
            <>
              <Text style={styles.label}>Column</Text>
              <CustomSelector
                options={columns.map((item) => ({ label: item.name, value: item.id }))}
                selectedIndex={columns.findIndex((item) => item.id === columnId)}
                onSelect={setSelectedColumn}
              />
            </>
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, errors.description ? styles.inputError : null]}
            placeholder="Enter a description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors({ ...errors, description: '' });
            }}
            multiline
            maxLength={2000}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

          <Text style={styles.label}>Expiration date</Text>
          <TouchableOpacity
            style={[styles.input, styles.datePicker]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formatDate(expiredDate)}</Text>
          </TouchableOpacity>
          {errors.expiredDate ? <Text style={styles.errorText}>{errors.expiredDate}</Text> : null}
          {showDatePicker && (
            <DateTimePicker
              value={expiredDate || new Date()}
              mode="date"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Assignee</Text>
          <TextInput
            style={[styles.input, errors.assignee ? styles.inputError : null]}
            placeholder="Enter an assignee"
            value={assignee}
            onChangeText={(text) => {
              setAssignee(text);
              setErrors({ ...errors, assignee: '' });
            }}
          />
          {errors.assignee ? <Text style={styles.errorText}>{errors.assignee}</Text> : null}

          <Text style={styles.label}>Author</Text>
          <TextInput
            style={[styles.input, errors.author ? styles.inputError : null]}
            placeholder="Enter an author"
            value={author}
            onChangeText={(text) => {
              setAuthor(text);
              setErrors({ ...errors, author: '' });
            }}
          />
          {errors.author ? <Text style={styles.errorText}>{errors.author}</Text> : null}

          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => {
                clearFields();
                onClose();
              }}
              color="red"
            />
            <Button title={mode === 'edit' ? 'Save' : 'Create'} onPress={handleSave} />
          </View>
        </View>
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  datePicker: {
    justifyContent: 'center',
    height: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
