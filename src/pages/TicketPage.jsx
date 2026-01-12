import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/table';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Send, PlusCircle, Pencil } from 'lucide-react';
import apiClient, { apiClientContact } from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function TicketPage() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignTicketModalOpen, setAssignTicketModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [assignUserId, setAssignUserId] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            toast.error("Failed to fetch tickets.");
        } finally {
            setIsLoading(false);
        }
    };
    // Fetch tickets + users + contacts
    useEffect(() => {

        fetchTickets();
        apiClient.get('/tickets/users/assignment')
            .then(res => setUsers(res.data))
            .catch(err => toast.error(err.message));

        apiClientContact.get('/contacts')
            .then(res => setContacts(res.data))
            .catch(err => toast.error(err.message));
    }, []);

    // Add / Update Ticket
    // Add / Update Ticket
    const handleFormSubmit = async (formData) => {
        if (!formData.title || !formData.description) {
            toast.error("Title and Description are required.");
            return;
        }

        setFormLoading(true);
        const isUpdate = !!formData.id;

        try {
            if (isUpdate) {
                const payload = {
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    status: formData.status,
                    // contact_id: formData.contact_id,
                };

                const { data: updatedTicket } = await apiClient.patch(
                    `/tickets/${formData.id}`,
                    payload
                );

                setTickets((prev) =>
                    prev.map((t) => (t.id === formData.id ? { ...updatedTicket } : t))
                );
                toast.success("Ticket updated successfully!");
            } else {
                const { data: newTicket } = await apiClient.post("/tickets", formData);
                setTickets((prev) => [newTicket, ...prev]);
                toast.success("Ticket created successfully!");
            }
            setIsModalOpen(false);
            setCurrentTicket(null);
        } catch (err) {
            // toast.error(`Failed to ${isUpdate ? "update" : "create"} ticket`);
            toast.error(err.response?.data?.message || `Failed to ${isUpdate ? "update" : "create"} ticket`);
        } finally {
            setFormLoading(false);
        }
    };


    // Assign Ticket
    const handleAssignTicketSubmit = async () => {
        if (!assignUserId) {
            setFieldErrors({ assignUser: "Please select a user to assign." });
            return;
        }
        setFormLoading(true);
        try {
            await apiClient.patch(`/tickets/${currentTicket.id}/assign`, {
                assigned_to: assignUserId
            });
            toast.success("Ticket assigned successfully!");
            setAssignTicketModalOpen(false);
            setAssignUserId('');
            setCurrentTicket(null);
            fetchTickets();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign ticket");
            // toast.error("Failed to assign ticket.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleAddTicket = () => {
        setCurrentTicket(null);
        setIsModalOpen(true);
    };

    const handleEditTicket = (ticket) => {
        setCurrentTicket(ticket);
        setIsModalOpen(true);
    };

    const handleAssignTicket = (ticket) => {
        setCurrentTicket(ticket);
        setAssignTicketModalOpen(true);
        setAssignUserId(ticket.assigned_to || '');
    };

    return (
        <Card className="p-4 rounded-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ticket Management</CardTitle>
                <Button onClick={handleAddTicket}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Ticket
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : tickets.length > 0 ? (
                            tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.title}</TableCell>
                                    <TableCell className="max-w-xs truncate">{ticket.description}</TableCell>
                                    <TableCell>{ticket.priority}</TableCell>
                                    <TableCell>{ticket.status}</TableCell>
                                    <TableCell>{users.find(u => u.id === ticket.assigned_to)?.name || 'N/A'}</TableCell>
                                    <TableCell>{contacts.find(c => c.id === ticket.contact_id)?.first_name || 'N/A'}</TableCell>
                                    <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditTicket(ticket)}
                                            title="Edit Ticket"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={ticket.status === 'closed' ? "disabled" : ""}
                                            size="sm"
                                            disabled={ticket.status === 'closed'}
                                            onClick={() => handleAssignTicket(ticket)}
                                            title="Assign Ticket"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                        {/* <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">No tickets found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Ticket Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-0"> {/* p-0 removes default padding to prevent scroll clashes */}
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>{currentTicket ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
                    </DialogHeader>

                    {/* This wrapper handles the auto-scrollbar logic */}
                    <div className="max-h-[70vh] overflow-y-auto px-6 pb-6">
                        <TicketForm
                            initialData={currentTicket}
                            onSubmit={handleFormSubmit}
                            isLoading={formLoading}
                            contacts={contacts}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Assign Ticket Modal */}
            {/* Assign Ticket Modal */}
            <Dialog open={assignTicketModalOpen} onOpenChange={(open) => {
                setAssignTicketModalOpen(open);
                if (!open) setFieldErrors({}); // Clear errors when closing
            }}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign to User</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-1">
                        <Label htmlFor="assignUser" className="font-semibold text-gray-700 mb-3">
                            Select User <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="assignUser"
                            value={assignUserId}
                            onChange={(e) => {
                                setAssignUserId(e.target.value);
                                if (fieldErrors.assignUser) {
                                    setFieldErrors(prev => ({ ...prev, assignUser: null }));
                                }
                            }}
                            className={`w-full h-10 rounded-md border bg-background px-3 py-2 text-sm transition-colors ${fieldErrors.assignUser
                                ? "border-red-500 focus:ring-red-500"
                                : "border-input focus:ring-ring"
                                }`}
                        >
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>

                        {/* Red Error Message */}
                        {fieldErrors.assignUser && (
                            <p className="text-red-500 text-xs font-medium">{fieldErrors.assignUser}</p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            onClick={handleAssignTicketSubmit}
                            disabled={formLoading}
                            className="w-full"
                        >
                            {formLoading ? "Assigning..." : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card >
    );
}

// function TicketForm({ initialData, onSubmit, isLoading, contacts }) {
//     const [formData, setFormData] = useState(initialData || {
//         title: '',
//         description: '',
//         priority: 'low',
//         status: 'open',
//         contact_id: '',
//     });

//     useEffect(() => {
//         if (initialData) {
//             setFormData(initialData);
//         }
//     }, [initialData]);

//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setFormData(prev => ({ ...prev, [id]: value }));
//     };

//     const handleLocalSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };

//     return (
//         <form onSubmit={handleLocalSubmit} className="space-y-4">
//             <div className="space-y-2">
//                 <Label htmlFor="title" className="mb-4">Title <span className="text-red-500">*</span></Label>
//                 <Input
//                     id="title"
//                     type="text"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g. Issue with login"
//                 />
//             </div>
//             <div className="space-y-2">
//                 <Label htmlFor="description" className="mb-4">Description <span className="text-red-500">*</span></Label>
//                 <Textarea
//                     id="description"
//                     rows={4}
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Describe the issue..."
//                 />
//             </div>
//             <div className="space-y-2">
//                 <Label htmlFor="contact_id" className="mb-4">Contact</Label>
//                 <select
//                     id="contact_id"
//                     value={formData.contact_id}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                 >
//                     <option value="">Select a contact</option>
//                     {contacts && contacts.map(contact => (
//                         <option key={contact.id} value={contact.id}>
//                             {contact.first_name} {contact.last_name}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div className="space-y-2">
//                 <Label htmlFor="priority" className="mb-4">Priority</Label>
//                 <select
//                     id="priority"
//                     value={formData.priority}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                 >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                 </select>
//             </div>
//             <div className="space-y-2">
//                 <Label htmlFor="status" className="mb-4">Status</Label>
//                 <select
//                     id="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2"
//                 >
//                     <option value="open">Open</option>
//                     <option value="closed">Closed</option>
//                 </select>
//             </div>
//             <DialogFooter>
//                 <Button type="submit" disabled={isLoading}>
//                     {isLoading ? "Submitting..." : (
//                         <>
//                             <Send className="mr-2 h-4 w-4" /> {initialData ? "Update Ticket" : "Create Ticket"}
//                         </>
//                     )}
//                 </Button>
//             </DialogFooter>
//         </form>
//     );
// }

function TicketForm({ initialData, onSubmit, isLoading, contacts }) {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        contact_id: '',
    });

    // New state for field-specific errors
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = "Title is required.";
        }
        if (!formData.description.trim()) {
            errors.description = "Description is required.";
        }
        if (!formData.contact_id) {
            errors.contact_id = "Contact is required.";
        }
        return errors;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Clear error when user starts typing
        if (fieldErrors[id]) {
            setFieldErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleLocalSubmit = (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            // toast.error("Please fix the highlighted errors.");
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleLocalSubmit} className="space-y-4">
            {/* Title Field */}
            <div className="space-y-1">
                <Label htmlFor="title" className="mb-3">
                    Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Issue with login"
                    // Conditional red border class
                    className={fieldErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.title && (
                    <p className="text-red-500 text-xs font-medium">{fieldErrors.title}</p>
                )}
            </div>

            {/* Description Field */}
            <div className="space-y-1">
                <Label htmlFor="description" className="mb-3">
                    Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the issue..."
                    // Conditional red border class
                    className={fieldErrors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.description && (
                    <p className="text-red-500 text-xs font-medium">{fieldErrors.description}</p>
                )}
            </div>

            {!initialData && <div className="space-y-2">
                <Label htmlFor="contact_id" className="mb-3">Contact  <span className="text-red-500">*</span></Label>
                <select
                    id="contact_id"
                    value={formData.contact_id}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="">Select a contact</option>
                    {contacts && contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                        </option>
                    ))}
                </select>
                {fieldErrors.contact_id && (
                    <p className="text-red-500 text-xs font-medium">{fieldErrors.contact_id}</p>
                )}
            </div>}

            <div className="space-y-2">
                <Label htmlFor="priority" className="mb-3">Priority</Label>
                <select
                    id="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status" className="mb-3">Status</Label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? "Submitting..." : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            {initialData ? "Update Ticket" : "Create Ticket"}
                        </>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}