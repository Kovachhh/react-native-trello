import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
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
      title: title ? '' : 'Назва завдання обов\'язкова.',
      description: description ? '' : 'Опис обов\'язковий.',
      expiredDate: expiredDate ? '' : 'Дата закінчення обов\'язкова.',
      assignee: assignee ? '' : 'Виконавець обов\'язковий.',
      author: author ? '' : 'Автор обов\'язковий.',
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
    if (selectedDate) {
      setExpiredDate(selectedDate);
      setErrors({ ...errors, expiredDate: '' });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Створити завдання' : 'Редагувати завдання'}
          </Text>

          <Text style={styles.label}>Назва завдання</Text>
          <TextInput
            style={[styles.input, errors.title ? styles.inputError : null]}
            placeholder="Назва завдання"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors({ ...errors, title: '' });
            }}
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

          {mode === 'edit' && (
            <>
              <Text style={styles.label}>Колонка</Text>
              <CustomSelector
                options={columns.map((item) => ({ label: item.name, value: item.id }))}
                selectedIndex={columns.findIndex((item) => item.id === columnId)}
                onSelect={setSelectedColumn}
              />
            </>
          )}

          <Text style={styles.label}>Опис</Text>
          <TextInput
            style={[styles.input, errors.description ? styles.inputError : null]}
            placeholder="Опис"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors({ ...errors, description: '' });
            }}
            multiline
            maxLength={2000}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

          <Text style={styles.label}>Дата закінчення</Text>
          <View>
            <DateTimePicker
              value={expiredDate || new Date()}
              mode="date"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          </View>
          {errors.expiredDate ? <Text style={styles.errorText}>{errors.expiredDate}</Text> : null}

          <Text style={styles.label}>Виконавець</Text>
          <TextInput
            style={[styles.input, errors.assignee ? styles.inputError : null]}
            placeholder="Виконавець"
            value={assignee}
            onChangeText={(text) => {
              setAssignee(text);
              setErrors({ ...errors, assignee: '' });
            }}
          />
          {errors.assignee ? <Text style={styles.errorText}>{errors.assignee}</Text> : null}

          <Text style={styles.label}>Автор</Text>
          <TextInput
            style={[styles.input, errors.author ? styles.inputError : null]}
            placeholder="Автор"
            value={author}
            onChangeText={(text) => {
              setAuthor(text);
              setErrors({ ...errors, author: '' });
            }}
          />
          {errors.author ? <Text style={styles.errorText}>{errors.author}</Text> : null}

          <View style={styles.actionButtons}>
            <Button 
              title="Закрити" 
              onPress={() => {
                clearFields();
                onClose();
              }} 
              color="red" />
            <Button title="Зберегти" onPress={handleSave} />
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
