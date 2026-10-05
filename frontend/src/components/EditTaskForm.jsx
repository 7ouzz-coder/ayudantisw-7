import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskForm({ task, onTaskUpdated, onClose }) {
  const [apiError, setApiError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    mode: 'onChange',
    defaultValues: {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const updatedTask = await tasksService.update(task.id, data);
      onTaskUpdated(updatedTask);
      onClose();
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 border-t border-slate-700 pt-4 space-y-4">
      <h4 className="text-base font-semibold text-slate-100">Editar tarea</h4>

      {apiError && (
        <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
          {apiError}
        </p>
      )}

      <div>
        <label htmlFor={`edit-title-${task.id}`} className="block text-sm font-medium text-slate-300 mb-1.5">
          Título de la tarea
        </label>
        <input
          id={`edit-title-${task.id}`}
          type="text"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `edit-title-error-${task.id}` : undefined}
          {...register('title')}
          className={`w-full bg-slate-900/90 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
          }`}
        />
        {errors.title && (
          <p id={`edit-title-error-${task.id}`} role="alert" className="text-rose-400 text-xs mt-1.5">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`edit-description-${task.id}`} className="block text-sm font-medium text-slate-300 mb-1.5">
          Descripción
        </label>
        <textarea
          id={`edit-description-${task.id}`}
          rows="3"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? `edit-description-error-${task.id}` : undefined}
          {...register('description')}
          className={`w-full bg-slate-900/90 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 resize-none ${
            errors.description
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
          }`}
        />
        {errors.description && (
          <p id={`edit-description-error-${task.id}`} role="alert" className="text-rose-400 text-xs mt-1.5">
            {errors.description.message}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" {...register('completed')} className="accent-indigo-500" />
        Completada
      </label>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
