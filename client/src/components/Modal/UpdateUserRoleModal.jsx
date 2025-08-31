import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import toast from 'react-hot-toast';

export default function UpdateUserRoleModal({isOpen, setIsOpen, email, role}) {
	const axiosSecure = useAxiosSecure()
	const [updateRole, setUpdateRole] = useState(role)
	const queryClient = useQueryClient()
	function close() {
		setIsOpen(false)
	}
	const mutation = useMutation({
		mutationFn: async role => {
			const {data} = await axiosSecure.patch(`/user/role/update/${email}`, {
				role
			})
			return data
		},
		onSuccess: () => {
			toast.success('updated role')
			close()
			queryClient.invalidateQueries(['users'])
		},
		onError: error => {
			console.log(error)
		}
	})

	const handleSubmit = e => {
		e.preventDefault()
		mutation.mutate(updateRole)
	}
	return (
		<>
			<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<DialogPanel
							transition
							className="w-full max-w-md border rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
						>
							<DialogTitle as="h3" className="text-base/7 font-medium text-black">
								Update User Role
							</DialogTitle>
							<form onSubmit={handleSubmit}>
								<div className="mt-4 flex justify-between">
									<label>Select User</label>
									<select className='w-full my-3 border border-gray-200 rounded-xl px-2 py-3'
									 name='role'
									 onChange={e => setUpdateRole(e.target.value)}
									 value={updateRole}
									>
										<option value="customer">Customer</option>
										<option value="seller">Seller</option>
										<option value="admin">Admin</option>
									</select>
								</div>
							<div className="mt-4 flex justify-between">
								<Button
									className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
									onClick={close}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
								>
									Update
								</Button>
							</div>
							</form>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</>
	)
}
