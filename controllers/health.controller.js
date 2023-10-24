import mongoose from 'mongoose';

export const check = (req, res) => {
    const dbHealthy = mongoose.connection.readyState === 1;

    if (!dbHealthy)
        return res.status(500).json({ status: 'Database connection failed' });

    return res.status(200).json({ status: 'OK' });
};
