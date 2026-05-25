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
<div>

  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- HERO SECTION -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <section class="relative bg-white pt-20 lg:pt-32 pb-20 overflow-hidden">

    <!-- Grid Background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none"></div>

    <div class="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        <!-- LEFT CONTENT -->
        <div class="lg:col-span-7 relative z-20">

          <!-- Label -->
          <span class="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#ffcc00] uppercase mb-6">
            <span class="w-6 h-px bg-[#ffcc00]"></span>
            Tanzania's Trusted Charity Platform
          </span>

          <!-- Main Heading -->
          <h1 class="text-5xl sm:text-6xl lg:text-[68px] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
            Together we can bring<br>
            <span class="text-[#ffcc00]">hope and support</span><br>
            to families in need.
          </h1>

          <!-- Description -->
          <p class="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mb-10">
            Help provide food, education, healthcare, and emergency support through trusted community fundraising campaigns across Tanzania.
          </p>

          <!-- Button -->
          <div class="flex gap-4">
            <a
              routerLink="/campaigns"
              class="px-8 py-4 bg-[#ffcc00] text-slate-900 font-extrabold text-sm hover:bg-[#e6b800] transition-all duration-300 hover:-translate-y-0.5 shadow-xl rounded-xl"
            >
              Start Donating
            </a>
          </div>
        </div>

        <!-- RIGHT CONTENT -->
        <div class="lg:col-span-5 relative mt-12 lg:mt-0">

          <!-- Statistics Box -->
          <div class="bg-[#0d2857] p-10 pt-24 shadow-2xl rounded-2xl relative">
            <div class="grid grid-cols-2 gap-x-6 gap-y-10">
              @for (stat of statsList(); track stat.label) {
                <div class="flex flex-col">
                  <span class="text-[#ffcc00] font-extrabold text-2xl lg:text-3xl leading-none mb-2">
                    {{ stat.value }}
                  </span>

                  <span class="text-blue-200 text-[10px] font-bold uppercase tracking-widest">
                    {{ stat.label }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- Floating Card -->
          <div class="absolute -top-12 lg:-left-12 left-6 w-64 bg-[#ffcc00] px-8 py-10 text-slate-900 shadow-2xl rounded-2xl z-30">

            <p class="text-[13px] font-bold opacity-90 mb-1">
              Every donation matters
            </p>

            <p class="text-[15px] font-bold mb-6">
              Help change lives today.
            </p>

            <a
              routerLink="/campaigns"
              class="block text-[24px] font-black text-slate-900 hover:text-slate-700 transition-colors tracking-tight leading-tight"
            >
              Explore<br>Campaigns
            </a>

          </div>

        </div>
      </div>

    </div>
  </section>


  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- STATISTICS STRIP -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-8
                grid grid-cols-2 lg:grid-cols-4 gap-6 text-center
                divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

      @for (stat of statsList(); track stat.label; let i = $index) {

        <div [class]="i > 1 ? 'pt-6 lg:pt-0' : ''" class="flex flex-col justify-center">

          <span class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            {{ stat.value }}
          </span>

          <span class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
            {{ stat.label }}
          </span>

        </div>

      }

    </div>
  </section>


  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- FEATURED CAMPAIGNS -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">

    <div class="flex items-end justify-between border-b border-slate-200 pb-4">

      <div>
        <span class="text-xs font-bold text-[#0d2857] uppercase tracking-widest">
          Active Campaigns
        </span>

        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 mt-1">
          Support Ongoing Community Projects
        </h2>
      </div>

      <a
        routerLink="/campaigns"
        class="flex items-center gap-1 text-sm font-bold text-[#0d2857] hover:text-[#ffcc00] transition-colors group"
      >
        <span>See All</span>

        <svg xmlns="http://www.w3.org/2000/svg"
             class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>

      </a>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      @for (camp of featuredCampaigns(); track camp.id) {
        <app-campaign-card [campaign]="camp"></app-campaign-card>
      }

    </div>

  </section>


  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- TRANSPARENCY SECTION -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <section class="bg-slate-100/50 py-20 border-y border-slate-200/50">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <div class="text-center max-w-2xl mx-auto space-y-3">

        <span class="text-xs font-bold text-[#0d2857] uppercase tracking-widest">
          Why Choose Us
        </span>

        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
          Safe, Trusted & Transparent Donations
        </h2>

        <p class="text-slate-400 text-sm">
          We make sure every donation is securely managed and clearly tracked from donors to beneficiaries.
        </p>

      </div>


      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Card 1 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">

          <div class="w-10 h-10 rounded-xl bg-[#0d2857] text-[#ffcc00] flex items-center justify-center">

            <svg xmlns="http://www.w3.org/2000/svg"
                 class="w-6 h-6"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">

              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />

            </svg>

          </div>

          <h3 class="font-bold text-slate-800 text-base">
            Safe & Secure Payments
          </h3>

          <p class="text-slate-400 text-xs leading-relaxed">
            Donate confidently using secure payment systems that protect your personal and financial information.
          </p>

        </div>


        <!-- Card 2 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">

          <div class="w-10 h-10 rounded-xl bg-[#0d2857] text-[#ffcc00] flex items-center justify-center">

            <svg xmlns="http://www.w3.org/2000/svg"
                 class="w-6 h-6"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">

              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />

            </svg>

          </div>

          <h3 class="font-bold text-slate-800 text-base">
            Instant Donation Receipts
          </h3>

          <p class="text-slate-400 text-xs leading-relaxed">
            Receive downloadable receipts immediately after every successful donation transaction.
          </p>

        </div>


        <!-- Card 3 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">

          <div class="w-10 h-10 rounded-xl bg-[#0d2857] text-[#ffcc00] flex items-center justify-center">

            <svg xmlns="http://www.w3.org/2000/svg"
                 class="w-6 h-6"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">

              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />

            </svg>

          </div>

          <h3 class="font-bold text-slate-800 text-base">
            Real-Time Campaign Updates
          </h3>

          <p class="text-slate-400 text-xs leading-relaxed">
            Stay informed with photos, progress reports, and updates from supported community projects.
          </p>

        </div>

      </div>

    </div>
  </section>


  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- VOLUNTEER SECTION -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

    <div class="bg-[#0d2857] rounded-3xl overflow-hidden relative p-8 md:p-12 text-center text-white">

      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div class="max-w-2xl mx-auto space-y-6 relative z-10">

        <h2 class="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Become Part of the Change
        </h2>

        <p class="text-slate-300 text-sm leading-relaxed">
          Join passionate volunteers helping communities through education programs,
          fundraising events, healthcare outreach, and humanitarian support activities.
        </p>

        <div class="pt-2">

          <a
            routerLink="/volunteer/apply"
            class="px-8 py-4 bg-[#ffcc00] hover:bg-[#e6b800]
                   text-slate-900 rounded-2xl font-extrabold text-sm shadow-xl
                   transition-transform hover:-translate-y-0.5 inline-block"
          >
            Become a Volunteer
          </a>

        </div>

      </div>

    </div>

  </section>

</div>
  `,
  styles: [`
    /* Force the hero section and its flex row to fill the same height */
    section { isolation: isolate; }
  `]
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
    const list      = this.stateService.campaigns();
    const donations = this.stateService.donations();
    const vList     = this.stateService.applications().filter(a => a.status === 'approved');
    const totalRaised = list.reduce((sum, c) => sum + c.currentAmount, 0);

    return [
      { label: 'Total Raised',         value: `TSh ${totalRaised.toLocaleString()}` },
      { label: 'Active Projects',       value: list.filter(c => c.status === 'active').length.toString() },
      { label: 'Registered Volunteers', value: vList.length.toString() },
      { label: 'Individual Donors',     value: donations.length.toString() },
    ];
  });

  constructor() {
    const firstActive = this.activeCampaigns()[0];
    if (firstActive) this.selectedCampaignId = firstActive.id.toString();
  }

  triggerQuickDonate() {
    const campId = parseInt(this.selectedCampaignId);
    if (!isNaN(campId)) this.stateService.openDonationModal(campId);
  }
}