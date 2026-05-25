import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating toggle button -->
    <div class="fixed bottom-6 right-6 z-50">
      <button 
        (click)="toggleOpen()" 
        class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-full shadow-2xl hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 border border-white/20"
        title="Switch Roles for Testing"
      >
        <!-- Gear/User Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-sm font-semibold tracking-wide">Test Roles</span>
      </button>

      <!-- Glassmorphic Panel -->
      @if (isOpen()) {
        <div class="absolute bottom-16 right-0 w-80 max-h-[500px] overflow-y-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 text-white animate-fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 class="font-bold text-lg text-emerald-400">Simulator Roles</h3>
            <button (click)="toggleOpen()" class="text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p class="text-xs text-slate-400 mb-4">Click a role to impersonate. The UI and navigation will adjust dynamically.</p>
          
          <div class="space-y-2">
            @for (role of rolesList; track role.id) {
              <button 
                (click)="selectRole(role.id)"
                [class.ring-2]="authService.currentUser().role === role.id"
                [class.ring-emerald-500]="authService.currentUser().role === role.id"
                class="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-left border border-white/5 shadow-sm group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden border border-white/15">
                    <img [src]="role.avatar" [alt]="role.name" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <div class="text-xs font-semibold group-hover:text-emerald-400 transition-colors">{{ role.label }}</div>
                    <div class="text-[10px] text-slate-400">{{ role.name }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span [class]="role.badgeClass" class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {{ role.id }}
                  </span>
                  @if (authService.currentUser().role === role.id) {
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  }
                </div>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-spin-slow {
      animation: spin 8s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-fade-in {
      animation: fadeIn 0.25s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class RoleSwitcherComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isOpen = signal(false);

  rolesList: Array<{ id: UserRole; label: string; name: string; avatar: string; badgeClass: string }> = [
    { 
      id: 'guest', 
      label: 'Guest / Public User', 
      name: 'Anonymous Visitor', 
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-slate-700 text-slate-200'
    },
    { 
      id: 'donor', 
      label: 'Donor', 
      name: 'Bill Gates', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-indigo-600 text-indigo-100'
    },
    { 
      id: 'volunteer', 
      label: 'Volunteer', 
      name: 'David Beckham', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-blue-600 text-blue-100'
    },
    { 
      id: 'beneficiary', 
      label: 'Beneficiary', 
      name: 'Jane Doe', 
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-amber-600 text-amber-100'
    },
    { 
      id: 'campaign-manager', 
      label: 'Campaign Manager', 
      name: 'Emma Watson', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-purple-600 text-purple-100'
    },
    { 
      id: 'finance-officer', 
      label: 'Finance Officer', 
      name: 'Robert Kiyosaki', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-emerald-600 text-emerald-100'
    },
    { 
      id: 'admin', 
      label: 'Administrator', 
      name: 'Sarah Connor', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-rose-600 text-rose-100'
    },
    { 
      id: 'super-admin', 
      label: 'Super Admin', 
      name: 'Alex Johnson', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      badgeClass: 'bg-red-600 text-red-100'
    }
  ];

  toggleOpen() {
    this.isOpen.update(v => !v);
  }

  selectRole(role: UserRole) {
    this.authService.setRole(role);
    this.isOpen.set(false);
    
    // Redirect logic:
    if (role === 'guest') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
