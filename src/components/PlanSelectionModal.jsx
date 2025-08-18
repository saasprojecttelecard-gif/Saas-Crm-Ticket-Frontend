import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import toast from 'react-hot-toast';

const PlanSelectionModal = ({ isOpen, onClose, selectedPackage }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        tenant_name: '',
        email: '',
        contact_person: '',
        phone: '',
        company_size: ''
    });

    const companySizes = [
        { value: '1-10', label: '1-10 employees' },
        { value: '11-50', label: '11-50 employees' },
        { value: '51-200', label: '51-200 employees' },
        { value: '201-500', label: '201-500 employees' },
        { value: '500+', label: '500+ employees' }
    ];

    const handleSubmitRequest = async () => {
        if (!selectedPackage) {
            toast.error('Please select a package');
            return;
        }

        if (!formData.tenant_name || !formData.email || !formData.contact_person) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Subscription request submitted successfully! We will contact you soon.');

            setFormData({
                tenant_name: '',
                email: '',
                contact_person: '',
                phone: '',
                company_size: ''
            });
            onClose();

        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            tenant_name: '',
            email: '',
            contact_person: '',
            phone: '',
            company_size: ''
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Complete Your Request</DialogTitle>
                    <DialogDescription>
                        Tell us about your company to complete your subscription request for{' '}
                        <strong>{selectedPackage?.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">{selectedPackage?.name}</h3>
                                <p className="text-sm text-gray-600">{selectedPackage?.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">
                                    ${selectedPackage?.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                    per {selectedPackage?.duration_days} days
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="tenant_name">
                                    Company Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="tenant_name"
                                    value={formData.tenant_name}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        tenant_name: e.target.value
                                    }))}
                                    placeholder="Your Company Name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contact_person">
                                    Contact Person <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="contact_person"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        contact_person: e.target.value
                                    }))}
                                    placeholder="Your Full Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                    placeholder="your@company.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        phone: e.target.value
                                    }))}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="company_size">Company Size</Label>
                            <Select
                                value={formData.company_size}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    company_size: value
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companySizes.map((size) => (
                                        <SelectItem key={size.value} value={size.value}>
                                            {size.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitRequest}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            'Submitting Request...'
                        ) : (
                            <>
                                Submit Request
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PlanSelectionModal;
