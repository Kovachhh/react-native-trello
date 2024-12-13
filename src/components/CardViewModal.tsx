import React from 'react';
import { Modal, View, Button, Text, StyleSheet } from 'react-native';
import { Card } from '../types/Card';

type CardViewModalProps = {
  visible: boolean;
  onClose: () => void;
  card: Card; 
};

export const CardViewModal: React.FC<CardViewModalProps> = ({
  visible,
  onClose,
  card,
}) => {

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Перегляд завдання
          </Text>

          <Text style={styles.label}>Назва завдання</Text>
          <Text style={styles.value}>{card.title}</Text>

          <Text style={styles.label}>Опис</Text>
          <Text style={styles.value}>{card.description}</Text>

          <Text style={styles.label}>Дата закінчення</Text>
          <Text style={styles.value}>{new Date(card.expiredDate).toLocaleString()}</Text>

          <Text style={styles.label}>Виконавець</Text>
          <Text style={styles.value}>{card.assignee}</Text>

          <Text style={styles.label}>Автор</Text>
          <Text style={styles.value}>{card.author}</Text>

          <Text style={styles.label}>Створено</Text>
          <Text style={styles.value}>{new Date(card.createdDate).toLocaleString()}</Text>

          <View style={styles.actionButtons}>
            <Button title="Ок" onPress={onClose} color="blue" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 10,
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
