import initializeUserRoutes from './utilisateur.routes.js';
import initializeAdminRoutes from './Admin.routes.js';
import initializeRoleRoutes from './Role.routes.js';
import initializeTicketRoutes from './billet.routes.js';
import initializeTravelRoutes from './voyage.routes.js';

const initializeRoutes = {
  initializeUserRoutes,
  initializeAdminRoutes,
  initializeRoleRoutes,
  initializeTicketRoutes,
  initializeTravelRoutes
};

export default initializeRoutes;
