import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ButtonLoading, TaskForm } from '@/components';
import { TaskFormData } from '@/types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/api';
import { toast } from 'react-toastify';

export const AddTaskModal = () => {

    const queryClient = useQueryClient();
    const { projectId = '' } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const showModal = queryParams.get('newTask') ? true : false

    const initialValues: TaskFormData = {
        name: '',
        description: ''
    }

    const { register, reset, formState: { errors }, handleSubmit } = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['addTaks'],
        mutationFn: createTask,
        onSuccess: (data) => {
            toast.success(data.msg)
            reset()
            queryClient.invalidateQueries({ queryKey:['projectById']})
            navigate(location.pathname, { replace: true })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const onSubmitForm = (data: TaskFormData) => {
        mutate({ projectId: projectId, formData: data })
    }

    return (
        <>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { navigate(location.pathname, { replace: true }) }}>
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
                                        New Task
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Fill form and create  {''}
                                        <span className="text-fuchsia-600">a new task</span>
                                    </p>
                                    <form
                                        className='mt-10 space-y-3'
                                        noValidate
                                        onSubmit={handleSubmit(onSubmitForm)}
                                    >

                                        <TaskForm
                                            register={register}
                                            errors={errors}
                                        />

                                        <ButtonLoading title="Save Task" isLoading={isPending} />
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}