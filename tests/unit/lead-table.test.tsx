import React, { useState, useMemo } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'hot' | 'warm' | 'cold' | 'new';
  score: number | null;
  deal_value: number;
}

const SAMPLE_LEADS: Lead[] = [
  { id: '1', name: 'Maya Chen', company: 'Northwind Labs', status: 'hot', score: 92, deal_value: 45000 },
  { id: '2', name: 'Marcus Brody', company: 'Apex Bio', status: 'warm', score: 68, deal_value: 20000 },
  { id: '3', name: 'Elena Rostova', company: 'Solaria Tech', status: 'new', score: null, deal_value: 12000 },
  { id: '4', name: 'James Vance', company: 'Apex Robotics', status: 'hot', score: 85, deal_value: 60000 },
];

function TestLeadTable() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'hot' | 'warm' | 'new'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return SAMPLE_LEADS.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return lead.name.toLowerCase().includes(q) || lead.company.toLowerCase().includes(q);
      }
      return true;
    });
  }, [statusFilter, search]);

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search leads"
        />
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'hot' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('hot')}
        >
          Hot
        </Button>
        <Button
          variant={statusFilter === 'warm' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('warm')}
        >
          Warm
        </Button>
        <Button
          variant={statusFilter === 'new' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('new')}
        >
          New
        </Button>
      </div>

      <div role="region" aria-label="Leads list">
        {filtered.length === 0 ? (
          <p>No leads match your criteria.</p>
        ) : (
          <ul>
            {filtered.map((l) => (
              <li key={l.id} data-testid="lead-item">
                <span>{l.name}</span> - <span>{l.company}</span>
                <Badge>{l.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

describe('Component: Lead Table Filtering & Search', () => {
  it('renders all leads initially', () => {
    render(<TestLeadTable />);
    const items = screen.getAllByTestId('lead-item');
    expect(items).toHaveLength(4);
  });

  it('filters leads when clicking Hot status chip', () => {
    render(<TestLeadTable />);
    const hotBtn = screen.getByRole('button', { name: /^hot$/i });
    fireEvent.click(hotBtn);

    const items = screen.getAllByTestId('lead-item');
    expect(items).toHaveLength(2); // Maya Chen & James Vance
    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('James Vance')).toBeInTheDocument();
    expect(screen.queryByText('Marcus Brody')).not.toBeInTheDocument();
  });

  it('filters leads by search keyword across name and company', () => {
    render(<TestLeadTable />);
    const searchInput = screen.getByLabelText(/search leads/i);

    fireEvent.change(searchInput, { target: { value: 'apex' } });
    const items = screen.getAllByTestId('lead-item');
    expect(items).toHaveLength(2); // Marcus Brody (Apex Bio) & James Vance (Apex Robotics)
  });

  it('displays empty state when search matches zero leads', () => {
    render(<TestLeadTable />);
    const searchInput = screen.getByLabelText(/search leads/i);

    fireEvent.change(searchInput, { target: { value: 'nonexistent-query-12345' } });
    expect(screen.queryByTestId('lead-item')).not.toBeInTheDocument();
    expect(screen.getByText(/no leads match your criteria/i)).toBeInTheDocument();
  });

  it('combines status chip filter with keyword search', () => {
    render(<TestLeadTable />);
    // Select Hot
    fireEvent.click(screen.getByRole('button', { name: /^hot$/i }));
    // Type Apex
    fireEvent.change(screen.getByLabelText(/search leads/i), { target: { value: 'apex' } });

    const items = screen.getAllByTestId('lead-item');
    expect(items).toHaveLength(1);
    expect(screen.getByText('James Vance')).toBeInTheDocument();
  });
});
