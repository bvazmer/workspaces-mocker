import App from './App';
import r2wc from '@r2wc/react-to-web-component';
import { initMocks } from '@/mocks/browser';

const DashboardWebComponent = r2wc(App, { props: ['text'] });

export { initMocks, DashboardWebComponent };
