
import { useMemo } from 'react';
import { StatsData } from '@/types/stats';
import { formatCurrency } from '@/lib/utils';
import { Building2, FileCheck, FileText, Home, Users } from 'lucide-react';

interface SynthesisCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const useStatsSynthesisData = (stats: StatsData | undefined, isMobile: boolean): SynthesisCardData[] => {
  const synthesisCardData = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        title: "Unités de ventes avants contrats",
        value: stats.totalCompromis,
        icon: <Building2 size={isMobile ? 14 : 16} className="text-noovimo-500" />
      },
      {
        title: "Unités de ventes actés",
        value: stats.totalSales,
        icon: <Home size={isMobile ? 14 : 16} className="text-noovimo-500" />
      },
      {
        title: "Honoraires compromis",
        value: formatCurrency(stats.totalVolume * 0.05), // Estimation des honoraires sur compromis
        icon: <FileCheck size={isMobile ? 14 : 16} className="text-noovimo-500" />
      },
      {
        title: "Honoraires actés",
        value: formatCurrency(stats.totalCommission),
        icon: <FileText size={isMobile ? 14 : 16} className="text-noovimo-500" />
      },
      {
        title: "Commissions agents",
        value: formatCurrency(stats.totalCommission * 0.7), // Estimation des commissions agents
        icon: <Users size={isMobile ? 14 : 16} className="text-noovimo-500" />
      }
    ];
  }, [stats, isMobile]);

  return synthesisCardData;
};
