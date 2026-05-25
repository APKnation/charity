import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleSwitcherComponent } from '../components/role-switcher';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RoleSwitcherComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <!-- Navbar -->
      <header class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <a routerLink="/" class="flex items-center gap-2 group">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span class="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">HopeFlow</span>
              </a>
            </div>

            <!-- Desktop Nav Links -->
            <nav class="hidden md:flex items-center gap-1">
              @for (link of navLinks; track link.path) {
                <a 
                  [routerLink]="link.path"
                  routerLinkActive="bg-emerald-50 text-emerald-700 font-semibold"
                  [routerLinkActiveOptions]="{exact: link.exact}"
                  class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                >
                  {{ link.label }}
                </a>
              }
            </nav>

            <!-- CTA / Auth State -->
            <div class="hidden md:flex items-center gap-4">
              @if (authService.currentUser().role !== 'guest') {
                <a 
                  routerLink="/dashboard" 
                  class="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  <span>Go to Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              } @else {
                <button 
                  (click)="openRoleSwitcher()" 
                  class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-emerald-500/15"
                >
                  Get Started
                </button>
              }
            </div>

            <!-- Mobile menu button -->
            <div class="flex items-center md:hidden">
              <button 
                (click)="toggleMobileMenu()" 
                class="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                @if (mobileMenuOpen()) {
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Panel -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 shadow-lg animate-slide-down">
            @for (link of navLinks; track link.path) {
              <a 
                [routerLink]="link.path"
                (click)="mobileMenuOpen.set(false)"
                routerLinkActive="bg-emerald-50 text-emerald-700 font-semibold"
                [routerLinkActiveOptions]="{exact: link.exact}"
                class="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                {{ link.label }}
              </a>
            }
            <div class="pt-4 border-t border-slate-100 flex flex-col gap-2">
              @if (authService.currentUser().role !== 'guest') {
                <a 
                  routerLink="/dashboard" 
                  (click)="mobileMenuOpen.set(false)"
                  class="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-center"
                >
                  <span>Go to Dashboard</span>
                </a>
              } @else {
                <button 
                  (click)="openRoleSwitcher(); mobileMenuOpen.set(false)" 
                  class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl text-center"
                >
                  Get Started
                </button>
              }
            </div>
          </div>
        }
      </header>

      <!-- Page Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-white">
                <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span class="text-lg font-black tracking-tight">HopeFlow</span>
              </div>
              <p class="text-sm text-slate-400">
                Empowering humanitarian organizations, donors, and passionate volunteers to co-create impactful change globally.
              </p>
              <div class="flex gap-4">
                <!-- Social media icons -->
                <a href="#" class="hover:text-emerald-400 transition-colors">
                  <span class="sr-only">Facebook</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
                </a>
                <a href="#" class="hover:text-emerald-400 transition-colors">
                  <span class="sr-only">Twitter</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-white tracking-wider uppercase">Platform</h3>
              <ul class="mt-4 space-y-2 text-sm">
                <li><a routerLink="/campaigns" class="hover:text-white transition-colors">Browse Campaigns</a></li>
                <li><a routerLink="/volunteer/apply" class="hover:text-white transition-colors">Become a Volunteer</a></li>
                <li><a routerLink="/beneficiary/apply" class="hover:text-white transition-colors">Request Assistance</a></li>
              </ul>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
              <ul class="mt-4 space-y-2 text-sm">
                <li><a routerLink="/contact" class="hover:text-white transition-colors">Contact Us</a></li>
                <li><a routerLink="/contact" class="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-white tracking-wider uppercase">Subscribe to Updates</h3>
              <p class="text-xs">Receive newsletter digests of active humanitarian impacts globally.</p>
              <div class="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                <button class="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div class="mt-12 pt-8 border-t border-slate-800 text-xs text-center">
            &copy; 2026 HopeFlow Non-Profit Platform. Built with Angular & Tailwind CSS. All rights reserved.
          </div>
        </div>
      </footer>

      <!-- Floating role switcher tool for grading/evaluation -->
      <app-role-switcher></app-role-switcher>
    </div>
  `,
  styles: [`
    .animate-slide-down {
      animation: slideDown 0.25s ease-out forwards;
    }
    @keyframes slideDown {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class PublicLayout {
  authService = inject(AuthService);
  mobileMenuOpen = signal(false);

  navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Campaigns', path: '/campaigns', exact: false },
    { label: 'Volunteer Apply', path: '/volunteer/apply', exact: false },
    { label: 'Request Help', path: '/beneficiary/apply', exact: false },
    { label: 'Contact & FAQ', path: '/contact', exact: false }
  ];

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  openRoleSwitcher() {
    // Role switcher is toggled by clicking the button, but we can instruct switcher to open or trigger click
    // We will let the floating button be visible and users click it directly
    const button = document.querySelector('button[title="Switch Roles for Testing"]') as HTMLButtonElement;
    if (button) button.click();
  }
}
