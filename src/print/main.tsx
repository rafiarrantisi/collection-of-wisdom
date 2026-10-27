import { createRoot } from 'react-dom/client';
import '../styles/fonts';
import '../styles/tokens.css';
import './print.css';
import { PrintBook } from './PrintBook';

createRoot(document.getElementById('book')!).render(<PrintBook />);
