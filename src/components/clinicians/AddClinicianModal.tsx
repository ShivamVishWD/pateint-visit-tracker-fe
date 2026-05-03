import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { createClinician } from '../../api/clinicians';
import { useAppStore } from '../../store/useAppStore';
import { SPECIALTIES } from '../../types';

const schema = z.object({
  name:      z.string().min(2, 'Name must be at least 2 characters.').max(100),
  specialty: z.string().min(1, 'Please select a specialty.'),
  email:     z.string().email('Please enter a valid email address.'),
});

interface AddClinicianModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultForm = { name: '', specialty: '', email: '' };

export function AddClinicianModal({ open, onClose }: AddClinicianModalProps) {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) { setForm(defaultForm); setErrors({}); }
  }, [open]);

  const mutation = useMutation({
    mutationFn: createClinician,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicians'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      addToast('Clinician added.', 'success');
      onClose();
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (msg?.toLowerCase().includes('email')) {
        addToast('A clinician with this email already exists.', 'error');
      } else {
        addToast(msg ?? 'Failed to add clinician.', 'error');
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Add Clinician">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="clin-name" className="form-label">Full Name <span className="text-red-400">*</span></label>
          <input
            id="clin-name"
            type="text"
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Dr. Jane Smith"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Specialty */}
        <div>
          <label htmlFor="clin-specialty" className="form-label">Specialty <span className="text-red-400">*</span></label>
          <select
            id="clin-specialty"
            className={`form-select ${errors.specialty ? 'border-red-500' : ''}`}
            value={form.specialty}
            onChange={set('specialty')}
          >
            <option value="">Select specialty…</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.specialty && <p className="mt-1 text-xs text-red-400">{errors.specialty}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="clin-email" className="form-label">Email <span className="text-red-400">*</span></label>
          <input
            id="clin-email"
            type="email"
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="j.smith@clinic.com"
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
            ) : 'Add Clinician'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
