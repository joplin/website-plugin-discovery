import './style.scss';

// Make bootstrap globally available to all other scripts.
// This prevents us from importing bootstrap multiple times (which
// causes bootstrap to re-initialize multiple times, breaking some
// functionality).
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
