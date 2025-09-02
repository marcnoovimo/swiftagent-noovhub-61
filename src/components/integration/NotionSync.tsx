import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, RefreshCw, TestTube, ExternalLink, CheckCircle } from 'lucide-react';
import { useNotion } from '@/hooks/useNotion';

const NotionSync: React.FC = () => {
  const {
    databases,
    selectedDatabaseId,
    isDatabasesLoading,
    isTestingConnection,
    isSyncing,
    databasesError,
    setSelectedDatabaseId,
    testConnection,
    syncToNotion,
    hubData
  } = useNotion();

  const handleDatabaseSelect = (databaseId: string) => {
    setSelectedDatabaseId(databaseId);
  };

  const selectedDatabase = databases.find(db => db.id === selectedDatabaseId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <CardTitle>Synchronisation Notion</CardTitle>
          </div>
          <CardDescription>
            Synchronisez automatiquement les données de votre hub Noovimo avec Notion
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Test de connexion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test de connexion
          </CardTitle>
          <CardDescription>
            Vérifiez que votre clé API Notion est correctement configurée
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={() => testConnection()}
            disabled={isTestingConnection}
            variant="outline"
          >
            {isTestingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tester la connexion
          </Button>
        </CardFooter>
      </Card>

      {/* Sélection de la base de données */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Base de données Notion</CardTitle>
          <CardDescription>
            Sélectionnez la base de données où synchroniser vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDatabasesLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Chargement des bases de données...</span>
            </div>
          ) : databasesError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Erreur lors du chargement des bases de données: {databasesError.message}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Select value={selectedDatabaseId} onValueChange={handleDatabaseSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une base de données Notion" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {db.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedDatabase && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Base de données sélectionnée:</h4>
                  <p className="text-sm text-muted-foreground mb-2">{selectedDatabase.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(selectedDatabase.properties).slice(0, 5).map((prop) => (
                      <Badge key={prop} variant="secondary" className="text-xs">
                        {prop}
                      </Badge>
                    ))}
                    {Object.keys(selectedDatabase.properties).length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{Object.keys(selectedDatabase.properties).length - 5} autres
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Données à synchroniser */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Données du hub</CardTitle>
          <CardDescription>
            Aperçu des données qui seront synchronisées avec Notion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium">{hubData.contacts.length}</p>
                <p className="text-sm text-muted-foreground">Contacts</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium">{hubData.events.length}</p>
                <p className="text-sm text-muted-foreground">Événements</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium">{hubData.performance.length}</p>
                <p className="text-sm text-muted-foreground">Données performances</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synchronisation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Synchronisation
          </CardTitle>
          <CardDescription>
            Lancez la synchronisation des données vers Notion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              La synchronisation créera de nouvelles entrées dans votre base de données Notion. 
              Assurez-vous que la base de données sélectionnée dispose des propriétés appropriées.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            onClick={() => syncToNotion()}
            disabled={!selectedDatabaseId || isSyncing}
          >
            {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Synchroniser avec Notion
          </Button>
          <Button variant="outline" asChild>
            <a 
              href="https://www.notion.so" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir Notion
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotionSync;