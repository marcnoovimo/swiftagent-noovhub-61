import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notionService, NotionDatabase, HubData } from '@/services/notionService';
import { useContacts } from './useContacts';
import { useCalendarEvents } from './useCalendarEvents';
import { usePerformanceData } from '@/components/dashboard/hooks/usePerformanceData';
import { useToast } from '@/components/ui/use-toast';

export const useNotion = () => {
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Hooks pour récupérer les données du hub
  const { contacts } = useContacts();
  const { events } = useCalendarEvents();
  const { monthlyData } = usePerformanceData();

  // Récupérer les bases de données Notion
  const { 
    data: databases = [], 
    isLoading: isDatabasesLoading, 
    error: databasesError 
  } = useQuery({
    queryKey: ['notion-databases'],
    queryFn: () => notionService.getDatabases(),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Test de connexion
  const { 
    mutate: testConnection, 
    isPending: isTestingConnection 
  } = useMutation({
    mutationFn: () => notionService.testConnection(),
    onSuccess: (result) => {
      toast({
        title: result.success ? "Connexion réussie" : "Erreur de connexion",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de test",
        description: `Impossible de tester la connexion: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Synchronisation avec Notion
  const { 
    mutate: syncToNotion, 
    isPending: isSyncing 
  } = useMutation({
    mutationFn: async () => {
      if (!selectedDatabaseId) {
        throw new Error('Veuillez sélectionner une base de données Notion');
      }

      // Préparer les données du hub
      const hubData: HubData = {
        contacts: contacts || [],
        transactions: [], // À implémenter avec vos données de transactions
        documents: [], // À implémenter avec vos données de documents
        calendar_events: events || [],
        performance_stats: {
          sales: monthlyData?.reduce((sum, item) => sum + (item.ventes || 0), 0) || 0,
          compromis: monthlyData?.reduce((sum, item) => sum + (item.compromis || 0), 0) || 0,
          commission: monthlyData?.reduce((sum, item) => sum + (item.commissions || 0), 0) || 0,
        }
      };

      return notionService.syncHubDataToNotion(selectedDatabaseId, hubData);
    },
    onSuccess: (result) => {
      toast({
        title: result.success ? "Synchronisation réussie" : "Synchronisation partielle",
        description: `${result.synced} éléments synchronisés${result.errors.length > 0 ? `, ${result.errors.length} erreurs` : ''}`,
        variant: result.success ? "default" : "destructive",
      });

      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['notion-databases'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur de synchronisation",
        description: `Impossible de synchroniser: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Créer une nouvelle base de données (fonction utilitaire)
  const createDatabase = async (title: string, properties: Record<string, any>) => {
    // Cette fonction nécessiterait des permissions supplémentaires dans Notion
    // Pour l'instant, on recommande de créer manuellement la base de données
    throw new Error('Veuillez créer manuellement la base de données dans Notion et la sélectionner ici');
  };

  return {
    // Données
    databases,
    selectedDatabaseId,
    
    // États de chargement
    isDatabasesLoading,
    isTestingConnection,
    isSyncing,
    
    // Erreurs
    databasesError,
    
    // Actions
    setSelectedDatabaseId,
    testConnection,
    syncToNotion,
    createDatabase,
    
    // Données du hub (pour affichage)
    hubData: {
      contacts: contacts || [],
      events: events || [],
      performance: monthlyData || []
    }
  };
};