import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
const app = express();
// Security: Remove Express version disclosure
app.disable('x-powered-by');
const PORT = process.env.PORT || 3002;
// Validación de variables de entorno de Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Faltan variables de entorno de Supabase');
}
// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', database: 'Supabase' });
});
// Test Supabase connection with oferta_academica table
app.get('/api/test', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('oferta_academica')
            .select('*')
            .limit(5);
        if (error)
            throw error;
        res.json({
            message: 'Supabase connected successfully',
            count: data?.length || 0,
            sample: data,
        });
    }
    catch (error) {
        console.error('Database error:', error);
        res
            .status(500)
            .json({ error: 'Database connection failed', details: error });
    }
});
// Get all academic offerings
app.get('/api/oferta-academica', async (req, res) => {
    try {
        const { data, error } = await supabase.from('oferta_academica').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Supabase Backend running on port ${PORT}`);
    console.log(`🔗 Health: http://localhost:${PORT}/health`);
    console.log(`📊 Test: http://localhost:${PORT}/api/test`);
    console.log(`📚 Data: http://localhost:${PORT}/api/oferta-academica`);
});
