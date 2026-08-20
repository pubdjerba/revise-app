import { ChapterMeta } from './types';

export const LEITNER_INTERVALS: Record<number, number> = {
  1: 1,  // +1 séance
  2: 2,  // +2 séances
  3: 4,  // +4 séances
  4: 7,  // +7 séances
  5: 12, // +12 séances (Maîtrisé)
};

export const BOX_CONFIGS = [
  {
    box: 1,
    name: 'Boîte 1',
    label: 'À revoir',
    interval: '+1 séance',
    color: 'text-[#1A1A1A]',
    bgColor: 'bg-white',
    borderColor: 'border-[#1A1A1A]',
    badgeColor: 'bg-[#1A1A1A] text-white',
    dotColor: 'bg-[#1A1A1A]',
    barColor: 'bg-[#1A1A1A]',
    desc: 'Nouvelles questions ou erreurs récentes',
  },
  {
    box: 2,
    name: 'Boîte 2',
    label: 'En cours',
    interval: '+2 séances',
    color: 'text-[#1A1A1A]',
    bgColor: 'bg-white',
    borderColor: 'border-[#E5E4DE]',
    badgeColor: 'bg-[#2C2C2C] text-white',
    dotColor: 'bg-[#2C2C2C]',
    barColor: 'bg-[#2C2C2C]',
    desc: 'Apprentissage intermédiaire',
  },
  {
    box: 3,
    name: 'Boîte 3',
    label: 'Mémorisé',
    interval: '+4 séances',
    color: 'text-[#1A1A1A]',
    bgColor: 'bg-white',
    borderColor: 'border-[#E5E4DE]',
    badgeColor: 'bg-[#4A4A4A] text-white',
    dotColor: 'bg-[#4A4A4A]',
    barColor: 'bg-[#4A4A4A]',
    desc: 'Bonne consolidation',
  },
  {
    box: 4,
    name: 'Boîte 4',
    label: 'Solide',
    interval: '+7 séances',
    color: 'text-[#1A1A1A]',
    bgColor: 'bg-white',
    borderColor: 'border-[#E5E4DE]',
    badgeColor: 'bg-[#6A6A6A] text-white',
    dotColor: 'bg-[#6A6A6A]',
    barColor: 'bg-[#6A6A6A]',
    desc: 'Mémorisation long terme',
  },
  {
    box: 5,
    name: 'Boîte 5',
    label: 'Maîtrisé',
    interval: '+12 séances',
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-600',
    badgeColor: 'bg-emerald-600 text-white',
    dotColor: 'bg-emerald-600',
    barColor: 'bg-emerald-600',
    desc: 'Acquis de façon pérenne',
  },
];

export const CHAPTERS_DATA: ChapterMeta[] = [
  {
    id: 1,
    title: 'Droit Constitutionnel & Institutions',
    subtitle: 'Constitution de 1958, pouvoirs publics & contrôle constitutionnel',
    category: 'Chapitre 01',
    color: 'text-[#1A1A1A]',
    bgLight: 'bg-[#F4F3EF]',
    borderLight: 'border-[#E5E4DE]',
    iconName: 'Scale',
    dataFile: '/data/chapitre_1.json',
  },
  {
    id: 2,
    title: 'Droit Administratif & Fonction Publique',
    subtitle: 'Jurisprudence, actes unilatéraux & statut CGFP',
    category: 'Chapitre 02',
    color: 'text-[#1A1A1A]',
    bgLight: 'bg-[#F4F3EF]',
    borderLight: 'border-[#E5E4DE]',
    iconName: 'Building2',
    dataFile: '/data/chapitre_2.json',
  },
  {
    id: 3,
    title: 'Finances Publiques & Économie',
    subtitle: 'LOLF, principes budgétaires & comptabilité de l\'État',
    category: 'Chapitre 03',
    color: 'text-[#1A1A1A]',
    bgLight: 'bg-[#F4F3EF]',
    borderLight: 'border-[#E5E4DE]',
    iconName: 'Landmark',
    dataFile: '/data/chapitre_3.json',
  },
  {
    id: 4,
    title: 'Culture Générale & Union Européenne',
    subtitle: 'Traités européens, institutions & principes républicains',
    category: 'Chapitre 04',
    color: 'text-[#1A1A1A]',
    bgLight: 'bg-[#F4F3EF]',
    borderLight: 'border-[#E5E4DE]',
    iconName: 'Globe',
    dataFile: '/data/chapitre_4.json',
  },
];

export const STORAGE_KEY_PROGRESS = 'app_questions_progress';
export const STORAGE_KEY_SESSION = 'app_session';
