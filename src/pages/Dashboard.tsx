import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskPriority, TaskStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Clock, CheckCircle2, Circle, ListTodo, X, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pendente');
  const [priority, setPriority] = useState<TaskPriority>('Média');
  const [estimatedTime, setEstimatedTime] = useState<number | ''>('');
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'Todas'>('Todas');

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data as Task[]);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      if (error?.code === 'PGRST205' || String(error?.message).includes('schema cache')) {
        alert('Tabela "tasks" não encontrada. Por favor, acesse o painel do Supabase e execute o arquivo schema.sql.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setStatus('Pendente');
    setPriority('Média');
    setEstimatedTime('');
    setEditingTask(null);
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category || '');
      setStatus(task.status);
      setPriority(task.priority);
      setEstimatedTime(task.estimated_time || '');
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const taskData = {
      user_id: user.id,
      title,
      description: description || null,
      category: category || null,
      status,
      priority,
      estimated_time: estimatedTime ? Number(estimatedTime) : null,
    };

    try {
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);
        if (error) throw error;
      }
      
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Erro ao salvar tarefa');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;
    
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'Concluído' ? 'Pendente' : 'Concluído';
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Stats
  const filteredTasks = tasks.filter(t => filterStatus === 'Todas' ? true : t.status === filterStatus);
  const completedTasks = tasks.filter(t => t.status === 'Concluído').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Concluído').length;
  const totalEstimatedMins = tasks.reduce((acc, t) => acc + (t.estimated_time || 0), 0);
  const displayHours = Math.floor(totalEstimatedMins / 60);
  const displayMins = totalEstimatedMins % 60;

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-5xl mx-auto h-full px-2">
      <header className="flex items-center justify-between pb-2 border-b border-zinc-800 pt-4">
        <h1 className="text-lg font-medium text-white">Workspace</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white text-xs font-bold py-2 px-4 hover:bg-primary-hover transition-all flex items-center gap-1.5 border border-primary-dark"
        >
          <Plus size={14} /> Nova Tarefa
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card p-5 rounded-2xl">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Total de Tarefas</p>
          <h2 className="text-3xl font-bold">{tasks.length}</h2>
        </div>
        <div className="stat-card p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Concluídas</p>
          <h2 className="text-3xl font-bold text-primary neon-glow">{completedTasks}</h2>
        </div>
        <div className="stat-card p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Pendentes</p>
          <h2 className="text-3xl font-bold">{pendingTasks}</h2>
        </div>
        <div className="stat-card p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Esforço Total</p>
          <h2 className="text-3xl font-bold">
            {displayHours}h <span className="text-xl text-zinc-400">{displayMins}m</span>
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={18} className="text-zinc-500 mr-2" />
        {(['Todas', 'Pendente', 'Em andamento', 'Concluído'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === f 
                ? 'bg-zinc-800 text-white border border-zinc-700' 
                : 'bg-surface text-zinc-400 hover:text-zinc-200 border border-surface-hover'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="flex-1 border border-zinc-800 bg-surface overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 pb-2 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400">Suas Tarefas</h3>
          <div className="flex gap-2">
            <span className="text-[10px] px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 hidden sm:block">Status</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhuma tarefa encontrada.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase">Tarefa</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase">Projeto</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase">Prioridade</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase text-right">Tempo Est.</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="task-row transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${task.status === 'Concluído' ? 'line-through text-zinc-500' : ''}`}>
                          {task.title}
                        </span>
                        {task.description && <span className="text-[10px] text-zinc-500 line-clamp-1">{task.description}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">{task.category || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                        task.priority === 'Alta' ? 'priority-high bg-red-500/10' :
                        task.priority === 'Média' ? 'priority-medium bg-amber-500/10' :
                        'priority-low bg-emerald-500/10'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs flex items-center gap-1.5 ${task.status === 'Concluído' ? 'text-primary' : ''}`}>
                        {task.status === 'Concluído' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Concluído
                          </>
                        ) : (
                          <>
                            <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'Em andamento' ? 'bg-blue-500' : 'bg-zinc-600'}`}></span>
                            {task.status}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-mono text-zinc-400">
                      {task.estimated_time ? `${task.estimated_time}m` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleToggleStatus(task)} className="p-1 text-zinc-400 hover:text-primary hover:bg-zinc-800 transition-colors">
                          <CheckCircle2 size={16} />
                        </button>
                        <button onClick={() => handleOpenModal(task)} className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-zinc-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Nova/Editar Tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-zinc-800 w-full max-w-lg p-6 shadow-[4px_4px_0px_rgba(59,130,246,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                  placeholder="Ex: Revisar documentação..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-600 resize-none"
                  placeholder="Detalhes da tarefa..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    placeholder="Trabalho, Pessoal..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Tempo Est. (min)</label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedTime}
                    onChange={e => setEstimatedTime(e.target.value)}
                    className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    placeholder="Ex: 30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as TaskStatus)}
                    className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-end pt-4 border-t border-surface-hover">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 bg-surface border border-surface-hover rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-zinc-950 bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-[0_0_8px_rgba(57,255,20,0.2)]"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
