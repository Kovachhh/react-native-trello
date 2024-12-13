import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Board } from '../types/Board';
import { Column } from '../types/Column';
import { Card } from '../types/Card';

type BoardsContextType = {
  boards: Board[];
  addBoard: (name: string) => void;
  editBoard: (boardId: string, newName: string) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardColumns: (boardId: string, updatedColumns: Column[]) => void;
  addColumn: (boardId: string, columnName: string, color: string) => void;
  editColumn: (boardId: string, columnId: string, newName: string, newColor: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addCard: (boardId: string,
    columnId: string,
    title: string,
    description: string,
    expiredDate: string,
    assignee: string,
    author: string) => void;
  editCard: (boardId: string, columnId: string, cardId: string, updatedCard: Omit<Card, 'id' | 'createdDate'>) => void;
  deleteCard: (boardId: string, columnId: string, cardId: string) => void;
  moveCard: (boardId: string, fromColumnId: string, toColumnId: string, cardId: string) => void
  reorderCards: (boardId: string, columnId: string, reorderedCards: Card[]) => void
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const BoardsProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>([]);

  const addBoard = (name: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      columns: [
        { id: '1', name: 'To Do', color: '#FFD700', cards: [] },
        { id: '2', name: 'In Progress', color: '#87CEEB', cards: [] },
        { id: '3', name: 'Done', color: '#32CD32', cards: [] },
      ],
    };
    setBoards([...boards, newBoard]);
  };

  const editBoard = (boardId: string, newName: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, name: newName } : board
      )
    );
  };
  const deleteBoard = (boardId: string) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
  };


  const addColumn = (boardId: string, columnName: string, color: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: [...board.columns, { id: Date.now().toString(), name: columnName, color, cards: [] }],
            }
          : board
      )
    );
  };

  const deleteColumn = (boardId: string, columnId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? { ...board, columns: board.columns.filter((column) => column.id !== columnId) }
          : board
      )
    );
  };

  const editColumn = (boardId: string, columnId: string, newName: string, newColor: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId ? { ...column, name: newName, color: newColor } : column
              ),
            }
          : board
      )
    );
  };

  const updateBoardColumns = (boardId: string, updatedColumns: Column[]) => {
    setBoards((prevBoards) => {
      return prevBoards.map((board) =>
        board.id === boardId ? { ...board, columns: updatedColumns } : board
      );
    });
  };


  const addCard = (
    boardId: string,
    columnId: string,
    title: string,
    description: string,
    expiredDate: string,
    assignee: string,
    author: string
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: [
                        ...column.cards,
                        {
                          id: Date.now().toString(),
                          title,
                          createdDate: new Date().toISOString(),
                          expiredDate,
                          description,
                          assignee,
                          author,
                        },
                      ],
                    }
                  : column
              ),
            }
          : board
      )
    );
  };
  
  const editCard = (boardId: string, columnId: string, cardId: string, updatedCard: Omit<Card, 'id' | 'createdDate'>) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId ? { ...card, ...updatedCard } : card
                      ),
                    }
                  : column
              ),
            }
          : board
    )
  );
  };
  
  const deleteCard = (boardId: string, columnId: string, cardId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.filter((card) => card.id !== cardId),
                    }
                  : column
              ),
            }
          : board
      )
    );
  }

  const moveCard = (
    boardId: string,
    fromColumnId: string,
    toColumnId: string,
    cardId: string
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id !== boardId) return board;
  
        const fromColumn = board.columns.find((col) => col.id === fromColumnId);
        const toColumn = board.columns.find((col) => col.id === toColumnId);
  
        if (!fromColumn || !toColumn) return board;
  
        const cardToMove = fromColumn.cards.find((card) => card.id === cardId);
        if (!cardToMove) return board;
  
        return {
          ...board,
          columns: board.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                cards: col.cards.filter((card) => card.id !== cardId),
              };
            }

            if (col.id === toColumnId) {
              return {
                ...col,
                cards: [...col.cards, cardToMove],
              };
            }

            return col;
          }),
        };
      })
    );
  };

  const reorderCards = (boardId: string, columnId: string, reorderedCards: Card[]) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? { ...column, cards: reorderedCards }
                  : column
              ),
            }
          : board
      )
    );
  }
  
  

  return (
    <BoardsContext.Provider
  value={{
    boards,
    addBoard,
    editBoard,
    deleteBoard,
    updateBoardColumns,
    addColumn,
    editColumn,
    deleteColumn,
    addCard,
    editCard,
    deleteCard,
    moveCard,
    reorderCards
  }}
>
  {children}
</BoardsContext.Provider>
  );
};

export const useBoards = () => {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error('useBoards must be used within a BoardsProvider');
  }
  return context;
};
