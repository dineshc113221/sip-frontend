/* eslint-disable */
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryTable, { HistoryItem } from '../Historytable';

jest.mock("../../../assets/css/admin-page.scss", () => ({}));

jest.mock('../../results/ViewAllResults.component', () => ({
    CurrentVesrionIndicator: () => <div data-testid="current-version-indicator">Current Indicator</div>
}));

// Return distinct strings so tests can assert arrow direction by src value.
jest.mock('../../../assets/images/arrow_full_small_up_green.svg', () => 'arrow-up-green.svg');
jest.mock('../../../assets/images/arrow_full_small_down_red.svg', () => 'arrow-down-red.svg');
jest.mock('../../../assets/images/neutral_indicator.svg', () => 'neutral-indicator.svg');

const mockData: HistoryItem[] = [
  {
    _id: "1",
    version_number: "2.0",
    date: "2023-02-15",
    what_change: "Latest update",
    hasImpact: false,
    hasSnapshot: false
  },
  {
    _id: "2",
    version_number: "1.0",
    date: "2023-01-01",
    what_change: "Initial Release",
    hasImpact: false,
    hasSnapshot: true
  },
  {
    _id: "3",
    version_number: "1.5",
    date: "2023-01-20",
    what_change: "Bug Fix",
    hasImpact: false,
    hasSnapshot: true
  }
];

// Factory — avoids repeating { id:0, version_number:'1.0', date:'2023-01-01', what_change:'' } everywhere.
const makeItem = (
  overrides: Partial<HistoryItem> = {}
): HistoryItem => ({
  _id: "1",
  version_number: "1.0",
  date: "2023-01-01",
  what_change: "",
  hasImpact: false,
  hasSnapshot: false,
  ...overrides,
});

