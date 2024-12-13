import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBoards } from '../context/BoardsContext';
import { BoardModal } from '../components/BoardModal';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  const { boards, addBoard, deleteBoard, editBoard } = useBoards();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleAddBoard = () => {
    setSelectedBoard(null);
    toggleModal();
  };

  const handleEditBoard = (board: any) => {
    setSelectedBoard(board);
    toggleModal();
  };

  const handleSubmit = (name: string) => {
    if (selectedBoard) {
      editBoard(selectedBoard.id, name);
    } else {
      addBoard(name);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#d1d1d1', '#2472fc']}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.title}>Ваші дошки</Text>

      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.boardItem}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('Board', { boardId: item.id })}
            >
              <Text style={styles.boardName}>{item.name}</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditBoard(item)}>
                <Icon name="edit" size={24} color="blue" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteBoard(item.id)}>
                <Icon name="delete" size={24} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Додайте першу дошку!</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddBoard}
      >
        <Text style={styles.addButtonText}>Додати дошку</Text>
      </TouchableOpacity>

      <BoardModal
        visible={isModalVisible}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        initialName={selectedBoard?.name || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boardItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boardName: {
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
    fontSize: 16,
  },
});
