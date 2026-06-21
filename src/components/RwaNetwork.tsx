/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { RwaAsset, Agent } from "../types";
import { 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  BarChart2, 
  FileText, 
  Check, 
  Map as MapIcon, 
  Compass, 
  Layers, 
  Radar, 
  Activity, 
  ExternalLink,
  ShieldAlert,
  Zap,
  X,
  Target,
  Database,
  Satellite
} from "lucide-react";

interface RwaNetworkProps {
  assets: RwaAsset[];
  agents: Agent[];
  isAnalysisLoading: boolean;
  onAttestAsset: (assetId: string) => void;
  onAnalyzeAsset: (assetId: string) => void;
  selectedAssetAnalysis: string;
}

export default function RwaNetwork({
  assets,
  agents,
  isAnalysisLoading,
  onAttestAsset,
  onAnalyzeAsset,
  selectedAssetAnalysis
}: RwaNetworkProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>("rwa-1");
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFlyoutOpen, setIsFlyoutOpen] = useState<boolean>(true);
  const [flyoutTab, setFlyoutTab] = useState<"integrity" | "telemetry" | "blockchain">("integrity");
  const [showHeatMap, setShowHeatMap] = useState<boolean>(false);
  const [mapSearchQuery, setMapSearchQuery] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [isMapSearchFocused, setIsMapSearchFocused] = useState<boolean>(false);

  const currentAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Filtered assets specifically for the Map search/geocoder (by name, ID, or country/region)
  const mapSearchSuggestions = useMemo(() => {
    if (!mapSearchQuery.trim()) return [];
    const query = mapSearchQuery.toLowerCase().trim();
    return assets.filter(asset => {
      return (
        asset.name.toLowerCase().includes(query) ||
        asset.id.toLowerCase().includes(query) ||
        asset.originCountry.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query)
      );
    });
  }, [assets, mapSearchQuery]);

  // Verified Carbon Credits assets for the heatmap overlay
  const carbonHeatNodes = useMemo(() => {
    return assets.filter(asset => asset.category === "Carbon Credits" && asset.isAttested);
  }, [assets]);

  // Categories list
  const categories = ["all", "Carbon Credits", "Commodities", "Real Estate", "Supply Chain"];

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchCat = selectedCategory === "all" || asset.category === selectedCategory;
      const matchSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.originCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [assets, selectedCategory, searchQuery]);

  // Coordinates Mapping projection helper: translates lat/lng to standard 0-100 coordinates
  // representing percentage positions on our beautiful grid map.
  const getMapCoords = (lat: number, lng: number) => {
    // Standard basic linear projection for a clean tech-grid layout
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    
    // Safety clamp values inside the bounding box
    const clampedY = Math.max(12, Math.min(88, y));
    const clampedX = Math.max(8, Math.min(92, x));
    
    return { x: clampedX, y: clampedY };
  };

  return (
    <div id="rwa-network-module" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      
      {/* Module Title and Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-5 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-pink-500 animate-pulse" />
            RWA Intelligence Network
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Physical assets linked, rated, and continuously validated on Casper block state via compliance oracles.
          </p>
        </div>

        {/* Navigation / Switch View tools */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          {/* Search bar inside module */}
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 w-full sm:w-48 focus:border-pink-500 font-mono outline-none placeholder:text-zinc-650"
          />

          {/* Table vs Map list selection switcher */}
          <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 shrink-0 font-mono text-[10.5px]">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "map"
                  ? "bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Geospatial Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Audit Registry
            </button>
          </div>
        </div>
      </div>

      {/* Category filters line */}
      <div className="flex flex-wrap gap-2 mb-4 font-mono text-[10px]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full border transition-all ${
              selectedCategory === cat
                ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
                : "bg-zinc-900/40 text-zinc-500 border-zinc-850 hover:text-zinc-300"
            }`}
          >
            {cat === "all" ? "ALL ASSETS" : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {viewMode === "map" ? (
        /* ==================== GEOSPATIAL MAP VIEW ==================== */
        <div className="grid grid-cols-1 gap-5" id="rwa-network-map-layout">
          
          {/* Main Widescreen Map Canvas Area */}
          <div className="relative bg-zinc-950/90 rounded-xl border border-zinc-800/80 h-[500px] p-4 overflow-hidden flex flex-col justify-between">
            
            {/* Tech overlays and toggles */}
            <div className="absolute top-3 left-3 z-10 flex flex-col sm:flex-row gap-2">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded px-2.5 py-1 font-mono text-[9px] text-zinc-300 flex items-center gap-1.5 backdrop-blur-sm">
                <Radar className="w-3 h-3 text-pink-500 animate-spin" />
                <span>LIVE ORACLE RADAR &mdash; CLICK MARKERS TO FOCUS FLYOUT</span>
              </div>
              <button
                id="heatmap-toggle-btn"
                onClick={() => setShowHeatMap(prev => !prev)}
                className={`border rounded px-2.5 py-1 font-mono text-[9px] flex items-center gap-1.5 backdrop-blur-sm transition-all shadow-md active:scale-95 ${
                  showHeatMap
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/35 hover:bg-amber-500/20 font-bold"
                    : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850"
                }`}
                title="Toggle Carbon Credit Concentration Heat Map Layer"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${showHeatMap ? "bg-amber-500 animate-pulse" : "bg-zinc-600"}`} />
                <span>CARBON DECARBONIZATION HEATMAP</span>
              </button>
            </div>

            {/* Heatmap concentration intensity reference / legend */}
            {showHeatMap && (
              <div className="absolute bottom-16 left-4 z-10 bg-zinc-950/95 border border-zinc-850/80 p-2 rounded-lg font-mono text-[8px] text-zinc-400 backdrop-blur-md flex items-center gap-2 shadow-xl">
                <span className="text-zinc-500 uppercase tracking-tight block">CARBON CONCENTRATE:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-orange-600/20 border border-orange-500/30"></div>
                  <span>LOW</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-orange-500/50 border border-orange-400/40"></div>
                  <span>MID</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-amber-400 border border-amber-300 shadow-md animate-pulse"></div>
                  <span>HIGH CORE</span>
                </div>
              </div>
            )}

            {/* GEOSPATIAL MAP GEOCYBER SEARCH CONTROLS */}
            <div className="absolute top-3 right-3 z-30 w-72 pointer-events-auto">
              <div className="relative bg-zinc-950/95 border border-zinc-800 rounded-lg shadow-xl overflow-visible backdrop-blur-md">
                <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-zinc-850">
                  <Compass className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Map (Name, ID, Region)..."
                    value={mapSearchQuery}
                    onChange={(e) => {
                      setMapSearchQuery(e.target.value);
                      setIsMapSearchFocused(true);
                    }}
                    onFocus={() => setIsMapSearchFocused(true)}
                    className="bg-transparent text-[10px] font-mono text-zinc-200 outline-none w-full placeholder:text-zinc-650"
                  />
                  {mapSearchQuery && (
                    <button 
                      onClick={() => {
                        setMapSearchQuery("");
                        setIsMapSearchFocused(false);
                      }}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Suggestions List Dropdown */}
                {isMapSearchFocused && mapSearchQuery.trim() !== "" && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-950/98 border border-zinc-800 rounded-lg shadow-2xl z-40 divide-y divide-zinc-905 scrollbar-thin">
                    {mapSearchSuggestions.length > 0 ? (
                      mapSearchSuggestions.map((asset) => {
                        const isCurrentlySelected = selectedAssetId === asset.id;
                        return (
                          <button
                            key={`search-suggest-${asset.id}`}
                            className={`w-full text-left px-3 py-2 text-[9.5px] font-mono transition-colors flex flex-col gap-0.5 hover:bg-zinc-900/80 ${
                              isCurrentlySelected ? "bg-pink-500/5 text-pink-400" : "text-zinc-300"
                            }`}
                            onClick={() => {
                              setSelectedAssetId(asset.id);
                              onAnalyzeAsset(asset.id);
                              setIsFlyoutOpen(true);
                              if (selectedCategory !== "all" && selectedCategory !== asset.category) {
                                setSelectedCategory("all");
                              }
                              
                              // Smooth zoom and center coordinates calculation
                              const { coords = { lat: 0, lng: 0 } } = asset;
                              const { x, y } = getMapCoords(asset.coordinates?.lat || coords.lat, asset.coordinates?.lng || coords.lng);
                              setMapCenter({ x, y });
                              setMapZoom(2.2); // Smooth zoom focusing in
                              
                              // Formally update search box to display his selected name but close dropdown list
                              setMapSearchQuery(asset.name);
                              setIsMapSearchFocused(false);
                            }}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="font-bold truncate max-w-[160px] text-white">{asset.name}</span>
                              <span className="text-[8px] bg-zinc-900 px-1 rounded text-zinc-400 border border-zinc-850 uppercase">
                                {asset.id}
                              </span>
                            </div>
                            <div className="flex justify-between text-[7.5px] text-zinc-500">
                              <span>Region: {asset.originCountry}</span>
                              <span className="text-pink-500">{asset.category}</span>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-[9px] font-mono text-zinc-500 italic text-center">
                        No geospatial matches found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reset View & Map Utility Actions */}
              {(mapZoom !== 1 || mapCenter.x !== 50 || mapCenter.y !== 50) && (
                <button
                  onClick={() => {
                    setMapCenter({ x: 50, y: 50 });
                    setMapZoom(1);
                    setMapSearchQuery("");
                  }}
                  className="mt-1.5 float-right bg-zinc-905/95 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded px-2 py-0.5 font-mono text-[7.5px] uppercase transition-all flex items-center gap-1 shadow-md active:scale-95"
                >
                  <X className="w-2.5 h-2.5 text-pink-500" />
                  <span>Reset Center/Zoom</span>
                </button>
              )}
            </div>

            {/* MANUAL MAP VIEWPORT ZOOM CONTROLS */}
            <div className="absolute bottom-16 right-4 z-30 flex flex-col gap-1 pointer-events-auto">
              <button
                onClick={() => setMapZoom(prev => Math.min(4, prev + 0.3))}
                className="w-6 h-6 bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center transition-colors shadow-lg active:scale-90"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(1, prev - 0.3))}
                className="w-6 h-6 bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center transition-colors shadow-lg active:scale-90"
                title="Zoom Out"
              >
                &minus;
              </button>
            </div>

            {/* ZOOMABLE & PANNABLE MAP WRAPPER LAYER */}
            <div 
              id="zoomable-map-wrapper"
              className="absolute inset-0 z-0 origin-center transition-all duration-700 ease-out"
              style={{
                transform: `scale(${mapZoom}) translate(${50 - mapCenter.x}%, ${50 - mapCenter.y}%)`,
              }}
            >
              {/* Simulated Mercator/Grid world map */}
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto select-none opacity-80">
                {/* Complex futuristic background vector matrix system */}
                <svg width="100%" height="100%" className="text-zinc-850/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Horizontal and Vertical Grid lines */}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line 
                      key={`v-${i}`} 
                      x1={i * 10} 
                      y1="0" 
                      x2={i * 10} 
                      y2="100" 
                      stroke="currentColor" 
                      strokeWidth="0.08" 
                      strokeDasharray="1,2" 
                    />
                  ))}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line 
                      key={`h-${i}`} 
                      x1="0" 
                      y1={i * 10} 
                      x2="100" 
                      y2={i * 10} 
                      stroke="currentColor" 
                      strokeWidth="0.08" 
                      strokeDasharray="1,2" 
                    />
                  ))}

                  {/* Simulated continents/boundaries drawn with stylistic paths */}
                  {/* Americas layout */}
                  <path d="M 12,20 Q 15,18 20,25 T 18,35 T 25,50 T 32,70 T 35,88 L 30,88 T 22,78 T 16,60 T 12,45 Z" fill="rgba(30,30,35,0.06)" stroke="currentColor" strokeWidth="0.1" />
                  {/* Europe & Africa layout */}
                  <path d="M 45,20 Q 52,15 62,20 T 58,40 T 52,50 T 48,70 T 55,80 T 58,85 L 48,82 T 42,70 T 40,45 T 42,30 Z" fill="rgba(30,30,35,0.06)" stroke="currentColor" strokeWidth="0.1" />
                  {/* Asia & Australia */}
                  <path d="M 62,20 Q 75,18 85,25 T 90,35 T 95,50 Q 82,75 85,85 L 75,85 T 72,70 T 70,50 T 63,35 Z" fill="rgba(30,30,35,0.06)" stroke="currentColor" strokeWidth="0.1" />
                  
                  {/* Latitudinal equator indicator */}
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(219,39,119,0.15)" strokeWidth="0.15" />
                </svg>
              </div>

              {/* HEAT MAP LAYER FOR VERIFIED CARBON CREDITS CONCENTRATION */}
              {showHeatMap && (
                <div id="heatmap-layer-ambient" className="absolute inset-0 z-5 pointer-events-none overflow-hidden select-none">
                  {carbonHeatNodes.map((asset) => {
                    const { coords = { lat: 0, lng: 0 } } = asset;
                    const { x, y } = getMapCoords(asset.coordinates?.lat || coords.lat, asset.coordinates?.lng || coords.lng);
                    return (
                      <div
                        key={`heatmap-${asset.id}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        {/* Pulse ring indicating highly concentrated thermal carbon credit offset density */}
                        <div className="absolute w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/15 blur-xl animate-pulse" />
                        <div className="absolute w-44 h-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-2xl" />
                        <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl opacity-75" />
                        
                        {/* Subtle high density focal target ring */}
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-orange-500/30 animate-pulse flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* INTERACTIVE GEOSPATIAL MAP PINS */}
              <div className="absolute inset-0 z-10 pointer-events-auto">
                {filteredAssets.map((asset) => {
                  const { coords = { lat: 0, lng: 0 } } = asset;
                  const { x, y } = getMapCoords(asset.coordinates?.lat || coords.lat, asset.coordinates?.lng || coords.lng);
                  const isSelected = selectedAssetId === asset.id;
                  
                  // Color codes: 
                  // green for high confidence verified & attested, 
                  // amber for unattested, red for warning/high risk profile.
                  let markerBg = "bg-amber-500";
                  let ringColor = "ring-amber-500/30";
                  let markerColorText = "text-amber-400";
                  if (asset.isAttested) {
                    markerBg = "bg-emerald-500";
                    ringColor = "ring-emerald-500/30";
                    markerColorText = "text-emerald-400";
                  } else if (asset.riskScore > 20) {
                    markerBg = "bg-red-500";
                    ringColor = "ring-red-500/30";
                    markerColorText = "text-red-400";
                  }

                  return (
                    <div 
                      key={asset.id}
                      className="absolute cursor-pointer group transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        onAnalyzeAsset(asset.id);
                        setIsFlyoutOpen(true);
                        setMapCenter({ x, y });
                        setMapZoom(2.2);
                      }}
                    >
                    {/* Glowing outer aura and scanning corner targets for selected item */}
                    {isSelected && (
                      <>
                        <div className="absolute -inset-5 rounded-full bg-pink-500/5 border border-pink-500/20 animate-ping opacity-35"></div>
                        <div className="absolute -inset-3.5 pointer-events-none">
                          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-pink-500"></div>
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-pink-500"></div>
                          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-pink-500"></div>
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-pink-500"></div>
                        </div>
                      </>
                    )}

                    {/* Outer sonar ring wrapper */}
                    <div className={`p-1.5 rounded-full ring-2 transition-all duration-300 ${
                      isSelected ? "scale-125 ring-pink-500/50 bg-zinc-900" : `ring-transparent hover:ring-zinc-700/40 bg-transparent`
                    }`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center relative ${markerBg}`}>
                        {/* Dynamic ping indicator */}
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${markerBg}`}></span>
                        
                        {/* Tiny center core dot */}
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Popover Hover Label with quick metrics */}
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-950/95 border px-2.5 py-1.5 rounded shadow-xl font-mono text-[9px] w-48 text-zinc-300 transition-all pointer-events-none flex flex-col gap-1 z-30 ${
                      isSelected 
                        ? "opacity-100 scale-100 visible border-pink-500/50" 
                        : "opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible border-zinc-800"
                    }`}>
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                        <span className="font-bold text-white truncate max-w-[110px]">{asset.name}</span>
                        <span className="text-[8px] uppercase font-black text-zinc-500">{asset.category}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>ConfidenceScore:</span>
                        <span className={markerColorText}>{asset.confidenceScore}%</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>Valuation:</span>
                        <span className="text-white">${(asset.valuationUsd / 1000).toFixed(0)}k USD</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>Status:</span>
                        <span className={asset.isAttested ? "text-emerald-400" : "text-amber-500"}>
                          {asset.isAttested ? "ATTESTED" : "UNATTESTED"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED SIDE-PANEL FLYOUT DRAWER OVERLAY */}
            <div 
              id="details-flyout-drawer"
              className={`absolute top-0 right-0 h-full w-full sm:w-85 bg-zinc-950/98 border-l border-zinc-800/90 z-20 flex flex-col justify-between transform transition-transform duration-300 shadow-2xl ${
                isFlyoutOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Flyout Header */}
              <div className="p-4 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-500 animate-pulse" />
                  <div>
                    <span className="text-[8px] font-mono text-pink-400 tracking-wider font-black uppercase block">
                      GEOSPATIAL ASSET DOSSIER
                    </span>
                    <span className="text-xs font-mono text-zinc-400 font-bold">
                      ID: {currentAsset.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsFlyoutOpen(false)}
                  className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Close Flyout"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Flyout Scrollable Content Area */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {/* Asset Title info */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-zinc-900 text-[8px] px-1.5 py-0.5 rounded font-mono border border-zinc-800 text-zinc-400">
                      {currentAsset.category.toUpperCase()}
                    </span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${
                      currentAsset.isAttested 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}>
                      {currentAsset.isAttested ? "ATTESTED ONCHAIN" : "UNATTESTED PROOF"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                    {currentAsset.name}
                  </h3>
                </div>

                {/* Sub-Tabs Selector inside flyout */}
                <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850 font-mono text-[9px] w-full">
                  <button
                    onClick={() => setFlyoutTab("integrity")}
                    className={`flex-1 py-1 px-1.5 rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                      flyoutTab === "integrity"
                        ? "bg-pink-500/10 text-pink-400 font-bold border border-pink-500/15"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    AUDIT
                  </button>
                  <button
                    onClick={() => setFlyoutTab("telemetry")}
                    className={`flex-1 py-1 px-1.5 rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                      flyoutTab === "telemetry"
                        ? "bg-pink-500/10 text-pink-400 font-bold border border-pink-500/15"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Satellite className="w-3 h-3" />
                    COORDS
                  </button>
                  <button
                    onClick={() => setFlyoutTab("blockchain")}
                    className={`flex-1 py-1 px-1.5 rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                      flyoutTab === "blockchain"
                        ? "bg-pink-500/10 text-pink-400 font-bold border border-pink-500/15"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Database className="w-3 h-3" />
                    LEDGER
                  </button>
                </div>

                {/* Dynamic Tab Contents */}
                {flyoutTab === "integrity" && (
                  <div className="space-y-3.5 animation-fade-in text-[10.5px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-zinc-900/60 border border-zinc-850 rounded p-2 text-center">
                        <span className="text-[8px] text-zinc-550 block uppercase font-mono">Consensus Confidence</span>
                        <span className="text-base font-black text-emerald-400 font-mono">{currentAsset.confidenceScore}%</span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-850 rounded p-2 text-center">
                        <span className="text-[8px] text-zinc-550 block uppercase font-mono">Geospatial Risk Factor</span>
                        <span className="text-base font-black text-rose-400 font-mono">{currentAsset.riskScore}%</span>
                      </div>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-850 p-2.5 rounded font-mono space-y-1 text-zinc-400">
                      <div className="flex justify-between">
                        <span className="text-zinc-550">USD Appraisal:</span>
                        <span className="text-white font-bold">${currentAsset.valuationUsd.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-550">Legal Custodian:</span>
                        <span className="text-zinc-300 truncate max-w-[120px]" title={currentAsset.provider}>{currentAsset.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-550">Sync Check:</span>
                        <span className="text-teal-400 font-bold">Passed</span>
                      </div>
                    </div>

                    {/* Gemini Oracle Analysis Box */}
                    <div className="bg-black border border-zinc-850 p-3 rounded-lg">
                      <div className="text-[8px] text-pink-400 font-semibold uppercase font-mono mb-1.5 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-pink-400" />
                        <span>Autonomous Audit Argument</span>
                      </div>
                      {isAnalysisLoading ? (
                        <div className="flex items-center gap-1.5 text-zinc-500 py-3 font-mono text-[9px]">
                          <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
                          <span>Synthesizing satellite radar imagery...</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-300 font-sans leading-relaxed">
                          {selectedAssetAnalysis || currentAsset.detailedAudit}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {flyoutTab === "telemetry" && (
                  <div className="space-y-3 animation-fade-in font-mono text-[10.5px]">
                    <div className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Asset Latitude:</span>
                        <span className="text-white font-bold">{currentAsset.coordinates?.lat || "0.00"}° N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Asset Longitude:</span>
                        <span className="text-white font-bold">{currentAsset.coordinates?.lng || "0.00"}° E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Origin Registry:</span>
                        <span className="text-pink-400 font-bold">{currentAsset.originCountry}</span>
                      </div>
                    </div>

                    <div className="bg-black border border-zinc-900/80 p-2.5 rounded font-mono text-[9px] text-zinc-500 space-y-1">
                      <p className="text-[8px] text-zinc-400 font-semibold uppercase mb-1">RADAR TELEMETRY LOCK</p>
                      <p>&gt; BEARING LOCK: CSPR_SAT_09A</p>
                      <p>&gt; LATENCY STAGE: OK &mdash; 12ms API Sync</p>
                      <p>&gt; SAT QUALITY INDEX: 99.4% (EXCELLENT)</p>
                      <p>&gt; PROVIDER SYNC: {currentAsset.provider.toUpperCase()}</p>
                    </div>

                    <div className="text-[9.5px] text-zinc-400 flex items-start gap-1.5 bg-zinc-900/25 p-2.5 border border-zinc-850 rounded">
                      <Compass className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <p className="font-sans leading-tight">
                        Geospatial positions are backed by continuous digital signatures from local IoT nodes and IoT gateway firmware on-site.
                      </p>
                    </div>
                  </div>
                )}

                {flyoutTab === "blockchain" && (
                  <div className="space-y-3 animation-fade-in font-mono text-[10px]">
                    <div className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500">WASM Ledger Proof:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          currentAsset.isAttested ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {currentAsset.isAttested ? "CASPER_VALID" : "PENDING_ATTESTATION"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500">Contract Standard:</span>
                        <span className="text-white">Odra CEP-78 (RWA Wrapper)</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500">Signer Oracle:</span>
                        <span className="text-zinc-300">{currentAsset.provider}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500">Last Verified Epoch:</span>
                        <span className="text-zinc-300">{currentAsset.lastUpdated}</span>
                      </div>
                    </div>

                    {currentAsset.attestationHash ? (
                      <div className="bg-black border border-zinc-850 p-2.5 rounded-lg">
                        <span className="text-[8px] text-zinc-550 block uppercase font-bold mb-1">
                          On-Chain Cryptographic Attestation Hash
                        </span>
                        <span className="text-[9px] text-pink-400 block break-all leading-relaxed select-all">
                          {currentAsset.attestationHash}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-amber-500/5 border border-amber-500/15 p-2.5 text-amber-500/90 rounded text-[9px] leading-tight">
                        Warning: This physical asset is currently missing a verified cryptographic commitment on the Casper Ledger. Request verification below.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Flyout Actions Bottom bar */}
              <div className="p-4 border-t border-zinc-850 bg-zinc-900/40 flex gap-2">
                <button
                  onClick={() => onAnalyzeAsset(currentAsset.id)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[10.5px] py-2 rounded font-mono border border-zinc-750 transition-colors flex items-center justify-center gap-1"
                >
                  <Radar className="w-3.5 h-3.5 text-pink-400" />
                  RE-RUN AUDIT
                </button>
                
                {!currentAsset.isAttested && (
                  <button
                    onClick={() => onAttestAsset(currentAsset.id)}
                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-black text-[10.5px] py-2 rounded font-mono transition-transform hover:scale-[1.02] flex items-center justify-center gap-1 shadow-lg shadow-pink-600/15 animate-pulse"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ATTEST WASM
                  </button>
                )}
              </div>
            </div>

            {/* Floating button to restore information panel if closed */}
            {!isFlyoutOpen && (
              <button
                onClick={() => setIsFlyoutOpen(true)}
                className="absolute bottom-16 right-4 z-10 bg-pink-600 hover:bg-pink-550 text-white px-3.5 py-1.5 rounded-full shadow-lg border border-pink-500/30 transition-all hover:scale-103 font-mono text-[9px] flex items-center gap-1.5 font-bold"
              >
                <Layers className="w-3.5 h-3.5 text-white" />
                <span>EXPAND SPECIFICATION DOSSIER</span>
              </button>
            )}

            {/* Bottom coordinate indicators overlay bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-lg z-10 w-full mt-auto font-mono text-[10px] text-zinc-400">
              <div>
                <span className="text-[8px] block text-zinc-500">SELECTED ASSET COORDINATE ACCORD</span>
                <span className="font-bold text-zinc-200 truncate block max-w-[135px]">{currentAsset.name}</span>
              </div>
              <div>
                <span className="text-[8px] block text-zinc-500">ORIGIN REF</span>
                <span className="font-bold text-zinc-300">
                  {currentAsset.originCountry} ({currentAsset.coordinates?.lat.toFixed(2)}°, {currentAsset.coordinates?.lng.toFixed(2)}°)
                </span>
              </div>
              <div>
                <span className="text-[8px] block text-zinc-500">RADAR LOCK TYPE</span>
                <span className="text-teal-400 font-bold">12ms Telemetry Live</span>
              </div>
              <div>
                <span className="text-[8px] block text-zinc-500">INTEGRITY CERTIFICATE</span>
                <span className="text-emerald-400 font-bold">AUTHORIZED LEVEL</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ==================== LIST TABLE AUDIT VIEW ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Real-world assets list left column */}
          <div className="space-y-3 lg:col-span-1 max-h-[460px] overflow-y-auto pr-1">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => {
                  setSelectedAssetId(asset.id);
                  onAnalyzeAsset(asset.id);
                }}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedAssetId === asset.id 
                    ? "bg-zinc-900 border-pink-500" 
                    : "bg-zinc-900/40 hover:bg-zinc-900/70 border-zinc-850"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-zinc-500">{asset.category.toUpperCase()}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    asset.isAttested 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-550/20" 
                      : "bg-amber-500/10 text-amber-500 border border-amber-550/20"
                  }`}>
                    {asset.isAttested ? "ATTESTED" : "UNATTESTED"}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-white tracking-tight line-clamp-1">{asset.name}</h3>
                <p className="text-[10px] text-zinc-400 mt-1 font-mono">${asset.valuationUsd.toLocaleString()} USD valuation</p>

                <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-zinc-500">
                  <span>Confidence: {asset.confidenceScore}%</span>
                  <span>Risk Score: {asset.riskScore}%</span>
                </div>
              </div>
            ))}

            {filteredAssets.length === 0 && (
              <div className="text-center py-8 border border-zinc-850 rounded-lg text-zinc-500 font-mono text-xs">
                No matching assets found in registry.
              </div>
            )}
          </div>

          {/* Selected Asset Deep Dive / Auditing right side */}
          <div className="lg:col-span-2 bg-zinc-905/40 p-5 rounded-xl border border-zinc-800/80 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white truncate max-w-sm">{currentAsset.name}</h3>
                  <p className="text-[10px] font-mono text-zinc-500">Provider: {currentAsset.provider} | Origin: {currentAsset.originCountry}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400">STATE:</span>
                  <span className={`text-[10px] font-mono font-semibold ${currentAsset.isAttested ? "text-emerald-400" : "text-amber-400"}`}>
                    {currentAsset.isAttested ? "CASPER_PROOF_STATE_ACTIVE" : "PENDING_VERIFICATION_DEBATE"}
                  </span>
                </div>
              </div>

              {/* Ingestion audit report */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-zinc-900 text-xs font-mono rounded border border-zinc-850">
                  <h4 className="text-[9px] uppercase text-zinc-500 font-semibold mb-2">Triple-Entry Integrity Indicators</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span>Validation Trust Level</span>
                      <span className="text-green-400">{currentAsset.confidenceScore}% (Stable)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Geospatial Risk Factor</span>
                      <span className="text-zinc-300">{currentAsset.riskScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Telemetry Sync Latency</span>
                      <span className="text-zinc-300">12ms (Direct API Sync)</span>
                    </div>
                    {currentAsset.attestationHash && (
                      <div className="flex flex-col mt-2 pt-2 border-t border-zinc-800">
                        <span className="text-[8px] text-zinc-500 font-semibold">ON-CHAIN ATTESTATION HASH</span>
                        <span className="text-[8px] text-zinc-400 select-all truncate">{currentAsset.attestationHash}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-zinc-900 text-xs rounded border border-zinc-850">
                  <h4 className="text-[9px] uppercase font-mono text-zinc-500 font-semibold mb-2">Agent Audit Summary</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{currentAsset.detailedAudit}</p>
                </div>
              </div>

              {/* AI verification engine feed */}
              <div className="p-3.5 bg-black rounded border border-zinc-850 font-mono text-[10px] text-zinc-400 h-[100px] overflow-y-auto mb-4">
                <div className="text-[8px] text-pink-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>RWA INTELLIGENCE SWARM REPORT (GEMINI-POWERED)</span>
                </div>
                {isAnalysisLoading ? (
                  <div className="flex items-center gap-2 text-zinc-500 py-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
                    <span>Generating geospatial risk consensus reports and certificate state checks...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">{selectedAssetAnalysis || `Autonomous attestation reports reside on the Casper Blockchain. Pick an asset from left column to view generated state.`}</div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => onAnalyzeAsset(currentAsset.id)}
                className="bg-zinc-850 hover:bg-zinc-800 text-white font-semibold text-xs px-3.5 py-2 rounded font-mono border border-zinc-750 transition-all"
              >
                RE-RUN AGENT AUDIT
              </button>
              
              {!currentAsset.isAttested && (
                <button
                  onClick={() => onAttestAsset(currentAsset.id)}
                  className="bg-pink-500 hover:bg-pink-400 text-white font-semibold text-xs px-4 py-2 rounded font-mono transition-all flex items-center gap-1"
                >
                  <ShieldCheck className="w-4 h-4" /> ATTEST ON CASPER (WASM)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trust verification notes footer block */}
      <div className="mt-4 p-3 bg-zinc-900/40 rounded-lg border border-zinc-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-400">Triple-Entry cryptography binds physical property documents with dynamic onchain oracles to eradicate asset fraud.</span>
        </div>
        <span className="text-pink-400 hover:underline cursor-pointer flex items-center gap-1 uppercase text-[9px] font-bold">
          Casper Odra Compliance Spec
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>

    </div>
  );
}
