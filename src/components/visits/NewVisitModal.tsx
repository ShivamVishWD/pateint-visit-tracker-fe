import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { getClinicians } from '../../api/clinicians';
import { getPatients } from '../../api/patients';
import { createVisit } from '../../api/visits';
import { useAppStore } from '../../store/useAppStore';
import { VISIT_TYPES } from '../../types';
import type { VisitType } from '../../types';

const schema = z.object({
  clinicianId: z.number().positive('Please select a clinician.'),
  patientId:   z.number().positive('Please select a patient.'),
  visitType:   z.string().min(1),
  visitedAt:   z.string().optional().refine((val) => {
    if (!val) return true;
    return new Date(val).getTime() >= Date.now() - 5 * 60000; // 5 mins grace period
  }, 'Visit time cannot be in the past.'),
  notes:        z.string().max(1000, 'Notes must be under 1000 characters.').optional(),
});

interface NewVisitModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultForm = {
  clinicianId: '',
  patientId: '',
  visitType: 'General' as VisitType,
  visitedAt: '',
  notes: '',
};

export function NewVisitModal({ open, onClose }: NewVisitModalProps) {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: clinicians = [] } = useQuery({ queryKey: ['clinicians'], queryFn: getClinicians, staleTime: 60_000 });
  const { data: patients   = [] } = useQuery({ queryKey: ['patients'],   queryFn: getPatients,   staleTime: 60_000 });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setErrors({});
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: createVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      addToast('Visit recorded.', 'success');
      onClose();
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      addToast(msg ?? 'Failed to record visit. Please try again.', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      clinicianId: Number(form.clinicianId) || 0,
      patientId:   Number(form.patientId)   || 0,
      visitType:   form.visitType as VisitType,
      visitedAt:   form.visitedAt ? new Date(form.visitedAt).toISOString() : undefined,
      notes:        form.notes || undefined,
    };
    const result = schema.safeParse(payload);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((e) => { errs[String(e.path[0])] = e.message; });
      setErrors(errs);
      if (errs.clinicianId || errs.patientId) {
        addToast('Please select a clinician and patient.', 'error');
      }
      return;
    }
    setErrors({});
    mutation.mutate({ ...result.data, visitType: result.data.visitType as VisitType });
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Record New Visit">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Row 1: Clinician + Patient */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="visit-clinician" className="form-label">Clinician <span className="text-red-400">*</span></label>
            <select id="visit-clinician" className={`form-select ${errors.clinicianId ? 'border-red-500' : ''}`} value={form.clinicianId} onChange={set('clinicianId')}>
              <option value="">Select clinician…</option>
              {clinicians.map((c) => (
                <option key={c.id} value={c.id}>{c.name} · {c.specialty}</option>
              ))}
            </select>
            {errors.clinicianId && <p className="mt-1 text-xs text-red-400">{errors.clinicianId}</p>}
          </div>
          <div>
            <label htmlFor="visit-patient" className="form-label">Patient <span className="text-red-400">*</span></label>
            <select id="visit-patient" className={`form-select ${errors.patientId ? 'border-red-500' : ''}`} value={form.patientId} onChange={set('patientId')}>
              <option value="">Select patient…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} · {p.contactNumber}</option>
              ))}
            </select>
            {errors.patientId && <p className="mt-1 text-xs text-red-400">{errors.patientId}</p>}
          </div>
        </div>

        {/* Row 2: Visit Type + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="visit-type" className="form-label">Visit Type</label>
            <select id="visit-type" className="form-select" value={form.visitType} onChange={set('visitType')}>
              {VISIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="visit-datetime" className="form-label">Date & Time</label>
            <input
              id="visit-datetime"
              type="datetime-local"
              className={`form-input ${errors.visitedAt ? 'border-red-500' : ''}`}
              value={form.visitedAt}
              min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              onChange={set('visitedAt')}
            />
            {errors.visitedAt && <p className="mt-1 text-xs text-red-400">{errors.visitedAt}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="visit-notes" className="form-label">Notes <span className="text-slate-600">(optional)</span></label>
          <textarea
            id="visit-notes"
            className="form-textarea"
            rows={3}
            maxLength={1000}
            placeholder="Clinical notes…"
            value={form.notes}
            onChange={set('notes')}
          />
          <p className="mt-1 text-[10px] text-slate-600 text-right">{form.notes.length}/1000</p>
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
            ) : 'Record Visit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
