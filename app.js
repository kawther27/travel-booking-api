import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './app/middlewares/errorMiddleware.js';
import AppError from './app/middlewares/appErrorMiddleware.js';

const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb',
}));
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: {
        status: "fail",
        message: "Too many requests from this IP, please try again in an hour!",
    },
});

app.use('/api', limiter);

// Initialize routes
import initializeRoutes from './app/Routes/index.routes.js';
initializeRoutes.initializeAdminRoutes(app, '/api/admin');
initializeRoutes.initializeUserRoutes(app, '/api/user');
initializeRoutes.initializeRoleRoutes(app, '/api/role');
initializeRoutes.initializeTicketRoutes(app, '/api/ticket');
initializeRoutes.initializeTravelRoutes(app, '/api/travel');

// Handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrorHandler);

export default app;
