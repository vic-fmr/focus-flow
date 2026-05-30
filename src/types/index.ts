export type TaskStatus = 'Pendente' | 'Em andamento' | 'Concluído';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_time: number | null; // in minutes
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
