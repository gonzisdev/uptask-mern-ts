import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Task, TaskFormData } from '@/types';
import { updateTask } from '@/api';
import { TaskForm } from './TaskForm';
import { toast } from 'react-toastify';
import { ButtonLoading } from '..';

type EditTaskModalProps = {
  task: Task;
  projectId: string;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, projectId }) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      name: task.name,
      description: task.description
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateTask,
    mutationKey: ['updateTask', task.taskId],
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data.msg)
      queryClient.invalidateQueries({ queryKey: ['projectById', projectId] })
      navigate(location.pathname, { replace: true })
    }
  })

  const onSubmitEdit = (formData: TaskFormData) => {
    mutate({ taskId: task.taskId, projectId, formData })
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <Dialog.Title
                  as="h3"
                  className="font-black text-4xl  my-5"
                >
                  Edit Task
                </Dialog.Title>
                <p className="text-xl font-bold">Make change in a task in {''}
                  <span className="text-fuchsia-600">this form</span>
                </p>
                <form
                  className="mt-10 space-y-3"
                  noValidate
                  onSubmit={handleSubmit(onSubmitEdit)}
                >

                  <TaskForm register={register} errors={errors} />
                  <ButtonLoading title='Save Task' isLoading={isPending} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}