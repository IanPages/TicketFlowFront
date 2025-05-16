import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./shared/components/home/home.component";
import { RegisterComponent } from "./shared/components/register/register.component";
import { LoginComponent } from "./shared/components/login/login.component";
import { DetailsComponent } from "./shared/components/details/details.component";
import { CatalogComponent } from "./shared/components/catalog/catalog.component";
import { PurchaseComponent } from "./shared/components/purchase/purchase.component";
import { AuthGuard } from "./core/security/auth.guard";
import { EventosComponent } from "./shared/components/admin/eventos/eventos.component";
import { EditComponent as EventoEditComponent} from "./shared/components/admin/eventos/edit/edit.component";
import { EditComponent as SalaEditComponent} from "./shared/components/admin/salas/edit/edit.component";
import { AddComponent as EventoAddComponent } from "./shared/components/admin/eventos/add/add.component";
import { AddComponent as SalaAddComponent } from "./shared/components/admin/salas/add/add.component";
import { AdminGuard } from "./core/security/admin.guard";
import path from "path";
import { DashboardComponent } from "./shared/components/admin/dashboard/dashboard.component";
import { ListComponent } from "./shared/components/admin/salas/list/list.component";
import { SeleccionarSeatsComponent } from "./shared/components/seleccionar-seats/seleccionar-seats.component";
import { PaymentSuccessfulComponent } from "./shared/components/payment-successful/payment-successful.component";
import { PaymentCancelComponent } from "./shared/components/payment-cancel/payment-cancel.component";
import { AboutusComponent } from "./shared/components/enterprise/aboutus/aboutus.component";
import { JobComponent } from "./shared/components/enterprise/job/job.component";
import { CookiesComponent } from "./shared/components/legal/cookies/cookies.component";
import { PrivacyComponent } from "./shared/components/legal/privacy/privacy.component";
import { ContactComponent } from "./shared/components/enterprise/contact/contact.component";
import { BookingComponent } from "./shared/components/booking/booking.component";

export const routes: Routes = [
    
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'details/:id', component: DetailsComponent},
    { path: 'eventos', component: CatalogComponent, canActivate: [AuthGuard]}, 
    { path: 'tickets/:id', component: PurchaseComponent, canActivate: [AuthGuard]},
    { path: 'seleccionar-seats', component: SeleccionarSeatsComponent, canActivate: [AuthGuard]},
    { path: 'payment-success', component: PaymentSuccessfulComponent, canActivate: [AuthGuard]},
    { path: 'payment-cancel', component: PaymentCancelComponent, canActivate: [AuthGuard]},
    { path: 'admin', canActivate: [AdminGuard],
        children:[
            {path: '', component: DashboardComponent},
            {path: 'events', component: EventosComponent},
            {path: 'events/add', component: EventoAddComponent },
            {path: 'events/edit/:id', component: EventoEditComponent },
            {path: 'salas', component: ListComponent},
            {path: 'salas/add', component: SalaAddComponent },
            {path: 'salas/edit/:id', component: SalaEditComponent }
        ]
    },
    {path: 'sobre-nosotros', component: AboutusComponent},
    {path: 'trabaja-con-nosotros', component: JobComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'cookies', component: CookiesComponent},
    {path: 'contacto', component: ContactComponent},
    {path: 'reservas', component: BookingComponent, canActivate:[AuthGuard]},
    {path: '**', redirectTo: '' },
];
