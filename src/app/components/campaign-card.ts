import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Campaign, StateService } from '../services/state.service';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      <!-- Media Cover -->
      <div class="relative h-48 overflow-hidden shrink-0">
        <img 
          [src]="campaign.mediaUrl" 
          [alt]="campaign.title" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
        <!-- Overlay Category Badge -->
        <span [class]="categoryClass()" class="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {{ campaign.category }}
        </span>
      </div>

      <!-- Content -->
      <div class="p-5 flex-grow flex flex-col">
        <h3 class="font-bold text-slate-800 text-base group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
          {{ campaign.title }}
        </h3>
        
        <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {{ campaign.description }}
        </p>

        <!-- Progress Metrics -->
        <div class="mt-auto space-y-2">
          <!-- Percent and Details -->
          <div class="flex items-end justify-between text-xs font-semibold">
            <span class="text-slate-500">Raised: <strong class="text-slate-800">TSh {{ campaign.currentAmount | number }}</strong></span>
            <span class="text-emerald-600 font-bold">{{ progressPercent() }}%</span>
          </div>

          <!-- Progress Bar wrapper -->
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              [style.width.%]="Math.min(100, progressPercent())"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
            ></div>
          </div>

          <!-- Target & Status Footer -->
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1.5 uppercase">
            <span>Target: TSh {{ campaign.targetAmount | number }}</span>
            <span [class]="campaign.status === 'active' ? 'text-emerald-500' : 'text-amber-500'">
              {{ campaign.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons Grid -->
      <div class="px-5 pb-5 pt-1 border-t border-slate-50 grid grid-cols-2 gap-2.5">
        <a 
          [routerLink]="['/campaign', campaign.id]"
          class="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold text-center border border-slate-200/80 transition-colors"
        >
          View Details
        </a>
        <button 
          (click)="openDonate()" 
          class="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-sm shadow-emerald-500/10"
        >
          Donate
        </button>
      </div>
    </div>
  `,
  styles: [``]
})
export class CampaignCardComponent {
  @Input({ required: true }) campaign!: Campaign;

  stateService = inject(StateService);
  protected readonly Math = Math;

  progressPercent = computed(() => {
    if (!this.campaign || this.campaign.targetAmount === 0) return 0;
    return Math.round((this.campaign.currentAmount / this.campaign.targetAmount) * 100);
  });

  categoryClass = computed(() => {
    switch (this.campaign.category) {
      case 'Water & Sanitation': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Education': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Food Security': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Disaster Relief': return 'bg-rose-50 text-rose-600 border border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  });

  openDonate() {
    this.stateService.openDonationModal(this.campaign.id);
  }
}
