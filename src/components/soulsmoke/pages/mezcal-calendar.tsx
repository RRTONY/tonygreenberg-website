"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ExternalLink, MapPin, Ticket } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/MezcalCalendar.tsx (/calendar), 2026-11-10.
// Same events, filters and "Add to Calendar" link. One fix: the event dates ("2026-07-15") are
// read as UTC midnight, so the original showed the day before for visitors west of London
// (Jul 14 for a Jul 15 festival); dates are now shown in UTC, which also keeps the server
// and browser render identical.

interface MezcalEvent {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location: string;
  country: 'mexico' | 'usa' | 'other';
  type: 'festival' | 'tasting' | 'education' | 'producer-visit' | 'conference';
  description: string;
  highlights: string[];
  website?: string;
  ticketPrice?: string;
  recurring?: boolean;
}

const events: MezcalEvent[] = [
  // Major Annual Events
  {
    id: 'feria-mezcal-2026',
    name: 'Feria Internacional del Mezcal',
    date: '2026-07-15',
    endDate: '2026-07-26',
    location: 'Oaxaca City, Mexico',
    country: 'mexico',
    type: 'festival',
    description: 'The largest mezcal festival in the world. Over 100 producers showcase their spirits during the Guelaguetza celebrations.',
    highlights: [
      'Meet mezcaleros from across Oaxaca',
      'Taste hundreds of expressions',
      'Traditional Guelaguetza performances',
      'Educational seminars and workshops'
    ],
    website: 'https://www.oaxaca.gob.mx',
    ticketPrice: 'Free - $50 for special tastings',
    recurring: true,
  },
  {
    id: 'mezcal-week-2026',
    name: 'Mexico in a Bottle / Mezcal Week',
    date: '2026-03-12',
    endDate: '2026-03-15',
    location: 'Multiple US Cities',
    country: 'usa',
    type: 'festival',
    description: 'The premier mezcal event in the United States. Producers travel from Mexico to pour their spirits and share their stories.',
    highlights: [
      'Direct access to mezcaleros',
      'Rare bottle tastings',
      'Educational seminars',
      'Industry networking'
    ],
    website: 'https://mexicoinabottle.com',
    ticketPrice: '$75-150',
    recurring: true,
  },
  {
    id: 'tales-cocktail-2026',
    name: 'Tales of the Cocktail',
    date: '2026-07-21',
    endDate: '2026-07-26',
    location: 'New Orleans, LA',
    country: 'usa',
    type: 'conference',
    description: 'The world\'s premier cocktail festival features numerous mezcal-focused seminars and tastings.',
    highlights: [
      'Mezcal-specific seminars',
      'Brand ambassador meetups',
      'Cocktail competitions',
      'Industry networking'
    ],
    website: 'https://talesofthecocktail.org',
    ticketPrice: '$200-500',
    recurring: true,
  },
  {
    id: 'agave-heritage-2026',
    name: 'Agave Heritage Festival',
    date: '2026-04-18',
    endDate: '2026-04-20',
    location: 'Tucson, AZ',
    country: 'usa',
    type: 'festival',
    description: 'Celebrating the cultural and botanical heritage of agave in the borderlands region.',
    highlights: [
      'Wild agave conservation talks',
      'Mezcal and sotol tastings',
      'Traditional food pairings',
      'Desert botanical tours'
    ],
    website: 'https://agaveheritagefestival.com',
    ticketPrice: '$50-100',
    recurring: true,
  },
  // Producer Visits
  {
    id: 'pm-spirits-tasting-2026',
    name: 'PM Spirits Producer Tasting',
    date: '2026-02-20',
    location: 'Brooklyn, NY',
    country: 'usa',
    type: 'producer-visit',
    description: 'Nicolas Palazzi hosts producers from NETA and 5 Sentidos for an intimate tasting event.',
    highlights: [
      'Meet the mezcaleros',
      'Taste unreleased batches',
      'Q&A with producers',
      'Limited bottle releases'
    ],
    ticketPrice: '$100',
  },
  {
    id: 'del-maguey-tour-2026',
    name: 'Del Maguey Village Tour',
    date: '2026-05-10',
    endDate: '2026-05-15',
    location: 'Oaxaca, Mexico',
    country: 'mexico',
    type: 'education',
    description: 'Annual guided tour of Del Maguey\'s single village producers. Limited to 20 participants.',
    highlights: [
      'Visit multiple palenques',
      'Meet producer families',
      'Harvest and production demos',
      'Exclusive tastings'
    ],
    website: 'https://delmaguey.com',
    ticketPrice: '$2,500 (includes lodging)',
  },
  // Educational Events
  {
    id: 'mezcal-sommelier-2026',
    name: 'Mezcal Sommelier Certification',
    date: '2026-04-05',
    endDate: '2026-04-07',
    location: 'Oaxaca City, Mexico',
    country: 'mexico',
    type: 'education',
    description: 'Intensive certification program covering mezcal production, tasting, and service.',
    highlights: [
      'CRM certification',
      'Palenque visits',
      'Blind tasting training',
      'Industry certification'
    ],
    ticketPrice: '$1,200',
  },
  {
    id: 'agave-spirits-summit-2026',
    name: 'Agave Spirits Summit',
    date: '2026-09-15',
    endDate: '2026-09-17',
    location: 'San Francisco, CA',
    country: 'usa',
    type: 'conference',
    description: 'Industry conference focused on sustainability, fair trade, and the future of agave spirits.',
    highlights: [
      'Sustainability panels',
      'Fair trade discussions',
      'Conservation initiatives',
      'Producer cooperatives'
    ],
    ticketPrice: '$300',
  },
];

