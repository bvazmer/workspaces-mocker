import App from './App';
import r2wc from '@r2wc/react-to-web-component';

const MockerWC = r2wc(App, { props: ['text'] });

export default MockerWC;
