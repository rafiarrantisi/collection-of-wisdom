import { createRoot } from 'react-dom/client';
import './styles/fonts';
import './styles/tokens.css';
import './print/print.css';
import './book/book.css';
import { FlipBook } from './book/FlipBook';

// No StrictMode: the flip engine takes ownership of the page DOM once, on mount.
createRoot(document.getElementById('root')!).render(<FlipBook />);
