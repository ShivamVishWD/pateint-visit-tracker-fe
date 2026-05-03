import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { createPatient } from '../../api/patients';
import { useAppStore } from '../../store/useAppStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required.')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date < new Date();
    }, 'Date of birth must be a valid past date.'),
  contactNumber: z
    .string()
    .min(10, 'Contact number must be at least 10 digits.')
    .regex(/^\d+$/, 'Contact number must contain only digits.'),
  email: z.string().email('Please enter a valid email address.'),
});

interface RegisterPatientModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultForm = { name: '', dateOfBirth: '', contactNumber: '', email: '' };

export function RegisterPatientModal({ open, onClose }: RegisterPatientModalProps) {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) { setForm(defaultForm); setErrors({}); }
  }, [open]);

  const mutation = useMutation({
    mutationFn: (data: typeof defaultForm) => {
      // API expects ISO string for dateOfBirth
      const payload = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      };
      return createPatient(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      addToast('Patient registered.', 'success');
      onClose();
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (msg?.toLowerCase().includes('email')) {
        addToast('A patient with this email already exists.', 'error');
      } else {
        addToast(msg ?? 'Failed to register patient.', 'error');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((e) => { errs[String(e.path[0])] = e.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    mutation.mutate(result.data);
  };

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Register Patient">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="pat-name" className="form-label">Full Name <span className="text-red-400">*</span></label>
          <input
            id="pat-name"
            type="text"
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Jane Doe"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="pat-dob" className="form-label">Date of Birth <span className="text-red-400">*</span></label>
          <input
            id="pat-dob"
            type="date"
            className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            value={form.dateOfBirth}
            max={new Date().toISOString().split('T')[0]}
            onChange={set('dateOfBirth')}
          />
          {errors.dateOfBirth && <p className="mt-1 text-xs text-red-400">{errors.dateOfBirth}</p>}
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="pat-contact" className="form-label">Contact Number <span className="text-red-400">*</span></label>
          <input
            id="pat-contact"
            type="text"
            className={`form-input font-mono ${errors.contactNumber ? 'border-red-500' : ''}`}
            placeholder="9876543210"
            maxLength={10}
            value={form.contactNumber}
            onChange={set('contactNumber')}
          />
          {errors.contactNumber && <p className="mt-1 text-xs text-red-400">{errors.contactNumber}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="pat-email" className="form-label">Email <span className="text-red-400">*</span></label>
          <input
            id="pat-email"
            type="email"
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="jane@example.com"
            value={form.email}
            onChange={set('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-border">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : 'Register Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
