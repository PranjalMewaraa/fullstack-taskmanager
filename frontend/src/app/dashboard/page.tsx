'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { TaskCard } from '@/components/task-card';
import { TaskFormModal } from '@/components/task-form-modal';
import { TasksToolbar } from '@/components/tasks-toolbar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { tasksApi } from '@/lib/api';
import { Task, TaskStatus } from '@/lib/types';

const LIMIT = 10;

type ModalState = {
  open: boolean;
  mode: 'create' | 'edit';
  task: Task | null;
};

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Request failed';
};

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'create', task: null });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: LIMIT,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: debouncedSearch || undefined,
    }),
    [debouncedSearch, page, statusFilter],
  );

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsFetching(true);
    try {
      const data = await tasksApi.list(queryParams);
      setTasks(data.items);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error(toErrorMessage(error));
    } finally {
      setIsFetching(false);
    }
  }, [isAuthenticated, queryParams, toast]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!authLoading && isAuthenticated) {
      fetchTasks();
    }
  }, [authLoading, fetchTasks, isAuthenticated, router]);

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    setBusyTaskId(taskId);
    try {
      await tasksApi.remove(taskId);
      toast.success('Task deleted');
      await fetchTasks();
    } catch (error) {
      toast.error(toErrorMessage(error));
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleToggle = async (taskId: string) => {
    setBusyTaskId(taskId);
    try {
      await tasksApi.toggle(taskId);
      toast.success('Task status updated');
      await fetchTasks();
    } catch (error) {
      toast.error(toErrorMessage(error));
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleSaveTask = async (payload: { title: string; description?: string }) => {
    setIsSaving(true);
    try {
      if (modal.mode === 'create') {
        await tasksApi.create(payload);
        toast.success('Task created');
      } else if (modal.task) {
        await tasksApi.update(modal.task.id, payload);
        toast.success('Task updated');
      }

      setModal({ open: false, mode: 'create', task: null });
      await fetchTasks();
    } catch (error) {
      throw new Error(toErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
  };

  if (authLoading) {
    return <main className="min-h-screen bg-app-gradient p-6 text-ink">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-app-gradient px-4 py-6 md:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-300/80 bg-white/75 p-4 shadow-card backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ink">Task Command Center</h1>
            <p className="text-sm text-slate-600">Signed in as {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Logout
          </button>
        </header>

        <TasksToolbar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onCreateClick={() => setModal({ open: true, mode: 'create', task: null })}
        />

        <section className="mt-4">
          {isFetching ? <p className="text-sm text-slate-700">Loading tasks...</p> : null}

          {!isFetching && tasks.length === 0 ? <EmptyState /> : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onEdit={(selectedTask) => setModal({ open: true, mode: 'edit', task: selectedTask })}
                isBusy={busyTaskId === task.id}
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </div>

      <TaskFormModal
        open={modal.open}
        mode={modal.mode}
        initialTask={modal.task}
        isSaving={isSaving}
        onClose={() => setModal({ open: false, mode: 'create', task: null })}
        onSubmit={handleSaveTask}
      />
    </main>
  );
}
