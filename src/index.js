import './assets/styles/styles.scss';
import PageList from './components/PageList';
import PageDetail from './components/PageDetail';

const app = document.getElementById('app');

// navigation simple (SPA)
const render = () => {
    const path = window.location.hash.substring(1);
    if (path.startsWith('game/')) {
        const gameId = path.split('/')[1];
        PageDetail(app, gameId);
    } else {
        PageList(app);
    }
};

window.addEventListener('hashchange', render);
window.addEventListener('load', render);
