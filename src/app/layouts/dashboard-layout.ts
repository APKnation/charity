import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
import { RoleSwitcherComponent } from '../components/role-switcher';

interface NavItem {
  label: string;
  iconSvg: string;
  roleRequired?: UserRole[];
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RoleSwitcherComponent],
  template: `
    <div class="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <!-- Sidebar Desktop -->
      <aside class="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-6 h-16 border-b border-slate-800/80 bg-slate-950">
          <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span class="text-lg font-bold text-white tracking-tight">HopeFlow</span>
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PORTAL</span>
        </div>

        <!-- Role Badge -->
        <div class="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50">
          <div class="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Active Space</div>
          <div class="flex items-center gap-2.5">
            <span [class]="roleBadgeClass()" class="text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {{ currentUser().role }}
            </span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
          @for (item of filteredLinks(); track item.label) {
            <a 
              (click)="activeTab.set(item.label)"
              [class.bg-slate-800]="activeTab() === item.label"
              [class.text-white]="activeTab() === item.label"
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <span class="w-5 h-5 flex items-center justify-center" [innerHTML]="item.iconSvg"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <!-- User Profile Card -->
        <div class="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <img [src]="currentUser().avatarUrl" alt="Avatar" class="w-10 h-10 rounded-full border border-slate-700 object-cover">
            <div class="flex-grow min-w-0">
              <div class="text-sm font-semibold text-white truncate">{{ currentUser().name }}</div>
              <div class="text-xs text-slate-500 truncate">{{ currentUser().email }}</div>
            </div>
          </div>
          <button 
            (click)="logout()" 
            class="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-400 rounded-xl text-xs font-semibold transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      <!-- Sidebar Mobile Drawer -->
      @if (mobileDrawerOpen()) {
        <div class="fixed inset-0 z-40 flex lg:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="mobileDrawerOpen.set(false)">
          <div class="relative flex flex-col w-64 bg-slate-950 text-slate-400 h-full border-r border-slate-800 shadow-2xl" (click)="$event.stopPropagation()">
            <!-- Close Button -->
            <button 
              (click)="mobileDrawerOpen.set(false)" 
              class="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Mobile Drawer Logo -->
            <div class="flex items-center gap-3 px-6 h-16 border-b border-slate-800/80">
              <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span class="text-lg font-bold text-white">HopeFlow</span>
            </div>

            <!-- Mobile Navigation -->
            <nav class="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
              @for (item of filteredLinks(); track item.label) {
                <a 
                  (click)="activeTab.set(item.label); mobileDrawerOpen.set(false)"
                  [class.bg-slate-800]="activeTab() === item.label"
                  [class.text-white]="activeTab() === item.label"
                  class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <span class="w-5 h-5 flex items-center justify-center" [innerHTML]="item.iconSvg"></span>
                  <span>{{ item.label }}</span>
                </a>
              }
            </nav>

            <!-- Mobile User Profile -->
            <div class="p-4 border-t border-slate-800 flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <img [src]="currentUser().avatarUrl" alt="Avatar" class="w-10 h-10 rounded-full border border-slate-700 object-cover">
                <div>
                  <div class="text-sm font-semibold text-white">{{ currentUser().name }}</div>
                  <div class="text-xs text-slate-500">{{ currentUser().email }}</div>
                </div>
              </div>
              <button 
                (click)="logout(); mobileDrawerOpen.set(false)" 
                class="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-400 rounded-xl text-xs font-semibold transition-colors duration-200"
              >
                <span>Exit Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Main Panel -->
      <div class="flex-grow flex flex-col h-full overflow-hidden">
        <!-- Header -->
        <header class="flex items-center justify-between px-6 h-16 bg-white border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <button 
              (click)="mobileDrawerOpen.set(true)" 
              class="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 class="text-lg font-bold text-slate-800">{{ activeTab() }}</h2>
          </div>

          <div class="flex items-center gap-4">
            <!-- Back to website link -->
            <a routerLink="/" class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Website</span>
            </a>

            <!-- Notification bell -->
            <div class="relative">
              <button 
                (click)="toggleNotifications()"
                class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>

              <!-- Notifications Menu -->
              @if (notificationsOpen()) {
                <div class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4">
                  <h4 class="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                    <span>Notifications</span>
                    <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">2 New</span>
                  </h4>
                  <div class="space-y-3 max-h-60 overflow-y-auto">
                    <div class="flex gap-3 text-xs leading-normal hover:bg-slate-50 p-1.5 rounded-lg">
                      <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <div class="font-medium text-slate-800">New donation received!</div>
                        <div class="text-slate-400 text-[10px] mt-0.5">David Beckham donated $50.</div>
                      </div>
                    </div>
                    <div class="flex gap-3 text-xs leading-normal hover:bg-slate-50 p-1.5 rounded-lg">
                      <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <div class="font-medium text-slate-800">Help Request Approved</div>
                        <div class="text-slate-400 text-[10px] mt-0.5">Leg surgery request approved by Admin.</div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Profile Info Small -->
            <div class="flex items-center gap-2 border-l border-slate-200 pl-4">
              <img [src]="currentUser().avatarUrl" alt="Avatar" class="w-8 h-8 rounded-full border object-cover">
              <span class="hidden md:inline-block text-xs font-semibold text-slate-700 truncate max-w-[100px]">{{ currentUser().name }}</span>
            </div>
          </div>
        </header>

        <!-- Router Outlet Content Frame -->
        <main class="flex-grow p-6 overflow-y-auto">
          <!-- Pass active tab to children via simple custom state if needed, or children read AuthService directly -->
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Floating role switcher tool for grading/evaluation -->
      <app-role-switcher></app-role-switcher>
    </div>
  `,
  styles: [``]
})
export class DashboardLayout {
  authService = inject(AuthService);
  router = inject(Router);
  
  currentUser = this.authService.currentUser;
  mobileDrawerOpen = signal(false);
  notificationsOpen = signal(false);

  // Define dynamic active tab.
  activeTab = this.authService.activeDashboardTab;

  // Dynamic Sidebar Navigation based on roles
  private readonly allNavLinks: NavItem[] = [
    {
      label: 'Overview',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>`,
    },
    {
      label: 'Campaigns Panel',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
      roleRequired: ['super-admin', 'admin', 'campaign-manager']
    },
    {
      label: 'Donation Audits',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
      roleRequired: ['super-admin', 'admin', 'finance-officer']
    },
    {
      label: 'Volunteers Panel',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`,
      roleRequired: ['super-admin', 'admin', 'campaign-manager']
    },
    {
      label: 'Beneficiary Requests',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
      roleRequired: ['super-admin', 'admin']
    },
    {
      label: 'My Donations',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`,
      roleRequired: ['donor']
    },
    {
      label: 'Help Requests',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
      roleRequired: ['beneficiary']
    },
    {
      label: 'Volunteer Schedule',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
      roleRequired: ['volunteer']
    }
  ];

  filteredLinks = computed(() => {
    const role = this.currentUser().role;
    return this.allNavLinks.filter(item => {
      if (!item.roleRequired) return true;
      return item.roleRequired.includes(role);
    });
  });

  roleBadgeClass = computed(() => {
    const role = this.currentUser().role;
    switch(role) {
      case 'super-admin': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'admin': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'finance-officer': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'campaign-manager': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'volunteer': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'donor': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'beneficiary': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  });

  toggleNotifications() {
    this.notificationsOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
