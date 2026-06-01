import cors from 'cors';

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173', // si usás Vite
        'https://obligatorio-fullstack-six.vercel.app/' // para producción
    ],
    credentials: true
}));