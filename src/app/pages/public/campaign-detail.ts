import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      @if (campaign()) {
        <div class="space-y-10">
          
          <!-- Back Link -->
          <a routerLink="/campaigns" class="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Back to Campaigns</span>
          </a>

          <!-- Title Grid Cover -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Banner Image -->
            <div class="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
              <div class="relative h-96 w-full">
                <img [src]="campaign()?.mediaUrl" [alt]="campaign()?.title" class="w-full h-full object-cover">
                <span class="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full shadow-sm text-slate-700">
                  {{ campaign()?.category }}
                </span>
              </div>
            </div>

            <!-- Right Box Quick Summary -->
            <div class="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h1 class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-tight">
                  {{ campaign()?.title }}
                </h1>
                <p class="text-xs text-slate-400 font-semibold mt-1">Status: Active</p>
              </div>

              <!-- Stats Block -->
              <div class="space-y-3.5">
                <div class="flex items-end justify-between font-bold text-xs">
                  <span class="text-slate-500">Raised: <strong class="text-slate-800 text-base font-extrabold">TSh {{ campaign()?.currentAmount | number }}</strong></span>
                  <span class="text-emerald-600 text-sm">{{ progressPercent() }}%</span>
                </div>
                
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div [style.width.%]="Math.min(100, progressPercent())" class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"></div>
                </div>

                <div class="flex justify-between text-[10px] text-slate-400 font-bold uppercase pt-1">
                  <span>Target: TSh {{ campaign()?.targetAmount | number }}</span>
                  <span>Donors: {{ campaign()?.donorCount }}</span>
                </div>
              </div>

              <!-- Primary Donate CTA -->
              <button 
                (click)="openDonate()"
                class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-center text-sm shadow-lg shadow-emerald-500/25 transition-transform hover:-translate-y-0.5"
              >
                Donate Now
              </button>

              <!-- Secondary Volunteer Link -->
              <a 
                [routerLink]="['/volunteer/apply']" 
                [queryParams]="{ campaignId: campaign()?.id }"
                class="w-full py-3.5 block bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 rounded-2xl font-bold text-center text-xs transition-colors"
              >
                Apply to Volunteer
              </a>
            </div>
          </div>

          <!-- Tabs Content (Description, Updates, Donors list) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left 2/3 Content -->
            <div class="lg:col-span-8 space-y-8">
              <!-- Tabs Navigator -->
              <div class="flex border-b border-slate-200 gap-6">
                @for (tab of tabs; track tab) {
                  <button 
                    (click)="activeTab.set(tab)"
                    [class.border-emerald-500]="activeTab() === tab"
                    [class.text-emerald-600]="activeTab() === tab"
                    [class.border-transparent]="activeTab() !== tab"
                    [class.text-slate-400]="activeTab() !== tab"
                    class="pb-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all duration-200"
                  >
                    {{ tab }}
                  </button>
                }
              </div>

              <!-- Tab Contents -->
              <div class="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
                <!-- DESCRIPTION TAB -->
                @if (activeTab() === 'Description') {
                  <div class="space-y-4">
                    <h3 class="font-bold text-slate-800 text-lg">About this Initiative</h3>
                    <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {{ campaign()?.description }}
                    </p>
                    <div class="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                      <div>Created Date: {{ campaign()?.createdDate }}</div>
                      <div>Deadline: {{ campaign()?.deadline }}</div>
                      <div>Assigned Volunteers: {{ campaign()?.volunteersCount }}</div>
                    </div>
                  </div>
                }

                <!-- UPDATES TAB -->
                @if (activeTab() === 'Updates') {
                  <div class="space-y-6">
                    <h3 class="font-bold text-slate-800 text-lg mb-4">Milestone Logs</h3>
                    @if (campaign() && campaign()!.updates.length > 0) {
                      <div class="relative pl-6 border-l border-slate-200 space-y-6">
                        @for (log of campaign()?.updates; track log.id) {
                          <div class="relative">
                            <!-- Bullet point marker -->
                            <div class="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white border border-emerald-400"></div>
                            
                            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ log.date }}</div>
                            <h4 class="font-semibold text-slate-700 text-sm mt-0.5">Project Milestone Met</h4>
                            <p class="text-slate-600 text-xs mt-1 leading-relaxed">
                              {{ log.content }}
                            </p>
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-slate-400 text-xs py-4 text-center">No milestone updates have been posted yet. Check back soon!</p>
                    }
                  </div>
                }

                <!-- DONOR WALL TAB -->
                @if (activeTab() === 'Donor Wall') {
                  <div class="space-y-6">
                    <h3 class="font-bold text-slate-800 text-lg">Recent Contributions</h3>
                    @if (campaignDonations().length > 0) {
                      <div class="divide-y divide-slate-100">
                        @for (donation of campaignDonations(); track donation.id) {
                          <div class="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                            <div class="flex items-center gap-3">
                              <!-- Heart Icon decoration -->
                              <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </div>
                              <div>
                                <div class="text-xs font-bold text-slate-800">{{ donation.donorName }}</div>
                                <div class="text-[10px] text-slate-400">{{ donation.date }} &bull; {{ donation.paymentMethod }}</div>
                              </div>
                            </div>
                            <div class="text-right">
                              <span class="font-bold text-slate-800 text-xs">TSh {{ donation.amount | number }}</span>
                              @if (donation.isRecurring) {
                                <span class="block text-[8px] font-bold text-emerald-600 uppercase tracking-widest">{{ donation.recurringFrequency }}</span>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-slate-400 text-xs py-4 text-center">Be the first to contribute to this campaign!</p>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Right 1/3 Content: Transparency panel -->
            <div class="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
              <h3 class="font-bold text-base text-emerald-400">Giving Guarantee</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Your donation goes directly to project procurement. We run on a flat 0% platform commission model supported by voluntary tips.
              </p>
              <ul class="space-y-3.5 pt-2 text-xs">
                <li class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Tax receipt generated instantly</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Follow live photos of project works</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>100% money back refund audit trail</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      } @else {
        <!-- Not Found -->
        <div class="py-24 text-center max-w-md mx-auto space-y-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div class="text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800">Campaign Not Found</h2>
            <p class="text-xs text-slate-400 mt-1">The requested campaign does not exist or has been removed from our listings.</p>
          </div>
          <a routerLink="/campaigns" class="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">Browse Active Campaigns</a>
        </div>
      }
    </div>
  `,
  styles: [``]
})
export class CampaignDetail {
  route = inject(ActivatedRoute);
  stateService = inject(StateService);
  protected readonly Math = Math;

  campaignId = signal<number | null>(null);

  tabs = ['Description', 'Updates', 'Donor Wall'];
  activeTab = signal('Description');

  campaign = computed(() => {
    const id = this.campaignId();
    if (id === null) return null;
    return this.stateService.campaigns().find(c => c.id === id) || null;
  });

  campaignDonations = computed(() => {
    const id = this.campaignId();
    if (id === null) return [];
    return this.stateService.donations().filter(d => d.campaignId === id);
  });

  progressPercent = computed(() => {
    const camp = this.campaign();
    if (!camp || camp.targetAmount === 0) return 0;
    return Math.round((camp.currentAmount / camp.targetAmount) * 100);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.campaignId.set(parseInt(idStr));
      }
    });
  }

  openDonate() {
    const id = this.campaignId();
    if (id !== null) {
      this.stateService.openDonationModal(id);
    }
  }
}
