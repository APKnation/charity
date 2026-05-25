import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-volunteer-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-xl mx-auto px-4 py-12">
      <div class="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-1.5">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
            Join the Team
          </span>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Volunteer Application</h1>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Help coordinate logistics, build infrastructure, or package food shipments.</p>
        </div>

        @if (submitted()) {
          <!-- Success State -->
          <div class="py-6 flex flex-col items-center text-center space-y-4 animate-scale-up">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-800 text-base">Application Received!</h3>
              <p class="text-xs text-slate-400 max-w-xs leading-relaxed">
                Thank you, <strong>{{ name }}</strong>. Our regional coordinator will review your skills and email you at <strong>{{ email }}</strong> shortly.
              </p>
            </div>
            <div class="pt-4 flex gap-3 w-full">
              <a routerLink="/" class="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold text-center">Go to Home</a>
              <button (click)="resetForm()" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Apply Again</button>
            </div>
          </div>
        } @else {
          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs font-semibold text-slate-600">
            <!-- Name -->
            <div>
              <label class="block text-slate-500 mb-1.5">Full Name</label>
              <input 
                type="text" 
                [(ngModel)]="name" 
                name="name" 
                required 
                placeholder="e.g. David Beckham" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
              >
            </div>

            <!-- Email -->
            <div>
              <label class="block text-slate-500 mb-1.5">Email Address</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                required 
                placeholder="e.g. volunteer&#64;gmail.com" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
              >
            </div>

            <!-- Targeted Campaign dropdown -->
            <div>
              <label class="block text-slate-500 mb-1.5">Assign to Campaign (Optional)</label>
              <select 
                [(ngModel)]="campaignId" 
                name="campaignId" 
                class="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none"
              >
                <option value="0">General Support (All Campaigns)</option>
                @for (c of activeCampaigns(); track c.id) {
                  <option [value]="c.id">{{ c.title }}</option>
                }
              </select>
            </div>

            <!-- Skills selector pills -->
            <div>
              <label class="block text-slate-500 mb-2">My Skills / Expertise</label>
              <div class="flex flex-wrap gap-2">
                @for (skill of skillsList; track skill) {
                  <button 
                    type="button"
                    (click)="toggleSkill(skill)"
                    [class.bg-emerald-50]="selectedSkills().includes(skill)"
                    [class.text-emerald-700]="selectedSkills().includes(skill)"
                    [class.border-emerald-500]="selectedSkills().includes(skill)"
                    [class.bg-slate-50]="!selectedSkills().includes(skill)"
                    [class.text-slate-600]="!selectedSkills().includes(skill)"
                    [class.border-slate-200]="!selectedSkills().includes(skill)"
                    class="px-3.5 py-2 rounded-xl border text-[11px] font-bold transition-all duration-200"
                  >
                    {{ skill }}
                  </button>
                }
              </div>
            </div>

            <!-- Brief explanation -->
            <div>
              <label class="block text-slate-500 mb-1.5">Why do you want to join HopeFlow? (Optional)</label>
              <textarea 
                [(ngModel)]="motivation" 
                name="motivation" 
                rows="3" 
                placeholder="Share your motivation..." 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              [disabled]="!name || !email || selectedSkills().length === 0"
              class="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Submit Application
            </button>
          </form>
        }

      </div>
    </div>
  `,
  styles: [`
    .animate-scale-up {
      animation: scaleUp 0.3s ease-out forwards;
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class VolunteerApply {
  route = inject(ActivatedRoute);
  stateService = inject(StateService);
  authService = inject(AuthService);

  name = '';
  email = '';
  campaignId = '0';
  motivation = '';
  selectedSkills = signal<string[]>([]);
  submitted = signal(false);

  skillsList = ['Logistics', 'Construction', 'Teaching', 'Computers', 'Food Packaging', 'Healthcare', 'Translation', 'Social Media'];

  activeCampaigns = computed(() =>
    this.stateService.campaigns().filter(c => c.status === 'active')
  );

  constructor() {
    // Read campaignId from query query parameters if present
    this.route.queryParams.subscribe(params => {
      const campIdStr = params['campaignId'];
      if (campIdStr) {
        this.campaignId = campIdStr;
      }
    });

    // Auto-fill logged in user info if volunteer
    const user = this.authService.currentUser();
    if (user.role === 'volunteer' || user.role === 'donor') {
      this.name = user.name;
      this.email = user.email;
    }
  }

  toggleSkill(skill: string) {
    if (this.selectedSkills().includes(skill)) {
      this.selectedSkills.update(list => list.filter(s => s !== skill));
    } else {
      this.selectedSkills.update(list => [...list, skill]);
    }
  }

  onSubmit() {
    if (this.name && this.email && this.selectedSkills().length > 0) {
      const campId = parseInt(this.campaignId);
      this.stateService.applyAsVolunteer(
        isNaN(campId) ? 1 : campId,
        this.name,
        this.email,
        this.selectedSkills()
      );
      this.submitted.set(true);
    }
  }

  resetForm() {
    this.submitted.set(false);
    this.name = '';
    this.email = '';
    this.campaignId = '0';
    this.motivation = '';
    this.selectedSkills.set([]);
  }
}
