import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Send, PlusCircle, Trash2, Edit2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';

function Toast({ message, type, onClose }) {
    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white transition-all duration-300 transform";
    const typeClasses = type === 'success' ? "bg-green-500" : "bg-red-500";
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
        </div>
    );
}



const initialTickets = [
    { id: '1', title: 'Login issue', description: 'Cannot log in with my credentials', priority: 'high', status: 'open', createdAt: '2023-10-26T10:00:00Z' },
    { id: '2', title: 'Payment failed', description: 'Credit card transaction declined', priority: 'high', status: 'open', createdAt: '2023-10-25T14:30:00Z' },
    { id: '3', title: 'Product question', description: 'Question about product features', priority: 'low', status: 'closed', createdAt: '2023-10-24T09:00:00Z' },
];

export default function TicketPage() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            apiClient.get('/tickets').then((res) => {
                setTickets(res.data)
            })
        };
        fetchTickets();
    }, []);

    // --- inside TicketPage ---
    const handleFormSubmit = async (formData) => {
        setIsLoading(true);
        const isUpdate = !!formData.id;

        try {
            if (isUpdate) {
                const payload = {
                    priority: formData.priority,
                    status: formData.status,
                }
                const { data: updatedTicket } = await apiClient.patch(`/tickets/${formData.id}`, payload);
                setTickets(prevTickets =>
                    prevTickets.map(t =>
                        t.id === formData.id ? { ...updatedTicket } : t
                    )
                );
                setToast({ message: 'Ticket updated successfully!', type: 'success' });
            } else {
                const { data: newTicket } = await apiClient.post('/tickets', formData);
                setTickets(prevTickets => [newTicket, ...prevTickets]);
                setToast({ message: 'Ticket created successfully!', type: 'success' });
            }
            setIsModalOpen(false);
            setCurrentTicket(null);
        } catch (apiError) {
            console.error('API Error:', apiError);
            setToast({ message: `Failed to ${isUpdate ? 'update' : 'create'} ticket.`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (ticketId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
        if (!confirmDelete) return;

        setIsLoading(true);
        try {
            await apiClient.delete(`/tickets/${ticketId}`);
            setTickets(prevTickets => prevTickets.filter(t => t.id !== ticketId));
            setToast({ message: 'Ticket deleted successfully!', type: 'success' });
        } catch (apiError) {
            console.error('API Error:', apiError);
            setToast({ message: 'Failed to delete ticket.', type: 'error' });
        } finally {
            setIsLoading(false);
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

    return (
        <>
            <Card className="p-4 rounded-none">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ticket Management</CardTitle>
                    <Button onClick={handleAddTicket} >
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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-medium">{ticket.title}</TableCell>
                                        <TableCell>{ticket.priority}</TableCell>
                                        <TableCell>{ticket.status}</TableCell>
                                        <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditTicket(ticket)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(ticket.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center">
                                        No tickets found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Ticket Creation/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{currentTicket ? 'Edit Ticket' : 'Create New Ticket'}</DialogTitle>
                        {/* <DialogDescription>
                            {currentTicket ? 'Update the details for this ticket.' : 'Fill in the details for the new ticket.'}
                        </DialogDescription> */}
                    </DialogHeader>
                    <TicketForm
                        initialData={currentTicket}
                        onSubmit={handleFormSubmit}
                        isLoading={isLoading}
                        isEdit={currentTicket ? true : false}
                    />
                </DialogContent>
            </Dialog>
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
        </>
    );
}

function TicketForm({ initialData, onSubmit, isLoading, isEdit }) {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        description: '',
        priority: 'low',
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

    const handleLocalSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleLocalSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Issue with a recent order"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the issue."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
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
                <Label htmlFor="priority">Status</Label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="open">Open</option>
                    <option value="close">Close</option>
                </select>
            </div>
            <DialogFooter className="pt-4">
                <Button
                    type="submit"
                    // className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            {initialData ? 'Update Ticket' : 'Create Ticket'}
                        </>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}
