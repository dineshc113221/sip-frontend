/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import PieChartDials, { PieChart } from '../PieChartDials'; 
import { PieChartDialsProps } from '../../breadcrumb/types'; 


jest.mock('../../../assets/images/great_job.svg', () => 'great-job.svg');
jest.mock('../../../assets/images/warning_dials.svg', () => 'warning-dials.svg');
jest.mock('../../../assets/images/FLIP CARD.svg', () => 'flip-icon.svg');
jest.mock('../../../assets/css/ProductAssessment.scss', () => ({}));



jest.mock("@amcharts/amcharts5", () => {
  return {
    Root: {
      new: jest.fn().mockReturnValue({
        setThemes: jest.fn(),
        container: {
          children: {
            push: jest.fn().mockReturnValue({
              children: {
                unshift: jest.fn(),
              },
              series: {
                push: jest.fn().mockReturnValue({
                  set: jest.fn(),
                  ticks: { template: { set: jest.fn() } },
                  labels: { template: { set: jest.fn() } },
                  slices: { template: { set: jest.fn() } },
                  data: { setAll: jest.fn() }
                }),
              },
              seriesContainer: {
                children: {
                  push: jest.fn()
                }
              }
            })
          }
        },
        _logo: { dispose: jest.fn() },
        dispose: jest.fn()
      })
    },
    Label: { new: jest.fn() },
    Picture: { new: jest.fn() },
    Tooltip: { new: jest.fn() },
    ColorSet: { new: jest.fn() },
    color: jest.fn(),
    percent: jest.fn(),
    p50: 50
  };
});

jest.mock("@amcharts/amcharts5/percent", () => ({
  PieChart: { new: jest.fn() },
  PieSeries: { new: jest.fn() }
}));

jest.mock("@amcharts/amcharts5/themes/Animated", () => ({
  new: jest.fn()
}));


const mockSeries0 = [
  { colors: '#00FF00', dialsIndicator: 'A', rangeIndicator: 10 },
  { colors: 'INVALID', dialsIndicator: 'B', rangeIndicator: 20 }, 
  { colors: undefined, dialsIndicator: 'C', rangeIndicator: 30 } 
];

const mockSeries1 = [
  { colors_series1: '#FF0000', dialsIndicator: 'X', rangeIndicator: 50 },
  { colors_series1: 'BADCOLOR', dialsIndicator: 'Y', rangeIndicator: 60 }
];

const MockDescriptionComponent = () => <div>Mock Description Text</div>;

const defaultProps: PieChartDialsProps = {
  chartDivIndex: "1",
  title: "Test Chart Title",
  sub_title: "Good",
  pie_chart_percentage: "85",
  data_series0: mockSeries0 as any,
  data_series1: mockSeries1 as any,
  flipcard_description: MockDescriptionComponent,
  selectedpiechart: "selected"
};

