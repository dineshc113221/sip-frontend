import ReactGA4 from 'react-ga4';
import { TrackGoogleAnalyticsEvent } from '../TrackGoogleAnalyticsEvent';

jest.mock('react-ga4');

describe('Test googleAnalyticsEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GA_TAG_ID = 'Test';
  });
  it('should publish event', () => {
    TrackGoogleAnalyticsEvent('', '', '');
    expect(ReactGA4.initialize).toHaveBeenCalledWith('Test');
  }, 8000);

  it('should return error', () => {
    ReactGA4.event = jest.fn().mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    TrackGoogleAnalyticsEvent('', '', '');
    expect(ReactGA4.initialize).toHaveBeenCalledTimes(1);
  }, 8000);
});
