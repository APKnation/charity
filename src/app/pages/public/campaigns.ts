import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { CampaignCardComponent } from '../../components/campaign-card';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, CampaignCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <!-- Page Header -->
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Active Funds</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-800">Support a Worthy Cause</h1>
        <p class="text-slate-400 text-sm">
          Discover humanitarian projects, review real-time milestones, and contribute funds or skills directly to the field.
        </p>
      </div>

      <!-- Search & Filters Panel -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <!-- Search Input -->
        <div class="relative w-full md:w-96">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            placeholder="Search campaigns by keyword..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none transition-colors"
          >
        </div>

        <!-- Filter Categories List (Desktop pills) -->
        <div class="hidden lg:flex items-center gap-1.5">
          @for (cat of categories; track cat) {
            <button 
              (click)="selectedCategory.set(cat)"
              [class.bg-slate-900]="selectedCategory() === cat"
              [class.text-white]="selectedCategory() === cat"
              [class.bg-slate-50]="selectedCategory() !== cat"
              [class.text-slate-600]="selectedCategory() !== cat"
              [class.hover:bg-slate-100]="selectedCategory() !== cat"
              class="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200/60 transition-all duration-200"
            >
              {{ cat }}
            </button>
          }
        </div>

        <!-- Mobile Categories select -->
        <div class="w-full lg:hidden">
          <select 
            [(ngModel)]="selectedCategory" 
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none"
          >
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

      </div>

      <!-- Campaign Grid -->
      @if (filteredCampaigns().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (camp of filteredCampaigns(); track camp.id) {
            <app-campaign-card [campaign]="camp"></app-campaign-card>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="py-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
          <div class="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-700 text-sm">No campaigns match criteria</h3>
            <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try resetting filters or checking spelling of your keywords.</p>
          </div>
          <button 
            (click)="resetFilters()" 
            class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      }

    </div>
  `,
  styles: [``]
})
export class Campaigns {
  stateService = inject(StateService);

  searchQuery = '';
  selectedCategory = signal('All');

  categories = ['All', 'Water & Sanitation', 'Education', 'Food Security', 'Disaster Relief'];

  filteredCampaigns = computed(() => {
    let list = this.stateService.campaigns().filter(c => c.status === 'active');
    
    // Category filter
    const cat = this.selectedCategory();
    if (cat !== 'All') {
      list = list.filter(c => c.category === cat);
    }

    // Search query filter
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      list = list.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }

    return list;
  });

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory.set('All');
  }
}
