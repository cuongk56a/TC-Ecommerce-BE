import express from 'express';
import { appConfigs } from '../../config/config';
import { userRoute } from '../../modules/user/user.route';
import { organizationRoute } from '../../modules/organization/organization.route';
import { locationRoute } from '../../modules/location/location.route';
import { authRoute } from '../../modules/auth/auth.route';
import { roleRoute } from '../../modules/role/role.route';
import { activityLogRoute } from '../../modules/activityLog/activityLog.route';
import { brandRoute } from '../../modules/brand/brand.route';
import { categoryRoute } from '../../modules/category/category.route';
import { unitRoute } from '../../modules/product/unit/unit.route';
import { productRoute } from '../../modules/product/product/product.route';
import { imageRoute } from '../../modules/image/image.route';
import { addressRoute } from '../../modules/address/address.route';

const router = express.Router();

const defaultRoutes: any[] = [
    {
        path: '/user',
        route: userRoute
    },
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/organization',
        route: organizationRoute
    },
    {
        path: '/location',
        route: locationRoute
    },
    {
        path: '/role',
        route: roleRoute
    },
    {
        path: '/activity-log',
        route: activityLogRoute
    },
    {
        path: '/brand',
        route: brandRoute,
    },
    {
        path: '/category',
        route: categoryRoute,
    },
    {
        path: '/unit',
        route: unitRoute,
    },
    {
        path: '/product',
        route: productRoute,
    },
    {
        path: '/image',
        route: imageRoute,
    },
    {
        path: '/address',
        route: addressRoute,
    },
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