import { Column } from "./Column";

export type Board = {
    id: string;
    name: string;
    columns: Column[];
  };