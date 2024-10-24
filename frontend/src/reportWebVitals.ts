// import { ReportHandler } from 'web-vitals';

// const reportWebVitals = (onPerfEntry?: ReportHandler) => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       getCLS(onPerfEntry);
//       getFID(onPerfEntry);
//       getFCP(onPerfEntry);
//       getLCP(onPerfEntry);
//       getTTFB(onPerfEntry);
//     });
//   }
// };

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

// Define a type for the metric object
type Metric = {
    name: string;
    value: number;
};

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onCLS(onPerfEntry); // Report Cumulative Layout Shift
        onFID(onPerfEntry); // Report First Input Delay
        onFCP(onPerfEntry); // Report First Contentful Paint
        onLCP(onPerfEntry); // Report Largest Contentful Paint
        onTTFB(onPerfEntry); // Report Time to First Byte
    }
};

export default reportWebVitals;

