import { createContext } from 'react';
import type { Container } from '../../infrastructure/di/container.ts';

export const ContainerContext = createContext<Container | null>(null);
