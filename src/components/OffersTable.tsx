'use client';

import { useState, useMemo } from 'react';
import { Offer, SortField, SortDirection } from '@/types/offers';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface OffersTableProps {
  offers: Offer[];
}

export default function OffersTable({ offers }: OffersTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(offers.map(offer => offer.category)));
    return ['all', ...uniqueCategories.sort()];
  }, [offers]);

  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(offers.map(offer => offer.country)));
    return ['all', ...uniqueCountries.sort()];
  }, [offers]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedCountry !== 'all';

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.network.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesCountry = selectedCountry === 'all' || offer.country === selectedCountry;
    
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    let comparison = 0;
    
    const aValue = a[sortField].toString().toLowerCase();
    const bValue = b[sortField].toString().toLowerCase();
    comparison = aValue.localeCompare(bValue);
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-600 ml-1">↕</span>;
    }
    return <span className="ml-1 text-orange-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#0f1012] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-[#0f1012] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white appearance-none cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-[#0f1012] text-white">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-[#0f1012] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white appearance-none cursor-pointer"
            >
              {countries.map((country) => (
                <option key={country} value={country} className="bg-[#0f1012] text-white">
                  {country === 'all' ? 'All Countries' : country}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm text-orange-500 hover:text-orange-400 hover:bg-gray-900 rounded-lg transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-[#0f1012] rounded-lg shadow-lg shadow-red-500/10 border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-900/50 border-b-2 border-gray-800">
            <tr>
              <th className="px-6 py-4 w-12"></th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSort('name')}
              >
                Offer <SortIcon field="name" />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon field="category" />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSort('payout')}
              >
                Payout <SortIcon field="payout" />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSort('metrics')}
              >
                Metrics <SortIcon field="metrics" />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSort('country')}
              >
                Country <SortIcon field="country" />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleSort('network')}
              >
                Network <SortIcon field="network" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOffers.map((offer) => (
              <>
                <tr 
                  key={offer.id} 
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer border-b border-gray-800"
                  onClick={() => setExpandedRow(expandedRow === offer.id ? null : offer.id)}
                >
                  <td className="px-6 py-4 text-center">
                    {expandedRow === offer.id ? (
                      <ChevronUp className="w-4 h-4 text-orange-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {offer.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {offer.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">
                    {offer.payout}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {offer.metrics}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {offer.country}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {offer.network}
                  </td>
                </tr>
                {expandedRow === offer.id && (
                  <tr className="border-b border-gray-800">
                    <td colSpan={8} className="px-6 py-6 bg-gray-900/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {offer.website && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Website</h4>
                            <a 
                              href={offer.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-400 inline-flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {offer.website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        {offer.offerTypes && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Offer Types</h4>
                            <p className="text-sm text-gray-400">{offer.offerTypes}</p>
                          </div>
                        )}
                        {offer.targetAction && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Target Action</h4>
                            <p className="text-sm text-gray-400">{offer.targetAction}</p>
                          </div>
                        )}
                        {offer.testCap && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Test Cap</h4>
                            <p className="text-sm text-gray-400">{offer.testCap}</p>
                          </div>
                        )}
                        {offer.hold && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Hold</h4>
                            <p className="text-sm text-gray-400">{offer.hold}</p>
                          </div>
                        )}
                        {offer.kpi && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">KPI</h4>
                            <p className="text-sm text-gray-400">{offer.kpi}</p>
                          </div>
                        )}
                        {offer.traffic && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Traffic</h4>
                            <p className="text-sm text-gray-400">{offer.traffic}</p>
                          </div>
                        )}
                        {offer.acceptedGeos && (
                          <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Accepted Geos</h4>
                            <p className="text-sm text-gray-400">{offer.acceptedGeos}</p>
                          </div>
                        )}
                        {offer.notes && (
                          <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Notes</h4>
                            <p className="text-sm text-gray-400">{offer.notes}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        
        {sortedOffers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No offers found matching your search.
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Showing {sortedOffers.length} of {offers.length} offers
      </div>
    </div>
  );
}


