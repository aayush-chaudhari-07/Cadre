import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, X } from 'lucide-react';
import { csvRowSchema, type CsvLeadRow } from '../schemas';
import { useImportLeads } from '../hooks';
import { toast } from 'sonner';

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
}

interface RowValidationResult {
  rowNumber: number;
  data: CsvLeadRow | null;
  errors: string[];
}

export function CsvImportDialog({ open, onOpenChange, orgId }: CsvImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportLeads(orgId);

  const [fileName, setFileName] = useState<string | null>(null);
  const [validRows, setValidRows] = useState<CsvLeadRow[]>([]);
  const [invalidRows, setInvalidRows] = useState<RowValidationResult[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleReset = () => {
    setFileName(null);
    setValidRows([]);
    setInvalidRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file.');
      return;
    }

    setFileName(file.name);
    setIsParsing(true);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        const headers = results.meta.fields || [];

        // Auto-detect column headers
        const nameKey = headers.find((h) => /^(name|full_name|contact|lead_name)$/i.test(h)) || headers[0] || 'name';
        const companyKey = headers.find((h) => /^(company|account|org|organization)$/i.test(h));
        const emailKey = headers.find((h) => /^(email|mail|e-mail)$/i.test(h));
        const sourceKey = headers.find((h) => /^(source|origin|channel)$/i.test(h));
        const valueKey = headers.find((h) => /^(value|deal_value|amount|budget|mrr)$/i.test(h));

        const parsedValid: CsvLeadRow[] = [];
        const parsedInvalid: RowValidationResult[] = [];

        results.data.forEach((row, idx) => {
          const rawName = (row[nameKey] || '').trim();
          const rawCompany = companyKey ? (row[companyKey] || '').trim() : '';
          const rawEmail = emailKey ? (row[emailKey] || '').trim() : '';
          const rawSource = sourceKey ? (row[sourceKey] || '').trim() : 'CSV Import';
          const rawValue = valueKey ? parseFloat(row[valueKey] || '0') : 0;

          const candidate = {
            name: rawName,
            company: rawCompany,
            email: rawEmail,
            source: rawSource || 'CSV Import',
            dealValue: isNaN(rawValue) ? 0 : rawValue,
          };

          const validation = csvRowSchema.safeParse(candidate);
          if (validation.success) {
            parsedValid.push(validation.data);
          } else {
            parsedInvalid.push({
              rowNumber: idx + 2, // Header is row 1
              data: null,
              errors: validation.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
            });
          }
        });

        setValidRows(parsedValid);
        setInvalidRows(parsedInvalid);
      },
      error: (error) => {
        setIsParsing(false);
        toast.error(`CSV parse error: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (validRows.length === 0) return;

    try {
      const result = await importMutation.mutateAsync(validRows);
      toast.success(`Successfully imported ${result.insertedCount} leads in batches.`);
      handleReset();
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to import CSV leads');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) handleReset();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-xl bg-[var(--surface)] border-[var(--border)] text-[var(--text)]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[var(--text)] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[var(--primary)]" />
            Import Leads from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {!fileName ? (
            /* Upload Drop Area */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/50 rounded-2xl p-8 text-center cursor-pointer bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] transition-all duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-[var(--text-3)] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[var(--text)] mb-1">
                Choose CSV file to import
              </p>
              <p className="text-xs text-[var(--text-2)] max-w-sm mx-auto leading-relaxed">
                Accepted format: standard CSV with headers (e.g. Name, Company, Email, Source, Deal Value).
                Rows will be ingested in batches of 100.
              </p>
            </div>
          ) : (
            /* File Preview & Validation Report */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-xs font-mono font-medium text-[var(--text)]">{fileName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 w-7 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isParsing ? (
                <p className="text-xs text-[var(--text-2)] font-mono py-4 text-center">
                  Parsing and validating CSV rows...
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 flex items-center justify-between">
                      <span className="text-[var(--text-2)] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                        Valid Rows
                      </span>
                      <span className="font-mono font-bold text-[var(--primary)]">{validRows.length}</span>
                    </div>

                    <div className="p-3 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/5 flex items-center justify-between">
                      <span className="text-[var(--text-2)] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                        Invalid Rows
                      </span>
                      <span className="font-mono font-bold text-[var(--warning)]">{invalidRows.length}</span>
                    </div>
                  </div>

                  {invalidRows.length > 0 && (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 max-h-36 overflow-y-auto space-y-1.5">
                      <p className="text-[11px] font-mono font-semibold text-[var(--warning)] uppercase tracking-wider mb-1">
                        Row Validation Errors (Skipped)
                      </p>
                      {invalidRows.slice(0, 10).map((inv) => (
                        <p key={inv.rowNumber} className="text-xs font-mono text-[var(--text-2)]">
                          Row {inv.rowNumber}: <span className="text-[var(--danger)]">{inv.errors.join(', ')}</span>
                        </p>
                      ))}
                      {invalidRows.length > 10 && (
                        <p className="text-[11px] text-[var(--text-3)] font-mono">
                          ... and {invalidRows.length - 10} more rows with errors.
                        </p>
                      )}
                    </div>
                  )}

                  {validRows.length > 0 && (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 space-y-2">
                      <p className="text-[11px] font-mono font-semibold text-[var(--text-3)] uppercase tracking-wider">
                        Sample Rows Preview
                      </p>
                      <div className="space-y-1 font-mono text-xs text-[var(--text-2)]">
                        {validRows.slice(0, 3).map((row, i) => (
                          <div key={i} className="flex justify-between border-b border-[var(--border)]/50 pb-1 last:border-b-0">
                            <span className="text-[var(--text)] font-medium">{row.name}</span>
                            <span>{row.company || '—'}</span>
                            <span className="text-[var(--primary)]">{row.dealValue ? `$${row.dealValue}` : '$0'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={importMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={validRows.length === 0 || importMutation.isPending}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-ink)] font-semibold"
          >
            {importMutation.isPending
              ? 'Importing...'
              : `Import ${validRows.length} Leads`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