const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'festival', label: 'Festivals' },
  { value: 'tasting', label: 'Tastings' },
  { value: 'education', label: 'Education' },
  { value: 'producer-visit', label: 'Producer Visits' },
  { value: 'conference', label: 'Conferences' },
];

const countries = [
  { value: 'all', label: 'All Locations' },
  { value: 'usa', label: 'United States' },
  { value: 'mexico', label: 'Mexico' },
];

export function MezcalCalendar() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const filteredEvents = events
    .filter(e => typeFilter === 'all' || e.type === typeFilter)
    .filter(e => countryFilter === 'all' || e.country === countryFilter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'festival': return 'bg-purple-900/50 text-purple-300 border-purple-700';
      case 'tasting': return 'bg-amber-900/50 text-amber-300 border-amber-700';
      case 'education': return 'bg-blue-900/50 text-blue-300 border-blue-700';
      case 'producer-visit': return 'bg-emerald-900/50 text-emerald-300 border-emerald-700';
      case 'conference': return 'bg-rose-900/50 text-rose-300 border-rose-700';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700';
    }
  };

  const addToCalendar = (event: MezcalEvent) => {
    const startDate = new Date(event.date).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = event.endDate 
      ? new Date(event.endDate).toISOString().replace(/-|:|\.\d+/g, '')
      : startDate;
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-black py-12 border-b border-amber-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <Link href={ss("/")} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6 transition-colors">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-amber-400 mb-4">
            Mezcal Calendar
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Festivals, tastings, producer visits, and educational events. Plan your mezcal pilgrimage.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label htmlFor="soulsmoke-event-type" className="text-xs text-gray-400 block mb-1">Event Type</label>
            <select
              id="soulsmoke-event-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="soulsmoke-event-location" className="text-xs text-gray-400 block mb-1">Location</label>
            <select
              id="soulsmoke-event-location"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              {countries.map(country => (
                <option key={country.value} value={country.value}>{country.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-6">
          {filteredEvents.map(event => (
            <div 
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-900/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Date Badge */}
                <div className="shrink-0 text-center md:w-24">
                  <div className="bg-amber-900/30 rounded-xl p-3">
                    <p className="text-amber-400 font-mono text-sm">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {new Date(event.date).getUTCDate()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(event.date).getUTCFullYear()}
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getTypeColor(event.type)}`}>
                      {event.type.replace('-', ' ')}
                    </span>
                    {event.recurring && (
                      <span className="px-2 py-1 rounded text-xs bg-white/10 text-gray-300">
                        Annual
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl text-white mb-2">{event.name}</h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin aria-hidden="true" className="size-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock aria-hidden="true" className="size-4" />
                      {formatDate(event.date)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </div>
                    {event.ticketPrice && (
                      <div className="flex items-center gap-1">
                        <Ticket aria-hidden="true" className="size-4" />
                        {event.ticketPrice}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-200 mb-4">{event.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.highlights.map((highlight) => (
                      <span key={highlight} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addToCalendar(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm transition-colors"
                    >
                      <Calendar aria-hidden="true" className="size-4" />
                      Add to Calendar
                    </button>
                    {event.website && (
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-gray-500 rounded-lg text-sm text-gray-200 hover:text-white transition-colors"
                      >
                        <ExternalLink aria-hidden="true" className="size-4" />
                        Event Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar aria-hidden="true" className="size-16 mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400">No events match your filters</p>
          </div>
        )}

        {/* Submit Event CTA */}
        <div className="mt-12 bg-linear-to-br from-amber-950/30 to-transparent border border-amber-900/30 rounded-2xl p-8 text-center">
          <h3 className="font-serif text-2xl text-amber-400 mb-2">Know of an event we&apos;re missing?</h3>
          <p className="text-gray-300 mb-4">Help us build the most comprehensive mezcal calendar.</p>
          <a
            href="mailto:events@mezcal.com"
            className="inline-block rounded-lg bg-amber-600 px-6 py-3 transition-colors hover:bg-amber-500"
          >
            Submit an Event
          </a>
        </div>
      </div>
    </div>
  );
}