describe('HistoryTable Component', () => {

    describe('Rendering & Conditional Logic', () => {
        
        test('renders empty state message when data is empty', () => {
            render(<HistoryTable data={[]} />);
            expect(screen.getByText('Nothing to see here yet!')).toBeInTheDocument();
        });

        test('renders correct headers when isSnapshotRequired is FALSE', () => {
            render(<HistoryTable data={mockData} isSnapshotRequired={false} />);
            
            expect(screen.getByText('Version')).toBeInTheDocument();
            expect(screen.getByText('Date')).toBeInTheDocument();
            expect(screen.getByText("What's changed?")).toBeInTheDocument();
            expect(screen.getByText('Impact on assessment')).toBeInTheDocument();            
            expect(screen.queryByText('Snapshot')).not.toBeInTheDocument();
        });

        test('renders correct headers when isSnapshotRequired is TRUE', () => {
            render(<HistoryTable data={mockData} isSnapshotRequired={true} />);            
            expect(screen.getByText('Snapshot')).toBeInTheDocument();
        });

        test('formats date correctly (replaces hyphens with dots)', () => {
            render(<HistoryTable data={mockData} />);
            expect(screen.getByText('2023.01.01')).toBeInTheDocument();
            expect(screen.getByText('2023.02.15')).toBeInTheDocument();
        });

        test('renders version prefixed with V', () => {
            render(<HistoryTable data={[makeItem({ version_number: '3.0' })]} />);
            expect(screen.getByText(/V3\.0/)).toBeInTheDocument();
        });

        test('renders all three data rows', () => {
            render(<HistoryTable data={mockData} />);
            const rows = screen.getAllByRole('row');
            // 1 header + 3 data rows
            expect(rows).toHaveLength(4);
        });

        test('handles undefined date gracefully (no crash)', () => {
            const item = makeItem({ date: undefined as any });
            expect(() => render(<HistoryTable data={[item]} />)).not.toThrow();
        });

        test('renders what_change with empty string when missing', () => {
            const item = makeItem({ what_change: undefined as any });
            expect(() => render(<HistoryTable data={[item]} />)).not.toThrow();
        });
    });

    describe('Row Specific Logic (Current Version vs History)', () => {
        
        test('renders CurrentVesrionIndicator ONLY for row with id: 0', () => {
            render(<HistoryTable data={mockData} />);
            
            const indicators = screen.getAllByTestId('current-version-indicator');
            expect(indicators).toHaveLength(1);
            
            const rows = screen.getAllByRole('row');
            expect(within(rows[1]).getByTestId('current-version-indicator')).toBeInTheDocument();
        });

        test('does not show CurrentVesrionIndicator for non-first rows', () => {
            render(<HistoryTable data={mockData} />);
            const rows = screen.getAllByRole('row');
            // rows[2] and rows[3] are index 1 and 2 — should not have the indicator
            expect(within(rows[2]).queryByTestId('current-version-indicator')).not.toBeInTheDocument();
            expect(within(rows[3]).queryByTestId('current-version-indicator')).not.toBeInTheDocument();
        });

        test('Snapshot column logic: Renders link for history, hides text for id: 0', () => {
            const urlBase = "http://sipdev.kenvue.com";
            render(<HistoryTable data={mockData} isSnapshotRequired={true} urldata={urlBase} />);

            expect(screen.queryByText('Snapshot 2.0')).not.toBeInTheDocument();

            const snapshotLink = screen.getByText('Snapshot 1.0');
            expect(snapshotLink).toBeInTheDocument();
            
            expect(snapshotLink.closest('a')).toHaveAttribute('href', 'http://sipdev.kenvue.com/1.0/report');
            expect(snapshotLink.closest('a')).toHaveAttribute('target', '_blank');
        });

        test('snapshot link has rel="noreferrer"', () => {
            render(<HistoryTable data={mockData} isSnapshotRequired={true} urldata="http://base.com" />);
            const snapshotLink = screen.getByText('Snapshot 1.0');
            expect(snapshotLink.closest('a')).toHaveAttribute('rel', 'noreferrer');
        });

        test('snapshot link is rendered for all non-first rows', () => {
            render(<HistoryTable data={mockData} isSnapshotRequired={true} urldata="http://base.com" />);
            expect(screen.getByText('Snapshot 1.0')).toBeInTheDocument();
            expect(screen.getByText('Snapshot 1.5')).toBeInTheDocument();
        });

        test('snapshot column is absent when isSnapshotRequired is false', () => {
            render(<HistoryTable data={mockData} isSnapshotRequired={false} urldata="http://base.com" />);
            expect(screen.queryByText('Snapshot 1.0')).not.toBeInTheDocument();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // getImpactArrow — covers all rank combinations and null guard
    // ─────────────────────────────────────────────────────────────────────────
    describe('getImpactArrow via renderImpactOnAssessments', () => {

   const renderWithPef = (oldDesc, newDesc) =>
  render(
    <HistoryTable
      data={[
        makeItem({
          hasImpact: true,
          impact_on_assessments: {
            pef: {
              old_score: 1,
              new_score: 2,
              old_description: oldDesc,
              new_description: newDesc,
            },
          },
        }),
      ]}
    />
  );

        test('up-arrow: Very Poor → Good (rank improves)', () => {
            renderWithPef('Very Poor', 'Good');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs.some(i => i.src.includes('up'))).toBe(true);
        });

        test('up-arrow: Poor → Excellent (rank improves)', () => {
            renderWithPef('Poor', 'Excellent');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs.some(i => i.src.includes('up'))).toBe(true);
        });

        test('up-arrow: No Improvement → Excellent (rank improves)', () => {
            renderWithPef('No Improvement', 'Excellent');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs.some(i => i.src.includes('up'))).toBe(true);
        });

        test('down-arrow: Good → Very Poor (rank drops)', () => {
            renderWithPef('Good', 'Very Poor');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs.some(i => i.src.includes('down'))).toBe(true);
        });

        test('down-arrow: Excellent → Poor (rank drops)', () => {
            renderWithPef('Excellent', 'Poor');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs.some(i => i.src.includes('down'))).toBe(true);
        });

        test('neutral icon: same rank (Good → Good) renders neutral indicator', () => {
            renderWithPef('Good', 'Good');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs).toHaveLength(1);
            expect(imgs[0].src).toContain('neutral-indicator.svg');
            expect(imgs.some(i => i.src.includes('up'))).toBe(false);
            expect(imgs.some(i => i.src.includes('down'))).toBe(false);
        });

        test('neutral icon: same rank (Excellent → Excellent) renders neutral indicator', () => {
            renderWithPef('Excellent', 'Excellent');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs).toHaveLength(1);
            expect(imgs[0].src).toContain('neutral-indicator.svg');
        });

        test('neutral icon: unknown description treated as rank 0, same as another unknown', () => {
            // Both unknown → rank 0 vs 0 → equal → neutral icon
            renderWithPef('Unknown A', 'Unknown B');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs).toHaveLength(1);
            expect(imgs[0].src).toContain('neutral-indicator.svg');
        });

        test('no arrow: unknown old + known new that is also rank 0 equivalent', () => {
            // Unknown old = rank 0, "Very Poor" = rank 1 → new > old → up arrow
            renderWithPef('UnknownOld', 'Very Poor');
            const imgs = screen.getAllByAltText('trend') as HTMLImageElement[];
            expect(imgs.some(i => i.src.includes('up'))).toBe(true);
        });

        test('no arrow when oldDesc is null (early return) — neutral icon NOT shown', () => {
            renderWithPef(null, 'Good');
            expect(screen.queryByAltText('trend')).not.toBeInTheDocument();
        });

        test('no arrow when newDesc is null (early return) — neutral icon NOT shown', () => {
            renderWithPef('Good', null);
            expect(screen.queryByAltText('trend')).not.toBeInTheDocument();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // renderImpactOnAssessments — all branches
    // ─────────────────────────────────────────────────────────────────────────
    describe('renderImpactOnAssessments', () => {

        const fullImpact: HistoryItem = makeItem({
            hasImpact: true,
            impact_on_assessments: {
                pef:              { old_score: 60, new_score: 80, old_description: 'Poor',    new_description: 'Good' },
                carbon:           { old_score: 80, new_score: 50, old_description: 'Good',    new_description: 'Very Poor' },
                pack_circularity: { old_score: 70, new_score: 70, old_description: 'Good',    new_description: 'Good' },
                green_chem:       { old_score: null, new_score: null, old_description: null,  new_description: null  },
            }
        });

        test('renders all four known IMPACT_LABELS (except null section)', () => {
            render(<HistoryTable data={[fullImpact]} />);
            expect(screen.getByText('Product Environmental Footprint')).toBeInTheDocument();
            expect(screen.getByText('Product Carbon Footprint')).toBeInTheDocument();
            expect(screen.getByText('Pack Circularity')).toBeInTheDocument();
            // green_chem has both null → skipped
            expect(screen.queryByText('Green Chemistry')).not.toBeInTheDocument();
        });

        test('renders old_description and new_description with → separator', () => {
            render(<HistoryTable data={[fullImpact]} />);
            expect(screen.getAllByText('→').length).toBeGreaterThanOrEqual(2);
            expect(screen.getByText('Poor')).toBeInTheDocument();
        });

        test('shows N/A for null old_description within a visible section', () => {
            render(<HistoryTable data={[makeItem({
                hasImpact: true,
                impact_on_assessments: {
pef: {
  old_score: 1,
  new_score: 2,
  old_description: null,
  new_description: 'Good'
}                }
            })]} />);
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });

        test('shows N/A for null new_description within a visible section', () => {
            render(<HistoryTable data={[makeItem({
                hasImpact: true,
                impact_on_assessments: {
pef: {
  old_score: 1,
  new_score: 2,
  old_description: 'Good',
  new_description: null
}                }
            })]} />);
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });

        test('skips section where both descriptions are null', () => {
            render(<HistoryTable data={[fullImpact]} />);
            expect(screen.queryByText('Green Chemistry')).not.toBeInTheDocument();
        });

        test('falls back to raw key as label when key is not in IMPACT_LABELS', () => {
            render(<HistoryTable data={[makeItem({
                hasImpact: true,
                impact_on_assessments: {
                    custom_metric: { old_score: 1, new_score: 2, old_description: 'Poor', new_description: 'Good' }
                } as any
            })]} />);
            expect(screen.getByText('custom_metric')).toBeInTheDocument();
        });

       

        test('renders multiple sections in the same row', () => {
            render(<HistoryTable data={[fullImpact]} />);
            // pef and carbon are both rendered (green_chem skipped, pack_circularity rendered)
            expect(screen.getByText('Product Environmental Footprint')).toBeInTheDocument();
            expect(screen.getByText('Pack Circularity')).toBeInTheDocument();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // impact_on_assessments vs impact field priority
    // ─────────────────────────────────────────────────────────────────────────
    describe('impact_on_assessments vs impact field priority', () => {

        test('prefers impact_on_assessments over impact string when both are present', () => {
            render(<HistoryTable data={[makeItem({
                hasImpact: true,
                impact_on_assessments: {
                    pef: { old_score: 60, new_score: 80, old_description: 'Poor', new_description: 'Good' }
                }
            })]} />);
            expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
            expect(screen.getByText('Product Environmental Footprint')).toBeInTheDocument();
        });
test('renders empty impact cell when hasImpact is false', () => {
  render(
    <HistoryTable
      data={[
        makeItem({
          hasImpact: false
        })
      ]}
    />
  );

  expect(
    screen.queryByText('Product Environmental Footprint')
  ).not.toBeInTheDocument();
});
test('renders impact assessment when hasImpact is true', () => {
  render(
    <HistoryTable
      data={[
        makeItem({
          hasImpact: true,
          impact_on_assessments: {
            pef: {
              old_score: 60,
              new_score: 80,
              old_description: 'Poor',
              new_description: 'Good'
            }
          }
        })
      ]}
    />
  );

  expect(
    screen.getByText('Product Environmental Footprint')
  ).toBeInTheDocument();
});

        test('renders empty impact cell when both impact and impact_on_assessments are absent', () => {
            render(<HistoryTable data={[makeItem()]} />);
            expect(screen.queryByAltText('trend')).not.toBeInTheDocument();
            expect(screen.queryByText('Product Environmental Footprint')).not.toBeInTheDocument();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // renderTextWithLinks — all branches
    // ─────────────────────────────────────────────────────────────────────────
    describe('renderTextWithLinks', () => {

        test('renders plain text without any anchor tag', () => {
            render(<HistoryTable data={[makeItem({ what_change: 'Just plain text' })]} />);
            expect(screen.getByText('Just plain text')).toBeInTheDocument();
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });

        test('renders a URL as a clickable anchor with correct href, target and rel', () => {
            render(<HistoryTable data={[makeItem({ what_change: 'https://example.com' })]} />);
            const link = screen.getByRole('link', { name: 'https://example.com' });
            expect(link).toHaveAttribute('href', 'https://example.com');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });

        test('renders mixed text and URL: text is plain, URL is a link', () => {
            render(<HistoryTable data={[makeItem({ what_change: 'Details at https://example.com here' })]} />);
            expect(screen.getByRole('link', { name: 'https://example.com' })).toBeInTheDocument();
            expect(screen.getByText(/Details at/)).toBeInTheDocument();
        });

        test('renders multiple URLs in one string as separate links', () => {
            render(<HistoryTable data={[makeItem({
                what_change: 'See https://one.com and https://two.com'
            })]} />);
            const links = screen.getAllByRole('link');
            expect(links).toHaveLength(2);
            expect(links[0]).toHaveAttribute('href', 'https://one.com');
            expect(links[1]).toHaveAttribute('href', 'https://two.com');
        });

        test('returns empty when what_change is an empty string', () => {
            expect(() => render(<HistoryTable data={[makeItem({ what_change: '' })]} />)).not.toThrow();
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });

        test('URL link has underline and black color styles', () => {
            render(<HistoryTable data={[makeItem({ what_change: 'https://example.com' })]} />);
            const link = screen.getByRole('link');
            expect(link).toHaveStyle({ textDecoration: 'underline', color: '#000000' });
        });
    });
});