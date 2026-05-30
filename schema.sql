-- FocusFlow Schema
-- Excluir tabelas existentes se necessário
DROP TABLE IF EXISTS public.tasks;

-- Tabela de Tasks
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'Pendente',
  priority TEXT NOT NULL DEFAULT 'Média',
  estimated_time INTEGER, -- Armazenado em minutos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurando índice para performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);

-- Ativando Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies (Políticas de Segurança)
-- Usuário só pode visualizar suas próprias tarefas
CREATE POLICY "Usuários podem visualizar suas próprias tarefas"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

-- Usuário pode inserir tarefas para si mesmo
CREATE POLICY "Usuários podem inserir suas próprias tarefas"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuário pode atualizar suas próprias tarefas
CREATE POLICY "Usuários podem atualizar suas próprias tarefas"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuário pode deletar suas próprias tarefas
CREATE POLICY "Usuários podem deletar suas próprias tarefas"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);
