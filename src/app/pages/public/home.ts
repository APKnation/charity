import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { CampaignCardComponent } from '../../components/campaign-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CampaignCardComponent],
  template: `
    <div class="space-y-16 pb-16">
      
      <!-- HERO SECTION -->
      <section class="relative bg-slate-900 overflow-hidden py-20 lg:py-28 text-white">
        <!-- Background graphics -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-30"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Hero Left: Content -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Join the Movement
              </span>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                Empower Communities, <br>
                <span class="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Create Real Impact</span>
              </h1>
              <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                HopeFlow connects transparent humanitarian campaigns with passionate donors and dedicated volunteers. Together, we fund water wells, solar classrooms, food security, and immediate disaster relief.
              </p>
              
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a 
                  routerLink="/campaigns" 
                  class="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition-transform hover:-translate-y-0.5"
                >
                  Explore Campaigns
                </a>
                <a 
                  routerLink="/volunteer/apply" 
                  class="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold text-sm border border-white/10 transition-colors"
                >
                  Become a Volunteer
                </a>
              </div>
            </div>

            <!-- Hero Right: Quick Donation Form -->
            <div class="lg:col-span-5">
              <div class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                <!-- Decorative Top Edge Accent -->
                <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-3xl"></div>
                
                <h3 class="font-bold text-lg text-white mb-2">Quick Donation</h3>
                <p class="text-xs text-slate-300 mb-6">Support our general fund for active campaigns.</p>
                
                <div class="space-y-5">
                  <!-- Presets buttons -->
                  <div class="grid grid-cols-3 gap-2">
                    @for (preset of quickAmounts; track preset) {
                      <button 
                        (click)="selectedQuickAmount.set(preset)"
                        [class.bg-emerald-500]="selectedQuickAmount() === preset"
                        [class.text-white]="selectedQuickAmount() === preset"
                        [class.bg-white/5]="selectedQuickAmount() !== preset"
                        [class.hover:bg-white/10]="selectedQuickAmount() !== preset"
                        class="py-2.5 rounded-xl border border-white/5 font-semibold text-xs transition-all duration-200"
                      >
                        TSh {{ preset | number }}
                      </button>
                    }
                  </div>

                  <!-- Dropdown selector for targeting a campaign -->
                  <div>
                    <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Target Campaign</label>
                    <select 
                      [(ngModel)]="selectedCampaignId" 
                      class="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                      @for (camp of activeCampaigns(); track camp.id) {
                        <option [value]="camp.id">{{ camp.title }}</option>
                      }
                    </select>
                  </div>

                  <button 
                    (click)="triggerQuickDonate()"
                    class="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-extrabold text-sm rounded-xl text-center shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    Donate TSh {{ selectedQuickAmount() | number }} Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- STATISTICS STRIP -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          @for (stat of statsList(); track stat.label; let i = $index) {
            <div [class]="i > 1 ? 'pt-6 lg:pt-0' : i === 1 ? 'pt-0 lg:pt-0' : ''" class="flex flex-col justify-center">
              <span class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{{ stat.value }}</span>
              <span class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{{ stat.label }}</span>
            </div>
          }
        </div>
      </section>

      <!-- FEATURED CAMPAIGNS -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Ongoing Work</span>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 mt-1">Active Funding Campaigns</h2>
          </div>
          <a 
            routerLink="/campaigns" 
            class="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
          >
            <span>See All</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (camp of featuredCampaigns(); track camp.id) {
            <app-campaign-card [campaign]="camp"></app-campaign-card>
          }
        </div>
      </section>

      <!-- HOW IT WORKS / TRANSPARENCY -->
      <section class="bg-slate-100/50 py-16 border-y border-slate-200/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div class="text-center max-w-2xl mx-auto space-y-2">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Blueprint</span>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">Radically Transparent Giving</h2>
            <p class="text-slate-400 text-sm">
              We ensure every dollar contributed is recorded, tracked, and visible down to the field distribution.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-base">Secure Gateway Encryptions</h3>
              <p class="text-slate-400 text-xs leading-relaxed">
                Transactions use bank-grade SSL tokens processing credit cards, mobile money, and direct wires securely.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-base">Instant Printable Invoices</h3>
              <p class="text-slate-400 text-xs leading-relaxed">
                Get immediate access to downloadable, tax-deductible PDF receipts for tax returns automatically.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-base">Impact Feeds & Live Updates</h3>
              <p class="text-slate-400 text-xs leading-relaxed">
                Follow campaign builders as they upload field logs, photos, and project milestone approvals on site.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CALL TO ACTION FOR VOLUNTEERING -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-slate-900 rounded-3xl overflow-hidden relative p-8 md:p-12 text-center text-white">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div class="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 class="text-3xl md:text-4xl font-black tracking-tight leading-tight">Want to Make a Hands-on Difference?</h2>
            <p class="text-slate-300 text-sm leading-relaxed">
              Join our active community of 60+ volunteers! Sign up for upcoming packaging sessions, construction coordination logistics, or community educational outreach programs.
            </p>
            <div class="pt-2">
              <a 
                routerLink="/volunteer/apply" 
                class="px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 rounded-2xl font-bold text-sm shadow-xl transition-transform hover:-translate-y-0.5 inline-block"
              >
                Apply as Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [``]
})
export class Home {
  stateService = inject(StateService);

  quickAmounts = [5000, 10000, 25000, 50000, 100000];
  selectedQuickAmount = signal(10000);
  selectedCampaignId = '';

  activeCampaigns = computed(() => 
    this.stateService.campaigns().filter(c => c.status === 'active')
  );

  featuredCampaigns = computed(() => 
    this.activeCampaigns().slice(0, 3)
  );

  statsList = computed(() => {
    const list = this.stateService.campaigns();
    const donations = this.stateService.donations();
    const vList = this.stateService.applications().filter(a => a.status === 'approved');

    const totalRaised = list.reduce((sum, c) => sum + c.currentAmount, 0);
    
    return [
      { label: 'Total Raised', value: `TSh ${totalRaised.toLocaleString()}` },
      { label: 'Active Projects', value: list.filter(c => c.status === 'active').length.toString() },
      { label: 'Registered Volunteers', value: vList.length.toString() },
      { label: 'Individual Donors', value: donations.length.toString() }
    ];
  });

  constructor() {
    // Select first active campaign by default
    const firstActive = this.activeCampaigns()[0];
    if (firstActive) {
      this.selectedCampaignId = firstActive.id.toString();
    }
  }

  triggerQuickDonate() {
    const campId = parseInt(this.selectedCampaignId);
    if (!isNaN(campId)) {
      // Set the amount in the modal if possible.
      // Since modal pulls amount from its internal signal, we can either make it reactive to state service 
      // or open it. Here we just open the modal on the campaign.
      this.stateService.openDonationModal(campId);
    }
  }
}
