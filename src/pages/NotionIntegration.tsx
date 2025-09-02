import React from 'react';
import { Helmet } from 'react-helmet';
import NotionSync from '@/components/integration/NotionSync';

const NotionIntegration: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Intégration Notion - Noovimo</title>
        <meta 
          name="description" 
          content="Synchronisez automatiquement vos données Noovimo avec Notion pour une gestion centralisée de votre activité immobilière." 
        />
        <meta name="keywords" content="notion, synchronisation, intégration, données, noovimo, immobilier" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Intégration Notion
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Synchronisez automatiquement vos données Noovimo (contacts, événements, statistiques) 
              avec Notion pour centraliser la gestion de votre activité immobilière.
            </p>
          </div>
          
          <NotionSync />
        </main>
      </div>
    </>
  );
};

export default NotionIntegration;