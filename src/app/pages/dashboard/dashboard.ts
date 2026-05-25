import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StateService, Campaign, Donation, VolunteerApplication, BeneficiaryRequest, CharityEvent } from '../../services/state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- ROLE OVERVIEWS -->

      <!-- ============================================== -->
      <!-- OVERVIEW TAB -->
      <!-- ============================================== -->
      @if (activeTab() === 'Overview') {
        
        <!-- STAFF/ADMIN STATS GRID -->
        @if (isStaff()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-400 uppercase">Total Funding</span>
                <h3 class="text-2xl font-black text-slate-800 mt-1">\${{ totalDonationsAmount() | number }}</h3>
                <span class="text-[9px] text-emerald-500 font-bold mt-1 block">✔ Verified Transactions</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            
            <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-400 uppercase">Campaigns</span>
                <h3 class="text-2xl font-black text-slate-800 mt-1">{{ stateService.campaigns().length }}</h3>
                <span class="text-[9px] text-slate-400 font-bold mt-1 block">{{ activeCampaignsCount() }} Active Funding</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-400 uppercase">Pending Volunteers</span>
                <h3 class="text-2xl font-black text-slate-800 mt-1">{{ pendingVolunteersCount() }}</h3>
                <span class="text-[9px] text-blue-600 font-bold mt-1 block hover:underline cursor-pointer" (click)="authService.activeDashboardTab.set('Volunteers Panel')">Review Applications &rarr;</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-400 uppercase">Beneficiary Requests</span>
                <h3 class="text-2xl font-black text-slate-800 mt-1">{{ pendingRequestsCount() }}</h3>
                <span class="text-[9px] text-amber-600 font-bold mt-1 block hover:underline cursor-pointer" (click)="authService.activeDashboardTab.set('Beneficiary Requests')">Evaluate Petitions &rarr;</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
            </div>
          </div>

          <!-- Charts Column Section -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <!-- Line Chart SVG -->
            <div class="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h4 class="font-bold text-slate-800 text-sm mb-4">Donation Funding Trend (Last 5 Months)</h4>
              <div class="w-full h-64 flex items-center justify-center bg-slate-50 rounded-2xl p-4">
                <!-- SVG Chart -->
                <svg viewBox="0 0 500 200" class="w-full h-full">
                  <!-- Grid Lines -->
                  <line x1="50" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
                  <line x1="50" y1="70" x2="480" y2="70" stroke="#f1f5f9" stroke-width="1" />
                  <line x1="50" y1="120" x2="480" y2="120" stroke="#f1f5f9" stroke-width="1" />
                  <line x1="50" y1="170" x2="480" y2="170" stroke="#e2e8f0" stroke-width="1.5" />
                  
                  <!-- Area Under Path -->
                  <path d="M 50,170 L 100,120 L 200,150 L 300,80 L 400,60 L 480,30 L 480,170 Z" fill="url(#emeraldGrad)" opacity="0.1" />

                  <!-- Trend Line -->
                  <path d="M 50,170 L 100,120 L 200,150 L 300,80 L 400,60 L 480,30" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />

                  <!-- Data Nodes -->
                  <circle cx="50" cy="170" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />
                  <circle cx="100" cy="120" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />
                  <circle cx="200" cy="150" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />
                  <circle cx="300" cy="80" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />
                  <circle cx="400" cy="60" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />
                  <circle cx="480" cy="30" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />

                  <!-- Y-Axis Labels -->
                  <text x="15" y="25" fill="#94a3b8" font-size="8" font-weight="bold">$50k</text>
                  <text x="15" y="75" fill="#94a3b8" font-size="8" font-weight="bold">$30k</text>
                  <text x="15" y="125" fill="#94a3b8" font-size="8" font-weight="bold">$15k</text>
                  <text x="15" y="175" fill="#94a3b8" font-size="8" font-weight="bold">$0</text>

                  <!-- X-Axis Labels -->
                  <text x="45" y="190" fill="#94a3b8" font-size="8" font-weight="bold">Jan</text>
                  <text x="95" y="190" fill="#94a3b8" font-size="8" font-weight="bold">Feb</text>
                  <text x="195" y="190" fill="#94a3b8" font-size="8" font-weight="bold">Mar</text>
                  <text x="295" y="190" fill="#94a3b8" font-size="8" font-weight="bold">Apr</text>
                  <text x="395" y="190" fill="#94a3b8" font-size="8" font-weight="bold">May</text>
                  <text x="470" y="190" fill="#94a3b8" font-size="8" font-weight="bold">Jun</text>

                  <defs>
                    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#10b981" />
                      <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <!-- Category Ring chart SVG -->
            <div class="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <h4 class="font-bold text-slate-800 text-sm mb-4">Impact Allocations</h4>
              <div class="h-44 flex items-center justify-center">
                <svg viewBox="0 0 100 100" class="w-36 h-36">
                  <!-- Ring sections -->
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f1f5f9" stroke-width="12" />
                  <!-- Water & Sanitation (40%) -->
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" stroke-width="12" stroke-dasharray="220" stroke-dashoffset="60" transform="rotate(-90 50 50)" stroke-linecap="round" />
                  <!-- Education (30%) -->
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#6366f1" stroke-width="12" stroke-dasharray="220" stroke-dashoffset="126" transform="rotate(54 50 50)" stroke-linecap="round" />
                  <!-- Food Security (20%) -->
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f59e0b" stroke-width="12" stroke-dasharray="220" stroke-dashoffset="176" transform="rotate(162 50 50)" stroke-linecap="round" />
                  <!-- Text center -->
                  <text x="50" y="53" text-anchor="middle" font-size="9" font-weight="black" fill="#1e293b">HopeFlow</text>
                </svg>
              </div>

              <!-- Legends -->
              <div class="space-y-1.5 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Water Well</span>
                  <span class="text-slate-800">40%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>Education</span>
                  <span class="text-slate-800">30%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Food security</span>
                  <span class="text-slate-800">20%</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- DONOR VIEW -->
        @if (currentUser().role === 'donor') {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Left profile stats -->
            <div class="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div class="text-center space-y-3">
                <img [src]="currentUser().avatarUrl" alt="Avatar" class="w-20 h-20 rounded-full border mx-auto object-cover">
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{{ currentUser().name }}</h3>
                  <p class="text-xs text-slate-400 mt-0.5">Angel Investor & Donor</p>
                </div>
              </div>

              <div class="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-4 text-center">
                <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">Total Gift Contributions</span>
                <span class="text-3xl font-black text-indigo-700 block mt-1">\${{ myTotalDonated() | number }}</span>
                <span class="text-[9px] text-slate-400 block mt-1">4 Completed Transits</span>
              </div>

              <div class="space-y-3 pt-2 text-xs font-semibold text-slate-500">
                <div class="flex items-center justify-between">
                  <span>Billing Email</span>
                  <span class="text-slate-800">{{ currentUser().email }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Donor ID</span>
                  <span class="text-slate-800">#DN-8094</span>
                </div>
              </div>
            </div>

            <!-- Right list of donations -->
            <div class="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 class="font-bold text-slate-800 text-sm">Direct Gift History</h4>
              
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left text-slate-600">
                  <thead class="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th class="px-4 py-3 rounded-l-xl">Campaign</th>
                      <th class="px-4 py-3">Amount</th>
                      <th class="px-4 py-3">Payment Method</th>
                      <th class="px-4 py-3">Date</th>
                      <th class="px-4 py-3 rounded-r-xl text-right">Invoices</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium">
                    @for (d of myDonations(); track d.id) {
                      <tr>
                        <td class="px-4 py-3.5 text-slate-800 font-bold truncate max-w-[200px]">{{ d.campaignTitle }}</td>
                        <td class="px-4 py-3.5 text-emerald-600 font-extrabold">\${{ d.amount }}</td>
                        <td class="px-4 py-3.5">{{ d.paymentMethod }}</td>
                        <td class="px-4 py-3.5">{{ d.date }}</td>
                        <td class="px-4 py-3.5 text-right">
                          <button (click)="downloadMockInvoice(d)" class="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                            Print PDF
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        }

        <!-- BENEFICIARY VIEW -->
        @if (currentUser().role === 'beneficiary') {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div class="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 class="font-bold text-slate-800 text-sm">Submit Help Proposal</h4>
              <p class="text-xs text-slate-400 leading-relaxed">
                Apply for medical fundings, educational school projects, or local borewells.
              </p>
              <button 
                (click)="authService.activeDashboardTab.set('Help Requests')"
                class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/10 transition-transform hover:-translate-y-0.5"
              >
                Create Assistance Request
              </button>
            </div>

            <div class="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 class="font-bold text-slate-800 text-sm">My Active Petitions</h4>
              
              <div class="space-y-4">
                @for (req of myRequests(); track req.id) {
                  <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-1">
                      <h5 class="font-bold text-slate-800 text-sm">{{ req.title }}</h5>
                      <p class="text-xs text-slate-400 line-clamp-1 max-w-md">{{ req.description }}</p>
                      <div class="flex gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                        <span>Submitted: {{ req.createdDate }}</span>
                        <span>Amount: <strong>\${{ req.requestedAmount | number }}</strong></span>
                      </div>
                    </div>
                    <span 
                      [class]="req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'"
                      class="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-current"
                    >
                      {{ req.status }}
                    </span>
                  </div>
                }
              </div>
            </div>

          </div>
        }

        <!-- VOLUNTEER VIEW -->
        @if (currentUser().role === 'volunteer') {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div class="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div class="text-center space-y-3">
                <img [src]="currentUser().avatarUrl" alt="Avatar" class="w-20 h-20 rounded-full border mx-auto object-cover">
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{{ currentUser().name }}</h3>
                  <p class="text-xs text-slate-400 mt-0.5">Community Volunteer Co-op</p>
                </div>
              </div>

              <!-- Hourly logging form -->
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h5 class="font-bold text-slate-800 text-xs">Log Volunteer Hours</h5>
                <form (ngSubmit)="logHours()" class="space-y-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <div>
                    <label class="block mb-1">Hours Logged</label>
                    <input 
                      type="number" 
                      [(ngModel)]="logHourVal" 
                      name="logHourVal" 
                      required 
                      min="1"
                      class="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-800 font-medium focus:outline-none"
                    >
                  </div>
                  <button type="submit" class="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">Submit Hours</button>
                </form>
                @if (hoursLoggedSuccess()) {
                  <p class="text-[10px] text-emerald-600 font-bold text-center">Hours submitted successfully!</p>
                }
              </div>
            </div>

            <div class="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 class="font-bold text-slate-800 text-sm">My Active Registrations</h4>
              <div class="space-y-4">
                @for (ev of myEvents(); track ev.id) {
                  <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <h5 class="font-bold text-slate-800 text-sm">{{ ev.title }}</h5>
                      <div class="flex gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                        <span>Date: {{ ev.date }}</span>
                        <span>Location: {{ ev.location }}</span>
                      </div>
                    </div>
                    <span class="bg-blue-100 text-blue-700 text-[10px] px-2.5 py-1 rounded-full font-bold border border-blue-200 uppercase">Registered</span>
                  </div>
                }
                @if (myEvents().length === 0) {
                  <p class="text-xs text-slate-400 text-center py-6">You have not registered for any events yet. Check the Volunteer Schedule tab!</p>
                }
              </div>
            </div>

          </div>
        }

      }

      <!-- ============================================== -->
      <!-- CAMPAIGNS PANEL TAB -->
      <!-- ============================================== -->
      @if (activeTab() === 'Campaigns Panel') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-800 text-sm">Campaigns Inventory</h4>
            <button 
              (click)="showCreateCampaignForm.set(true)"
              class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10"
            >
              Add Campaign
            </button>
          </div>

          <!-- Create Campaign Form Overlay Overlay -->
          @if (showCreateCampaignForm()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div class="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border shadow-2xl relative text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <button (click)="showCreateCampaignForm.set(false)" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <h3 class="font-black text-slate-800 text-base mb-4 normal-case">Create Fundraising Campaign</h3>
                
                <form (ngSubmit)="onCreateCampaignSubmit()" class="space-y-4 normal-case text-slate-600 font-medium">
                  <div>
                    <label class="block text-slate-500 mb-1">Title</label>
                    <input type="text" [(ngModel)]="newCampTitle" name="newCampTitle" required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-500 mb-1">Category</label>
                    <select [(ngModel)]="newCampCat" name="newCampCat" class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none">
                      <option>Water & Sanitation</option>
                      <option>Education</option>
                      <option>Food Security</option>
                      <option>Disaster Relief</option>
                    </select>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-slate-500 mb-1">Target Amount ($)</label>
                      <input type="number" [(ngModel)]="newCampTarget" name="newCampTarget" required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none">
                    </div>
                    <div>
                      <label class="block text-slate-500 mb-1">Deadline Date</label>
                      <input type="date" [(ngModel)]="newCampDeadline" name="newCampDeadline" required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none">
                    </div>
                  </div>
                  <div>
                    <label class="block text-slate-500 mb-1">Detailed Description</label>
                    <textarea [(ngModel)]="newCampDesc" name="newCampDesc" rows="3" required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none"></textarea>
                  </div>
                  
                  <button type="submit" class="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-bold normal-case mt-2">Publish Campaign Proposal</button>
                </form>
              </div>
            </div>
          }

          <!-- Inventory table -->
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-slate-600">
              <thead class="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 rounded-l-xl">Campaign Title</th>
                  <th class="px-4 py-3">Category</th>
                  <th class="px-4 py-3">Target</th>
                  <th class="px-4 py-3">Raised</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                @for (c of stateService.campaigns(); track c.id) {
                  <tr>
                    <td class="px-4 py-3.5 text-slate-800 font-bold truncate max-w-[200px]">{{ c.title }}</td>
                    <td class="px-4 py-3.5">{{ c.category }}</td>
                    <td class="px-4 py-3.5">\${{ c.targetAmount | number }}</td>
                    <td class="px-4 py-3.5 text-emerald-600 font-bold">\${{ c.currentAmount | number }}</td>
                    <td class="px-4 py-3.5">
                      <span 
                        [class]="c.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'"
                        class="text-[9px] px-2 py-0.5 rounded font-bold uppercase"
                      >
                        {{ c.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-right space-x-2">
                      @if (c.status === 'pending') {
                        <button (click)="approveCampaign(c.id)" class="text-emerald-600 hover:text-emerald-700 font-bold">Approve</button>
                      }
                      @if (c.status === 'active') {
                        <button (click)="closeCampaign(c.id)" class="text-rose-600 hover:text-rose-700 font-bold">Close</button>
                      }
                      <button (click)="addMilestoneUpdate(c)" class="text-indigo-600 hover:text-indigo-700 font-bold">Add Log</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- DONATION AUDITS TAB -->
      <!-- ============================================== -->
      @if (activeTab() === 'Donation Audits') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-800 text-sm">Funding Audit Records</h4>
            <button 
              (click)="exportDonationsExcel()"
              class="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Export Report
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-slate-600">
              <thead class="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 rounded-l-xl">Tx ID</th>
                  <th class="px-4 py-3">Donor</th>
                  <th class="px-4 py-3">Campaign</th>
                  <th class="px-4 py-3">Amount</th>
                  <th class="px-4 py-3">Method</th>
                  <th class="px-4 py-3">Date</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                @for (d of stateService.donations(); track d.id) {
                  <tr>
                    <td class="px-4 py-3.5 font-mono text-[10px] text-slate-400 uppercase">TX-{{ d.id.toString().substring(6) }}</td>
                    <td class="px-4 py-3.5 text-slate-800 font-bold">{{ d.donorName }}</td>
                    <td class="px-4 py-3.5 truncate max-w-[150px]">{{ d.campaignTitle }}</td>
                    <td class="px-4 py-3.5 text-slate-800 font-extrabold">\${{ d.amount }}</td>
                    <td class="px-4 py-3.5">{{ d.paymentMethod }}</td>
                    <td class="px-4 py-3.5">{{ d.date }}</td>
                    <td class="px-4 py-3.5">
                      <span 
                        [class]="d.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                        class="text-[9px] px-2 py-0.5 rounded font-bold uppercase"
                      >
                        {{ d.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-right">
                      @if (d.status === 'completed') {
                        <button (click)="refundDonation(d.id)" class="text-rose-600 hover:text-rose-700 font-bold">Refund</button>
                      } @else {
                        <span class="text-slate-400 text-[10px] font-semibold">Refunded</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- VOLUNTEERS PANEL TAB -->
      <!-- ============================================== -->
      @if (activeTab() === 'Volunteers Panel') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <h4 class="font-bold text-slate-800 text-sm">Volunteer Application Queue</h4>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-slate-600">
              <thead class="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 rounded-l-xl">Name</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Assigned Project</th>
                  <th class="px-4 py-3">Skills</th>
                  <th class="px-4 py-3">Applied Date</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                @for (a of stateService.applications(); track a.id) {
                  <tr>
                    <td class="px-4 py-3.5 text-slate-800 font-bold">{{ a.name }}</td>
                    <td class="px-4 py-3.5">{{ a.email }}</td>
                    <td class="px-4 py-3.5 truncate max-w-[150px]">{{ a.campaignTitle }}</td>
                    <td class="px-4 py-3.5">
                      <div class="flex flex-wrap gap-1">
                        @for (skill of a.skills; track skill) {
                          <span class="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500">{{ skill }}</span>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-3.5">{{ a.appliedDate }}</td>
                    <td class="px-4 py-3.5">
                      <span 
                        [class]="a.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : a.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'"
                        class="text-[9px] px-2 py-0.5 rounded font-bold uppercase"
                      >
                        {{ a.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-right space-x-2">
                      @if (a.status === 'pending') {
                        <button (click)="approveVolunteer(a.id)" class="text-emerald-600 hover:text-emerald-700 font-bold">Approve</button>
                        <button (click)="rejectVolunteer(a.id)" class="text-rose-600 hover:text-rose-700 font-bold">Reject</button>
                      } @else {
                        <span class="text-slate-400 text-[10px] font-semibold uppercase">{{ a.status }}</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- BENEFICIARY REQUESTS TAB (ADMIN REVIEW) -->
      <!-- ============================================== -->
      @if (activeTab() === 'Beneficiary Requests') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <h4 class="font-bold text-slate-800 text-sm">Pending Petitions Review</h4>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-slate-600">
              <thead class="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 rounded-l-xl">Applicant</th>
                  <th class="px-4 py-3">Needs Title</th>
                  <th class="px-4 py-3">Description</th>
                  <th class="px-4 py-3">Requested Amount</th>
                  <th class="px-4 py-3">Attachments</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                @for (r of stateService.beneficiaryRequests(); track r.id) {
                  <tr>
                    <td class="px-4 py-3.5">
                      <div class="font-bold text-slate-800">{{ r.beneficiaryName }}</div>
                      <div class="text-[9px] text-slate-400 mt-0.5">{{ r.beneficiaryEmail }}</div>
                    </td>
                    <td class="px-4 py-3.5 text-slate-800 font-bold truncate max-w-[150px]">{{ r.title }}</td>
                    <td class="px-4 py-3.5 truncate max-w-[200px]" [title]="r.description">{{ r.description }}</td>
                    <td class="px-4 py-3.5 text-slate-800 font-extrabold">\${{ r.requestedAmount | number }}</td>
                    <td class="px-4 py-3.5 text-[9px] font-bold text-slate-500 uppercase">
                      @for (doc of r.supportingDocuments; track doc) {
                        <span class="block hover:underline cursor-pointer text-indigo-600">📎 {{ doc }}</span>
                      }
                    </td>
                    <td class="px-4 py-3.5">
                      <span 
                        [class]="r.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : r.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'"
                        class="text-[9px] px-2 py-0.5 rounded font-bold uppercase"
                      >
                        {{ r.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-right space-x-2">
                      @if (r.status === 'pending') {
                        <button (click)="approveRequest(r.id)" class="text-emerald-600 hover:text-emerald-700 font-bold">Approve</button>
                        <button (click)="rejectRequest(r.id)" class="text-rose-600 hover:text-rose-700 font-bold">Reject</button>
                      } @else {
                        <span class="text-slate-400 text-[10px] font-semibold uppercase">{{ r.status }}</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- MY DONATIONS TAB -->
      <!-- ============================================== -->
      @if (activeTab() === 'My Donations') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 class="font-bold text-slate-800 text-sm">Donation Receipts Registry</h4>
          <p class="text-xs text-slate-400">Download, print, or review tax deduction records below.</p>
          
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-slate-600">
              <thead class="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 rounded-l-xl">Tx ID</th>
                  <th class="px-4 py-3">Campaign Project</th>
                  <th class="px-4 py-3">Amount</th>
                  <th class="px-4 py-3">Method</th>
                  <th class="px-4 py-3">Date</th>
                  <th class="px-4 py-3 rounded-r-xl text-right">Invoice</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                @for (d of myDonations(); track d.id) {
                  <tr>
                    <td class="px-4 py-3.5 font-mono text-[10px] text-slate-400 uppercase">TX-{{ d.id.toString().substring(6) }}</td>
                    <td class="px-4 py-3.5 text-slate-800 font-bold">{{ d.campaignTitle }}</td>
                    <td class="px-4 py-3.5 text-emerald-600 font-extrabold">\${{ d.amount }}</td>
                    <td class="px-4 py-3.5">{{ d.paymentMethod }}</td>
                    <td class="px-4 py-3.5">{{ d.date }}</td>
                    <td class="px-4 py-3.5 text-right">
                      <button (click)="downloadMockInvoice(d)" class="text-indigo-600 hover:text-indigo-700 font-bold">Download TXT</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- HELP REQUESTS TAB (BENEFICIARY FORM) -->
      <!-- ============================================== -->
      @if (activeTab() === 'Help Requests') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <h4 class="font-bold text-slate-800 text-sm">Submit New Needs Petition</h4>
          
          <form (ngSubmit)="submitHelpRequest()" class="space-y-4 text-xs font-semibold text-slate-500 uppercase tracking-wider max-w-lg">
            <div>
              <label class="block mb-1">Needs Title</label>
              <input type="text" [(ngModel)]="newReqTitle" name="newReqTitle" placeholder="e.g. Village Borehole Project" required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none normal-case">
            </div>
            <div>
              <label class="block mb-1">Detailed Case Statement</label>
              <textarea [(ngModel)]="newReqDesc" name="newReqDesc" rows="4" placeholder="Explain structural constraints and community beneficiaries..." required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none normal-case"></textarea>
            </div>
            <div>
              <label class="block mb-1">Required Amount ($)</label>
              <input type="number" [(ngModel)]="newReqAmount" name="newReqAmount" required class="w-full border px-3 py-2 rounded-lg text-slate-800 font-medium focus:outline-none">
            </div>
            <button type="submit" class="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-bold mt-2">File Assistance Request</button>
          </form>
          @if (helpRequestSuccess()) {
            <p class="text-xs text-emerald-600 font-bold">Request filed successfully! Review its evaluation progress in the Overview tab.</p>
          }
        </div>
      }

      <!-- ============================================== -->
      <!-- VOLUNTEER SCHEDULE TAB -->
      <!-- ============================================== -->
      @if (activeTab() === 'Volunteer Schedule') {
        <div class="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
          <h4 class="font-bold text-slate-800 text-sm">Community Mobilization Events</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (ev of stateService.events(); track ev.id) {
              <div class="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <span class="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-100">LOGISTICS DAY</span>
                  <h5 class="font-bold text-slate-800 text-sm">{{ ev.title }}</h5>
                  <p class="text-slate-400 text-xs leading-relaxed font-medium">{{ ev.description }}</p>
                  
                  <div class="flex gap-4 text-[10px] text-slate-400 font-semibold pt-1.5">
                    <span>Date: {{ ev.date }}</span>
                    <span>Location: {{ ev.location }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between border-t border-slate-200/50 pt-3">
                  <span class="text-[10px] text-slate-400 font-bold">Needs: {{ ev.volunteersNeeded }} volunteers ({{ ev.registeredCount }} registered)</span>
                  
                  @if (isRegisteredForEvent(ev)) {
                    <button class="px-3.5 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 rounded-lg cursor-default">Registered</button>
                  } @else {
                    <button (click)="registerEvent(ev.id)" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors">Join</button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

    </div>
  `,
  styles: [``]
})
export class Dashboard {
  authService = inject(AuthService);
  stateService = inject(StateService);

  activeTab = this.authService.activeDashboardTab;
  currentUser = this.authService.currentUser;

  // --- Campaign form state ---
  showCreateCampaignForm = signal(false);
  newCampTitle = '';
  newCampCat = 'Water & Sanitation';
  newCampTarget = 10000;
  newCampDeadline = '2026-08-31';
  newCampDesc = '';

  // --- Beneficiary form state ---
  newReqTitle = '';
  newReqDesc = '';
  newReqAmount = 1500;
  helpRequestSuccess = signal(false);

  // --- Volunteer hourly log state ---
  logHourVal = 4;
  hoursLoggedSuccess = signal(false);

  isStaff = computed(() => {
    const role = this.currentUser().role;
    return ['super-admin', 'admin', 'campaign-manager', 'finance-officer'].includes(role);
  });

  totalDonationsAmount = computed(() =>
    this.stateService.donations()
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0)
  );

  activeCampaignsCount = computed(() =>
    this.stateService.campaigns().filter(c => c.status === 'active').length
  );

  pendingVolunteersCount = computed(() =>
    this.stateService.applications().filter(a => a.status === 'pending').length
  );

  pendingRequestsCount = computed(() =>
    this.stateService.beneficiaryRequests().filter(r => r.status === 'pending').length
  );

  // --- Donor Specific Getters ---
  myDonations = computed(() => {
    const email = this.currentUser().email;
    const name = this.currentUser().name;
    return this.stateService.donations().filter(d => 
      d.donorName === name || d.donorName === 'Bill Gates'
    );
  });

  myTotalDonated = computed(() =>
    this.myDonations().reduce((sum, d) => sum + d.amount, 0)
  );

  // --- Beneficiary Specific Getters ---
  myRequests = computed(() => {
    const email = this.currentUser().email;
    return this.stateService.beneficiaryRequests().filter(r => 
      r.beneficiaryEmail === email
    );
  });

  // --- Volunteer Specific Getters ---
  myEvents = computed(() => {
    const email = this.currentUser().email;
    return this.stateService.events().filter(ev => 
      ev.registeredVolunteers.includes(email)
    );
  });

  // --- Campaign Admin Actions ---
  approveCampaign(id: number) {
    this.stateService.updateCampaignStatus(id, 'active');
  }

  closeCampaign(id: number) {
    this.stateService.updateCampaignStatus(id, 'closed');
  }

  addMilestoneUpdate(c: Campaign) {
    const content = prompt(`Add a milestone update log for campaign: "${c.title}"`);
    if (content && content.trim()) {
      this.stateService.addCampaignUpdate(c.id, content.trim());
    }
  }

  onCreateCampaignSubmit() {
    if (this.newCampTitle && this.newCampDesc && this.newCampTarget > 0) {
      const added = this.stateService.addCampaign(
        this.newCampTitle,
        this.newCampDesc,
        this.newCampTarget,
        this.newCampDeadline,
        this.newCampCat
      );
      // Auto approve if super admin/admin
      if (['super-admin', 'admin'].includes(this.currentUser().role)) {
        this.stateService.updateCampaignStatus(added.id, 'active');
      }
      this.showCreateCampaignForm.set(false);
      // Reset form variables
      this.newCampTitle = '';
      this.newCampDesc = '';
      this.newCampTarget = 10000;
    }
  }

  // --- Volunteer Admin Actions ---
  approveVolunteer(id: number) {
    this.stateService.approveVolunteerApplication(id);
  }

  rejectVolunteer(id: number) {
    this.stateService.rejectVolunteerApplication(id);
  }

  // --- Beneficiary Admin Actions ---
  approveRequest(id: number) {
    this.stateService.updateBeneficiaryRequestStatus(id, 'approved');
  }

  rejectRequest(id: number) {
    this.stateService.updateBeneficiaryRequestStatus(id, 'rejected');
  }

  // --- Finance Admin Actions ---
  refundDonation(id: number) {
    if (confirm('Are you sure you want to refund this transaction?')) {
      this.stateService.refundDonation(id);
    }
  }

  exportDonationsExcel() {
    let csvContent = 'Transaction ID,Donor,Campaign,Amount,Payment Method,Date,Status\n';
    this.stateService.donations().forEach(d => {
      csvContent += `TX-${d.id.toString().substring(6)},${d.donorName},"${d.campaignTitle}",\$${d.amount},${d.paymentMethod},${d.date},${d.status}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HopeFlow-Financial-Audits.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // --- Donor Specific Actions ---
  downloadMockInvoice(d: Donation) {
    const printContent = `
      ============================
      HOPEFLOW DONATION PLATFORM
      RECEIPT OF CONTRIBUTION
      ============================
      Transaction ID: TX-${d.id.toString().substring(6)}
      Campaign: ${d.campaignTitle}
      Date: ${d.date}
      Donor: ${d.donorName}
      Amount: \$${d.amount}
      Status: ${d.status.toUpperCase()}
      
      Thank you for your generous support! Your contribution makes a direct difference.
    `;
    
    const blob = new Blob([printContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-TX-${d.id.toString().substring(6)}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // --- Beneficiary Specific Actions ---
  submitHelpRequest() {
    if (this.newReqTitle && this.newReqDesc && this.newReqAmount > 0) {
      this.stateService.requestHelp(
        this.currentUser().name,
        this.currentUser().email,
        this.newReqTitle,
        this.newReqDesc,
        this.newReqAmount,
        []
      );
      this.helpRequestSuccess.set(true);
      setTimeout(() => this.helpRequestSuccess.set(false), 4000);
      
      // Reset form
      this.newReqTitle = '';
      this.newReqDesc = '';
      this.newReqAmount = 1500;
    }
  }

  // --- Volunteer Specific Actions ---
  isRegisteredForEvent(ev: CharityEvent) {
    return ev.registeredVolunteers.includes(this.currentUser().email);
  }

  registerEvent(eventId: number) {
    this.stateService.registerForEvent(eventId, this.currentUser().email);
  }

  logHours() {
    if (this.logHourVal > 0) {
      this.hoursLoggedSuccess.set(true);
      setTimeout(() => this.hoursLoggedSuccess.set(false), 3000);
      this.logHourVal = 4;
    }
  }
}
