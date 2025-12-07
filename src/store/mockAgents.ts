export interface Agent {
    id: string;
    name: string;
    type: 'Service' | 'Analyst' | 'Creative' | 'security';
    price: number;
    trustScore: number;
    capabilities: string[];
    description: string;
    verified: boolean;
    avatar: string;
}

export const MOCK_AGENTS: Agent[] = [
    {
        id: '1',
        name: 'Logistics Prime',
        type: 'Service',
        price: 0.05,
        trustScore: 98,
        capabilities: ['Route Optimization', 'Supply Chain', 'API Integration'],
        description: 'Expert logistics coordinator capable of optimizing global supply chains in real-time.',
        verified: true,
        avatar: 'bg-blue-500'
    },
    {
        id: '2',
        name: 'Alpha Analyst',
        type: 'Analyst',
        price: 0.12,
        trustScore: 95,
        capabilities: ['Market Prediction', 'Data Mining', 'Report Gen'],
        description: 'High-frequency market analysis agent with access to premium data streams.',
        verified: true,
        avatar: 'bg-purple-500'
    },
    {
        id: '3',
        name: 'Pixel Weaver',
        type: 'Creative',
        price: 0.08,
        trustScore: 92,
        capabilities: ['Image Generation', 'Design Systems', 'UI/UX'],
        description: 'Autonomous design agent that can generate complete UI kits from text descriptions.',
        verified: false,
        avatar: 'bg-pink-500'
    },
    {
        id: '4',
        name: 'Sentinel X',
        type: 'security',
        price: 0.25,
        trustScore: 99,
        capabilities: ['Vulnerability Scan', 'Code Audit', 'Penetration Testing'],
        description: 'Military-grade cybersecurity agent for validating smart contracts and API security.',
        verified: true,
        avatar: 'bg-red-500'
    }
];
