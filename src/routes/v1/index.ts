import express from 'express';
import { appConfigs } from '../../config/config';
import { userRoute } from '../../modules/user/user.route';
import { organizationRoute } from '../../modules/organization/organization.route';
import { locationRoute } from '../../modules/location/location.route';

const router = express.Router();

const defaultRoutes: any[] = [
    {
        path: '/user',
        route: userRoute
    },
    {
        path: '/organization',
        route: organizationRoute
    },
    {
        path: '/location',
        route: locationRoute
    }
];

const devRoutes: any[] = [
    // routes available only in development mode
    // {
    //   path: '/docs',
    //   route: docsRoute,
    // },
];

defaultRoutes.forEach(route => {
    router.use(route.path, route.route);
});

if (appConfigs.env === 'development') {
    devRoutes.forEach(route => {
      router.use(route.path, route.route);
    });
}

export default router;