import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    {
                        path: 'home',
                        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'about',
                        loadChildren: () => import('./about/about.module').then((m) => m.AboutModule),
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'users',
                        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
                        data: { permission: 'Pages.Users' },
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'roles',
                        loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
                        data: { permission: 'Pages.Roles' },
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'tenants',
                        loadChildren: () => import('./tenants/tenants.module').then((m) => m.TenantsModule),
                        data: { permission: 'Pages.Tenants' },
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'update-password',
                        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
                        canActivate: [AppRouteGuard]
                    },
                    { path: 'countries', loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule) },
                    { path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule) },
                    { path: 'links', loadChildren: () => import('./links/links.module').then(m => m.LinksModule) },
                    { path: 'locationselector', loadChildren: () => import('./locationselector/locationselector.module').then(m => m.LocationSelectorModule) },
                    { path: 'locationselector', loadChildren: () => import('./locationselector/locationselector.module').then(m => m.LocationSelectorModule) },
                    { path: 'active-links', loadChildren: () => import('./active-links/active-links.module').then(m => m.ActiveLinksModule) },
                ]
            },
            { path: 'add-link', loadChildren: () => import('./add-link/add-link.module').then(m => m.AddLinkModule) },
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
