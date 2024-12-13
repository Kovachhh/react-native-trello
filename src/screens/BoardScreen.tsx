import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { LinearGradient } from 'expo-linear-gradient';

import { useBoards } from '../context/BoardsContext';
import { CardModal } from '../components/CardModal';
import { ColumnModal } from '../components/ColumnModal';
import { CardViewModal } from '../components/CardViewModal';

export default function BoardScreen({ route }: any) {
  const { boardId } = route.params;
  const {
    boards,
    deleteColumn,
    reorderCards,
    deleteCard
  } = useBoards();
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<any>(null);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [viewingCard, setViewingCard] = useState<any>(null);

  const board = boards.find((b) => b.id === boardId);

  if (!board) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Дошка не знайдена</Text>
      </View>
    );
  }

  const handleAddColumn = () => {
    setEditingColumn(null);
    setIsCreatingColumn(true);
  };

  const handleEditColumn = (column: any) => {
    setEditingColumn(column);
  };

  const handleDeleteColumn = (columnId: string) => {
    Alert.alert(
      'Підтвердження',
      'Ви впевнені, що хочете видалити цю колонку?',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', onPress: () => deleteColumn(board.id, columnId), style: 'destructive' },
      ]
    );
  };

  const handleOpenCardCreatingModal = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreatingCard(true);
  };

  const handleEditCard = (card: any, columnId: string) => {
    setSelectedColumnId(columnId);
    setEditingCard(card);
  };

  const handleDeleteCard = (boardId: string, columnId: string, cardId: string) => {
    Alert.alert(
      'Підтвердження',
      'Ви впевнені, що хочете видалити цю картку?',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', onPress: () => deleteCard(boardId, columnId, cardId), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#d1d1d1', '#2472fc']}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.title}>{board.name}</Text>

      <ScrollView
        horizontal
        style={styles.columnsContainer}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {board.columns.map((column) => (
          <View style={{...styles.column, borderTopWidth: 3, borderTopColor: column.color}} key={column.id}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnName}>{column.name}</Text>
              <View style={styles.columnActions}>
                <TouchableOpacity onPress={() => handleEditColumn(column)}>
                  <Icon name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteColumn(column.id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>

            <DraggableFlatList
              data={column.cards}
              keyExtractor={(card) => card.id}
              renderItem={({ item, drag, isActive }: RenderItemParams<any>) => {
                if (!item) return null;
              
                return (
                  <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[styles.cardContainer, isActive && styles.activeCard]}
                    onPress={() => setViewingCard(item)}
                  >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                    <View style={styles.cardActions}>
                      <TouchableOpacity onPress={() => handleEditCard(item, column.id)}>
                        <Icon name="edit" size={20} color="blue" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteCard(boardId, column.id, item.id)}>
                        <Icon name="delete" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              }
              onDragEnd={({ data }) => reorderCards(board.id, column.id, data)}
            />

            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => handleOpenCardCreatingModal(column.id)}
            >
              <Text style={styles.addCardText}>+ Додати картку</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View>
        <TouchableOpacity style={styles.addColumnButton} onPress={handleAddColumn}>
          <Text style={styles.addColumnText}>+ Додати колонку</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      <CardModal
        mode='add'
        visible={isCreatingCard}
        onClose={() => setIsCreatingCard(false)}
        boardId={board.id}
        columnId={selectedColumnId!}
      />

      <CardModal
        mode='edit'
        visible={!!editingCard}
        onClose={() => setEditingCard(null)}
        boardId={board.id}
        columnId={selectedColumnId!}
        card={editingCard || {}}
      />

      <CardViewModal
        visible={!!viewingCard}
        onClose={() => setViewingCard(null)}
        card={viewingCard || {}}
      />

      <ColumnModal
        mode='add'
        visible={isCreatingColumn}
        onClose={() => setIsCreatingColumn(false)}
        boardId={board.id}
        column={editingColumn!}
      />

      <ColumnModal
        mode='edit'
        visible={!!editingColumn}
        onClose={() => setEditingColumn(null)}
        boardId={board.id}
        column={editingColumn!}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  columnsContainer: {
    flex: 1,
  },
  column: {
    width: 200,
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  columnActions: {
    flexDirection: 'row',
    gap: 8
  },
  addCardButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  addCardText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addColumnButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  addColumnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#d9d9d9'
  },
  activeCard: {
    backgroundColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
});
