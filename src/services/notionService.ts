import { supabase } from '@/lib/supabase';

export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
}

export interface NotionPage {
  id: string;
  title: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
}

export interface HubData {
  contacts: any[];
  transactions: any[];
  documents: any[];
  calendar_events: any[];
  performance_stats: any;
}

class NotionService {
  private apiKey: string | null = null;

  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    // Get API key from Supabase secrets via edge function
    const { data, error } = await supabase.functions.invoke('get-notion-config');
    
    if (error) {
      throw new Error('Impossible de récupérer la configuration Notion');
    }
    
    this.apiKey = data.apiKey;
    return this.apiKey;
  }

  private async makeNotionRequest(endpoint: string, options: RequestInit = {}) {
    const apiKey = await this.getApiKey();
    
    const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur Notion API: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Récupère toutes les bases de données accessibles
   */
  async getDatabases(): Promise<NotionDatabase[]> {
    const response = await this.makeNotionRequest('/search', {
      method: 'POST',
      body: JSON.stringify({
        filter: { property: 'object', value: 'database' }
      })
    });

    return response.results.map((db: any) => ({
      id: db.id,
      title: db.title[0]?.plain_text || 'Sans titre',
      properties: db.properties
    }));
  }

  /**
   * Crée une page dans une base de données Notion
   */
  async createPage(databaseId: string, properties: Record<string, any>, content?: any[]): Promise<NotionPage> {
    const body: any = {
      parent: { database_id: databaseId },
      properties
    };

    if (content) {
      body.children = content;
    }

    return await this.makeNotionRequest('/pages', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * Synchronise les données du hub avec Notion
   */
  async syncHubDataToNotion(databaseId: string, hubData: HubData): Promise<{ success: boolean; synced: number; errors: string[] }> {
    const results = {
      success: true,
      synced: 0,
      errors: [] as string[]
    };

    try {
      // Synchroniser les contacts
      for (const contact of hubData.contacts) {
        try {
          await this.createPage(databaseId, {
            'Nom': { title: [{ text: { content: contact.name || 'Contact' } }] },
            'Email': { email: contact.email || null },
            'Téléphone': { phone_number: contact.phone || null },
            'Type': { select: { name: 'Contact' } },
            'Date de création': { date: { start: contact.created_at || new Date().toISOString() } }
          });
          results.synced++;
        } catch (error) {
          results.errors.push(`Erreur contact ${contact.name}: ${error}`);
        }
      }

      // Synchroniser les transactions
      for (const transaction of hubData.transactions) {
        try {
          await this.createPage(databaseId, {
            'Nom': { title: [{ text: { content: `Transaction - ${transaction.type}` } }] },
            'Montant': { number: transaction.amount || 0 },
            'Commission': { number: transaction.commission || 0 },
            'Type': { select: { name: 'Transaction' } },
            'Date': { date: { start: transaction.date || new Date().toISOString() } }
          });
          results.synced++;
        } catch (error) {
          results.errors.push(`Erreur transaction: ${error}`);
        }
      }

      // Synchroniser les événements du calendrier
      for (const event of hubData.calendar_events) {
        try {
          await this.createPage(databaseId, {
            'Nom': { title: [{ text: { content: event.title || 'Événement' } }] },
            'Description': { rich_text: [{ text: { content: event.description || '' } }] },
            'Type': { select: { name: 'Événement' } },
            'Date de début': { date: { start: event.start_date || new Date().toISOString() } },
            'Date de fin': { date: { start: event.end_date || new Date().toISOString() } }
          });
          results.synced++;
        } catch (error) {
          results.errors.push(`Erreur événement ${event.title}: ${error}`);
        }
      }

      // Synchroniser les statistiques de performance
      if (hubData.performance_stats) {
        try {
          await this.createPage(databaseId, {
            'Nom': { title: [{ text: { content: 'Statistiques Performance' } }] },
            'Ventes': { number: hubData.performance_stats.sales || 0 },
            'Compromis': { number: hubData.performance_stats.compromis || 0 },
            'Commission': { number: hubData.performance_stats.commission || 0 },
            'Type': { select: { name: 'Statistiques' } },
            'Date': { date: { start: new Date().toISOString() } }
          });
          results.synced++;
        } catch (error) {
          results.errors.push(`Erreur statistiques: ${error}`);
        }
      }

    } catch (error) {
      results.success = false;
      results.errors.push(`Erreur générale: ${error}`);
    }

    return results;
  }

  /**
   * Test de la connexion à l'API Notion
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.makeNotionRequest('/users/me');
      return {
        success: true,
        message: 'Connexion à Notion réussie!'
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de connexion: ${error}`
      };
    }
  }
}

export const notionService = new NotionService();
export default notionService;