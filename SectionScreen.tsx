import workbookJson from './workbook.json';
import affirmationsJson from './affirmations.json';
import statesJson from './states.json';
import resourcesJson from './resources.json';
import type { Workbook, Section, StateInfo } from '../logic/types';

export const workbook = workbookJson as unknown as Workbook;
export const sections: Section[] = workbook.sections;
export const parts = workbook.meta.parts;
export const decisionDefs = workbook.meta.decisionDefs;
export const decisionBannerCopy = workbook.meta.decisionBanner;

export const affirmations: string[] = (affirmationsJson as any).affirmations;
export const states: StateInfo[] = (statesJson as any).states;

export const howtoSteps = (resourcesJson as any).howtoSteps as { n: string; title: string; body: string }[];
export const kbArticles = (resourcesJson as any).kbArticles as { q: string; a: string }[];
export const legalDocs = (resourcesJson as any).legalDocs as { title: string; updated: string; paras: string[] }[];
export const industries = (resourcesJson as any).industries as string[];
export const bizTypes = (resourcesJson as any).bizTypes as string[];
