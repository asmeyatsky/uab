import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';
import type { Agent, AgentType } from '../../domain/entities/agent.ts';
import type { BuildProgress } from '../../domain/ports/builder.port.ts';
import type { MarketplaceListingDTO } from '../../application/dtos/marketplace.dto.ts';

export type ViewId = 'marketplace' | 'builder' | 'dashboard' | 'explorer';

interface BuilderState {
  prompt: string;
  name: string;
  description: string;
  type: AgentType;
  selectedProtocols: ProtocolId[];
  protocolConfigs: Record<string, Record<string, unknown>>;
  buildProgress: BuildProgress | null;
  isBuilding: boolean;
  builtAgent: Agent | null;
  generatedConfig: Record<string, unknown> | null;
  step: number;
}

interface MarketplaceState {
  search: string;
  selectedProtocols: ProtocolId[];
  minRating: number;
  selectedListing: MarketplaceListingDTO | null;
  showNegotiation: boolean;
  showDetail: boolean;
}

interface AppState {
  currentView: ViewId;
  sidebarCollapsed: boolean;
  builder: BuilderState;
  marketplace: MarketplaceState;

  // Navigation
  setView: (view: ViewId) => void;
  toggleSidebar: () => void;

  // Builder actions
  setBuilderPrompt: (prompt: string) => void;
  setBuilderName: (name: string) => void;
  setBuilderDescription: (desc: string) => void;
  setBuilderType: (type: AgentType) => void;
  setBuilderStep: (step: number) => void;
  toggleProtocol: (id: ProtocolId) => void;
  setProtocolConfig: (id: ProtocolId, config: Record<string, unknown>) => void;
  setBuildProgress: (progress: BuildProgress | null) => void;
  setIsBuilding: (building: boolean) => void;
  setBuiltAgent: (agent: Agent | null) => void;
  setGeneratedConfig: (config: Record<string, unknown> | null) => void;
  resetBuilder: () => void;

  // Marketplace actions
  setMarketplaceSearch: (search: string) => void;
  toggleMarketplaceProtocol: (id: ProtocolId) => void;
  setMinRating: (rating: number) => void;
  setSelectedListing: (listing: MarketplaceListingDTO | null) => void;
  setShowNegotiation: (show: boolean) => void;
  setShowDetail: (show: boolean) => void;
}

const initialBuilderState: BuilderState = {
  prompt: '',
  name: '',
  description: '',
  type: 'assistant',
  selectedProtocols: [],
  protocolConfigs: {},
  buildProgress: null,
  isBuilding: false,
  builtAgent: null,
  generatedConfig: null,
  step: 0,
};

const initialMarketplaceState: MarketplaceState = {
  search: '',
  selectedProtocols: [],
  minRating: 0,
  selectedListing: null,
  showNegotiation: false,
  showDetail: false,
};

export const useAppStore = create<AppState>()(
  immer((set) => ({
    currentView: 'marketplace',
    sidebarCollapsed: false,
    builder: { ...initialBuilderState },
    marketplace: { ...initialMarketplaceState },

    setView: (view) => set((state) => { state.currentView = view; }),
    toggleSidebar: () => set((state) => { state.sidebarCollapsed = !state.sidebarCollapsed; }),

    setBuilderPrompt: (prompt) => set((state) => { state.builder.prompt = prompt; }),
    setBuilderName: (name) => set((state) => { state.builder.name = name; }),
    setBuilderDescription: (desc) => set((state) => { state.builder.description = desc; }),
    setBuilderType: (type) => set((state) => { state.builder.type = type; }),
    setBuilderStep: (step) => set((state) => { state.builder.step = step; }),

    toggleProtocol: (id) => set((state) => {
      const idx = state.builder.selectedProtocols.indexOf(id);
      if (idx >= 0) {
        state.builder.selectedProtocols.splice(idx, 1);
        delete state.builder.protocolConfigs[id];
      } else {
        state.builder.selectedProtocols.push(id);
      }
    }),

    setProtocolConfig: (id, config) => set((state) => {
      state.builder.protocolConfigs[id] = config;
    }),

    setBuildProgress: (progress) => set((state) => { state.builder.buildProgress = progress as typeof state.builder.buildProgress; }),
    setIsBuilding: (building) => set((state) => { state.builder.isBuilding = building; }),
    setBuiltAgent: (agent) => set((state) => { state.builder.builtAgent = agent as typeof state.builder.builtAgent; }),
    setGeneratedConfig: (config) => set((state) => { state.builder.generatedConfig = config; }),

    resetBuilder: () => set((state) => {
      state.builder = { ...initialBuilderState } as typeof state.builder;
    }),

    setMarketplaceSearch: (search) => set((state) => { state.marketplace.search = search; }),
    toggleMarketplaceProtocol: (id) => set((state) => {
      const idx = state.marketplace.selectedProtocols.indexOf(id);
      if (idx >= 0) {
        state.marketplace.selectedProtocols.splice(idx, 1);
      } else {
        state.marketplace.selectedProtocols.push(id);
      }
    }),
    setMinRating: (rating) => set((state) => { state.marketplace.minRating = rating; }),
    setSelectedListing: (listing) => set((state) => { state.marketplace.selectedListing = listing as typeof state.marketplace.selectedListing; }),
    setShowNegotiation: (show) => set((state) => { state.marketplace.showNegotiation = show; }),
    setShowDetail: (show) => set((state) => { state.marketplace.showDetail = show; }),
  }))
);
