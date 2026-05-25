import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout';
import { Home } from './pages/public/home';
import { Campaigns } from './pages/public/campaigns';
import { CampaignDetail } from './pages/public/campaign-detail';
import { VolunteerApply } from './pages/public/volunteer-apply';
import { BeneficiaryRequestPage } from './pages/public/beneficiary-request';
import { Contact } from './pages/public/contact';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'campaigns', component: Campaigns },
      { path: 'campaign/:id', component: CampaignDetail },
      { path: 'volunteer/apply', component: VolunteerApply },
      { path: 'beneficiary/request', component: BeneficiaryRequestPage },
      { path: 'contact', component: Contact }
    ]
  },
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: 'dashboard', component: Dashboard }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
