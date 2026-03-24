export type TaskEntry = {
  text: string;
  completed: boolean;
};

export type Panel = {
  id: string;
  title: string;
  icon: string;
  color: string;
  tasks: TaskEntry[];
};
