
import { OpenAIConfig } from '@/types/chatbot';
import { searchDocumentsForQuery, formatDocumentsAsContext, isPriceQuery } from './documentSearchService';
import { getOpenAIResponse } from './openaiService';
import { CommissionService } from './commissionService';
import { supportGuides } from '@/data/guideData';

// Re-export document search functionality
export { searchDocumentsForQuery } from './documentSearchService';

// Search in support guides
export const searchSupportGuides = (query: string) => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = query.toLowerCase();
  
  return supportGuides.filter(guide => 
    guide.title.toLowerCase().includes(normalizedQuery) || 
    guide.content.toLowerCase().includes(normalizedQuery) ||
    guide.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  ).slice(0, 3); // Limit to 3 most relevant results
};

/**
 * Generate a chatbot response based on user query and document context
 */
export const generateChatbotResponse = async (
  query: string,
  documentSuggestions: any[],
  openaiConfig?: OpenAIConfig
): Promise<string> => {
  // Check if this is a guide-related question first
  const relevantGuides = searchSupportGuides(query);
  if (relevantGuides.length > 0) {
    const mainGuide = relevantGuides[0];
    const guideLinks = relevantGuides.map(guide => `- ${guide.title}`).join('\n');
    
    return `J'ai trouvé quelques guides dans notre documentation qui pourraient vous aider:\n\n${guideLinks}\n\nVoici un extrait du guide principal:\n"${mainGuide.title}": ${mainGuide.content.replace(/<[^>]*>/g, '').substring(0, 200)}...\n\nJe vous recommande de consulter la section Support pour plus de détails.`;
  }
  
  // Check if this is a price/pack question 
  const priceQuery = isPriceQuery(query);
  if (priceQuery.isPriceQuestion && priceQuery.packName) {
    try {
      const packName = priceQuery.packName;
      const pack = await CommissionService.getCommissionPacks()
        .then(packs => packs.find(p => p.id.toLowerCase().includes(packName)));
      
      if (pack) {
        return `Le Pack ${pack.name} coûte ${pack.monthlyFeeHT}€ HT par mois (${pack.monthlyFeeTTC}€ TTC). Ce pack propose des commissions de ${pack.ranges[0].percentage}% à ${pack.ranges[pack.ranges.length-1].percentage}% selon votre chiffre d'affaires.`;
      }
    } catch (error) {
      console.error("Error fetching commission pack data:", error);
    }
  }
  
  // If OpenAI config is provided, use the OpenAI API
  if (openaiConfig?.apiKey) {
    // Format documents as context strings
    const documentContexts = formatDocumentsAsContext(documentSuggestions);
    
    return await getOpenAIResponse(query, documentContexts, openaiConfig);
  }
  
  // Fallback to the mock response logic when no API key is configured
  const queryLower = query.toLowerCase();
  
  // Document request responses with direct links
  if (documentSuggestions.length > 0 && 
      (queryLower.includes('document') || queryLower.includes('fichier') || 
       queryLower.includes('mandat') || queryLower.includes('compromis'))) {
    return `J'ai trouvé ${documentSuggestions.length} document(s) qui semblent correspondre à votre recherche. Vous pouvez y accéder directement depuis les suggestions ci-dessous. Cliquez sur un document pour l'ouvrir dans la base documentaire.`;
  }
  
  // Intranet-related responses
  if (queryLower.includes('intranet') || queryLower.includes('plateforme') || queryLower.includes('système')) {
    return "L'intranet Noovimo est une solution complète conçue pour les agents immobiliers. Il comprend un tableau de bord personnalisé, un gestionnaire de documents, un calendrier synchronisable, une messagerie interne, un CRM pour la gestion des contacts, et des outils d'analyse de performance. Pour plus de détails sur une fonctionnalité spécifique, n'hésitez pas à me demander.";
  }
  
  if (queryLower.includes('document') || queryLower.includes('fichier')) {
    return "Le système de gestion documentaire de Noovimo vous permet d'organiser, stocker et partager des documents importants. Vous pouvez télécharger des fichiers, scanner des documents, et les classer par catégories. J'ai sélectionné quelques guides dans les suggestions ci-dessous qui pourraient vous aider.";
  }
  
  if (queryLower.includes('calendrier') || queryLower.includes('rendez-vous') || queryLower.includes('agenda')) {
    return "Le calendrier Noovimo vous permet de planifier et gérer vos rendez-vous. Il peut être synchronisé avec Google Calendar pour une gestion optimale de votre emploi du temps. Consultez les documents suggérés pour un guide détaillé sur cette fonctionnalité.";
  }
  
  if (queryLower.includes('statistique') || queryLower.includes('performance') || queryLower.includes('tableau de bord')) {
    return "Le tableau de bord Noovimo vous offre une vue d'ensemble de vos performances avec des graphiques et indicateurs clés. Vous pouvez suivre vos ventes, commissions et activités sur différentes périodes. Les rapports mensuels vous donnent une analyse plus détaillée de votre activité.";
  }
  
  // Real estate transaction responses
  if (queryLower.includes('mandat') || queryLower.includes('exclusif') || queryLower.includes('simple')) {
    return "En France, il existe principalement deux types de mandats : le mandat simple et le mandat exclusif. Le mandat simple vous permet de confier la vente à plusieurs agences, tandis que le mandat exclusif donne l'exclusivité à une seule agence. Le mandat exclusif offre généralement un meilleur engagement et suivi, mais le choix dépend du bien et de la stratégie de vente. J'ai sélectionné quelques documents juridiques dans les suggestions qui détaillent les implications légales de chaque type.";
  }
  
  if (queryLower.includes('compromis') || queryLower.includes('promesse') || queryLower.includes('vente')) {
    return "Le compromis de vente (ou promesse synallagmatique) est un engagement ferme entre vendeur et acheteur. Une fois signé, l'acheteur dispose généralement d'un délai de rétractation de 10 jours. Le document comprend des conditions suspensives (comme l'obtention d'un prêt) et fixe la date de signature de l'acte authentique. Référez-vous aux documents suggérés pour les modèles et précautions juridiques à prendre.";
  }
  
  if (queryLower.includes('diagnostic') || queryLower.includes('dpe') || queryLower.includes('amiante')) {
    return "En France, plusieurs diagnostics sont obligatoires pour la vente d'un bien immobilier : DPE (énergie), amiante, plomb, électricité, gaz, risques naturels (ERNMT), assainissement et termites dans certaines zones. Ces documents doivent être fournis dès la mise en vente et annexés au compromis. Leur durée de validité varie selon le diagnostic. Consultez les documents suggérés pour plus de détails.";
  }
  
  if (queryLower.includes('fiscalité') || queryLower.includes('impôt') || queryLower.includes('taxe') || queryLower.includes('plus-value')) {
    return "La fiscalité immobilière en France comprend notamment les taxes foncières, la taxe d'habitation (en cours de suppression pour les résidences principales), et l'imposition des plus-values immobilières. Des exonérations existent pour la résidence principale et selon la durée de détention. Pour une analyse complète adaptée à la situation de votre client, je vous recommande de consulter les documents fiscaux dans les suggestions ou de le diriger vers un expert-comptable.";
  }
  
  if (queryLower.includes('formation') || queryLower.includes('apprendre')) {
    return "Voici quelques documents de formation pertinents pour votre demande. Vous pouvez y accéder directement depuis les suggestions ci-dessous. Le programme de formation continue Noovimo couvre tous les aspects de la transaction immobilière et de l'utilisation optimale de la plateforme.";
  }
  
  if (queryLower.includes('vefa') || queryLower.includes('futur achèvement')) {
    return "La Vente en l'État Futur d'Achèvement (VEFA) permet d'acheter un bien immobilier avant sa construction. L'acquéreur paie par tranches selon l'avancement des travaux. La VEFA offre des garanties spécifiques comme la garantie d'achèvement, la garantie décennale et la garantie de parfait achèvement. Les documents spécifiques incluent le contrat de réservation, l'acte de vente VEFA et le procès-verbal de livraison. Consultez les documents suggérés pour plus de détails.";
  }
  
  if (documentSuggestions.length > 0) {
    return `J'ai trouvé ${documentSuggestions.length} document(s) qui pourraient répondre à votre question. Cliquez sur un document dans les suggestions ci-dessous pour l'ouvrir directement.`;
  }
  
  // Default response
  return "Je suis Arthur, votre assistant expert en immobilier et sur l'utilisation de l'intranet Noovimo. Je peux vous aider sur les questions concernant la plateforme ou les transactions immobilières en France. N'hésitez pas à me poser une question plus précise ou à reformuler votre demande pour que je puisse mieux vous assister.";
};
