import ReactGA4 from 'react-ga4';

export const TrackGoogleAnalyticsEvent = async (
    category,
    event_name,
    data
  ) => {
       try {
         if (`${process.env.GA_TAG_ID}`) {
           ReactGA4.initialize(`${process.env.GA_TAG_ID}`);
   
        const event_params = {
          category,
          ...data,
        };
   
        // Send GA4 Event
        ReactGA4.event(event_name, event_params);
      }
    } catch (error) {
      console.error('Error in TrackGoogleAnalyticsEvent:', error);
    }
  };