describe('PieChartDials Component', () => {

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  
  
  test('renders the flip card structure correctly', () => {
    render(<PieChartDials {...defaultProps} />);
    
    
    expect(screen.getByText('Flip card')).toBeInTheDocument(); 
    
    
    expect(screen.getByText('Test Chart Title')).toBeInTheDocument();
    
    
    expect(screen.getByText('Mock Description Text')).toBeInTheDocument();
    
    
    const flipIcon = screen.getByAltText('flip icon');
    expect(flipIcon).toBeInTheDocument();
    expect(flipIcon).toHaveAttribute('src', 'flip-icon.svg');
    
    
    expect(screen.getByText('Click on the dial to flip')).toBeInTheDocument();
  });

  test('applies correct border style when selected', () => {
    render(<PieChartDials {...defaultProps} />);
    
    const backCard = screen.getByText('Mock Description Text').parentElement;
    expect(backCard).toHaveStyle('border: 2px solid #000');
  });

  test('applies correct border style when NOT selected', () => {
    render(<PieChartDials {...defaultProps} selectedpiechart={undefined} />);
    const backCard = screen.getByText('Mock Description Text').parentElement;
    expect(backCard).toHaveStyle('border: 1px solid #B4B4B4');
  });


  

  test('PieChart determines "Good/Excellent" image source correctly', () => {
    
    render(<PieChart {...defaultProps} sub_title="Excellent" />);
    
    const am5Picture = require("@amcharts/amcharts5").Picture;
    expect(am5Picture.new).toHaveBeenCalledWith(
        expect.anything(), 
        expect.objectContaining({ src: 'great-job.svg' })
    );
  });

  test('PieChart determines "Poor/Very Poor" image source correctly', () => {
    render(<PieChart {...defaultProps} sub_title="Very poor" />);
    const am5Picture = require("@amcharts/amcharts5").Picture;
    
    expect(am5Picture.new).toHaveBeenCalledWith(
        expect.anything(), 
        expect.objectContaining({ src: 'warning-dials.svg' })
    );
  });

  test('PieChart uses empty image source for unknown subtitles', () => {
    render(<PieChart {...defaultProps} sub_title="Average" />);
    const am5Picture = require("@amcharts/amcharts5").Picture;
    
    expect(am5Picture.new).toHaveBeenCalledWith(
        expect.anything(), 
        expect.objectContaining({ src: '' })
    );
  });

  test('Handles chart percentage formatting for "Packaging Circularity"', () => {
    render(<PieChart {...defaultProps} title="Packaging Circularity" pie_chart_percentage="50" />);
    const am5Label = require("@amcharts/amcharts5").Label;

    
    
    const calls = am5Label.new.mock.calls;
    const lastCallConfig = calls[calls.length - 1][1]; 
    expect(lastCallConfig.text).toContain('50[/]');
  });

  test('Handles chart percentage formatting for "Green Chemistry"', () => {
      render(<PieChart {...defaultProps} title="Green Chemistry" pie_chart_percentage="75" />);
      const am5Label = require("@amcharts/amcharts5").Label;
      
      const calls = am5Label.new.mock.calls;
      const lastCallConfig = calls[calls.length - 1][1]; 
      expect(lastCallConfig.text).toContain('75[/]');
  });

  test('Handles chart percentage formatting for generic titles (adds %)', () => {
    render(<PieChart {...defaultProps} title="Carbon Footprint" pie_chart_percentage="30" />);
    const am5Label = require("@amcharts/amcharts5").Label;
    
    const calls = am5Label.new.mock.calls;
    const lastCallConfig = calls[calls.length - 1][1]; 
    expect(lastCallConfig.text).toContain('30%[/]');
  });
  
  test('Handles N/A percentage correctly', () => {
      render(<PieChart {...defaultProps} title="Carbon Footprint" pie_chart_percentage="N/A" />);
      const am5Label = require("@amcharts/amcharts5").Label;
      
      const calls = am5Label.new.mock.calls;
      const lastCallConfig = calls[calls.length - 1][1];
      expect(lastCallConfig.text).toContain('N/A[/]');
  });

  test('Handles missing data series gracefully (Coverage for fallback [])', () => {
    render(<PieChart {...defaultProps} data_series0={undefined} data_series1={undefined} />);
    
    
    const am5Root = require("@amcharts/amcharts5").Root;
    expect(am5Root.new).toHaveBeenCalled();
  });

  
  
  

  test('Processes colors correctly including fallbacks', () => {
    render(<PieChart {...defaultProps} />);
    
    const am5Color = require("@amcharts/amcharts5").color;
    
    
    
    
    
    
    
    
    

    expect(am5Color).toHaveBeenCalledWith('#00FF00');
    expect(am5Color).toHaveBeenCalledWith('#FF0000');
    
    expect(am5Color).toHaveBeenCalledWith('#000000');
  });

  
  
  test('Disposes chart root on unmount', () => {
    const { unmount } = render(<PieChart {...defaultProps} />);
    
    
    const am5Root = require("@amcharts/amcharts5").Root;
    
    const mockRootInstance = am5Root.new.mock.results[0].value;
    
    unmount();
    
    expect(mockRootInstance.dispose).toHaveBeenCalled();
  });
});