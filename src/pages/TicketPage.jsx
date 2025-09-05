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
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function TicketPage() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignTicketModalOpen, setAssignTicketModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [assignUserId, setAssignUserId] = useState('');

    // Fetch tickets + users
    useEffect(() => {
        apiClient.get('/tickets')
            .then(res => setTickets(res.data))
            .catch(err => toast.error(err.message));

        apiClient.get('/tickets/users/assignment')
            .then(res => setUsers(res.data))
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
            toast.error(`Failed to ${isUpdate ? "update" : "create"} ticket`);
        } finally {
            setFormLoading(false);
        }
    };


    // Assign Ticket
    const handleAssignTicketSubmit = async () => {
        if (!assignUserId) {
            toast.error("Please select a user to assign.");
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
        } catch (err) {
            toast.error("Failed to assign ticket.");
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
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : tickets.length > 0 ? (
                            tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.title}</TableCell>
                                    <TableCell>{ticket.priority}</TableCell>
                                    <TableCell>{ticket.status}</TableCell>
                                    <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditTicket(ticket)}
                                        >
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-primary"
                                            onClick={() => handleAssignTicket(ticket)}
                                        >
                                            <Send className="h-4 w-4" /> Assign
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
                                <TableCell colSpan="5" className="text-center">No tickets found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Ticket Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{currentTicket ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
                    </DialogHeader>
                    <TicketForm
                        initialData={currentTicket}
                        onSubmit={handleFormSubmit}
                        isLoading={formLoading}
                    />
                </DialogContent>
            </Dialog>

            {/* Assign Ticket Modal */}
            <Dialog open={assignTicketModalOpen} onOpenChange={setAssignTicketModalOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign to User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="assignUser">Select User</Label>
                        <select
                            id="assignUser"
                            value={assignUserId}
                            onChange={(e) => setAssignUserId(e.target.value)}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            onClick={handleAssignTicketSubmit}
                            disabled={formLoading}
                        >
                            {formLoading ? "Assigning..." : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function TicketForm({ initialData, onSubmit, isLoading }) {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleLocalSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title" className="mb-4">Title</Label>
                <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Issue with login"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description" className="mb-4">Description</Label>
                <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the issue..."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="priority" className="mb-4">Priority</Label>
                <select
                    id="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status" className="mb-4">Status</Label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : (
                        <>
                            <Send className="mr-2 h-4 w-4" /> {initialData ? "Update Ticket" : "Create Ticket"}
                        </>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}
