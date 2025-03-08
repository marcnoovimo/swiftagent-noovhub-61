import React, { useState } from 'react';
import { Upload, Plus, FileText, FileUp, BookOpen, FileScan } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DocumentSearch from '@/components/documents/DocumentSearch';
import DocumentSidebar from '@/components/documents/DocumentSidebar';
import DocumentList from '@/components/documents/DocumentList';
import DocumentBreadcrumbs from '@/components/documents/DocumentBreadcrumbs';
import DocumentPreview from '@/components/documents/DocumentPreview';
import { Document, Folder, BreadcrumbItem } from '@/components/documents/types';
import DocumentScanDialog from '@/components/documents/DocumentScanDialog';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocType, setActiveDocType] = useState<'agent' | 'noovimo'>('agent');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'Base Documentaire' }
  ]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  
  // Agent documents structure
  const [agentDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Compromis - 23 Rue des Lilas',
      type: 'pdf',
      category: 'Compromis',
      starred: true,
      documentType: 'agent'
    },
    {
      id: '2',
      name: 'Mandat exclusif - 8 Avenue des Roses',
      type: 'docx',
      category: 'Mandats',
      starred: false,
      documentType: 'agent'
    },
    {
      id: '3',
      name: 'Facture commission - Sept 2023',
      type: 'pdf',
      category: 'Factures',
      starred: true,
      documentType: 'agent'
    },
    {
      id: '4',
      name: 'Photos - Appartement Centre-ville',
      type: 'zip',
      category: 'Photos',
      starred: false,
      documentType: 'agent'
    },
    {
      id: '5',
      name: 'Diagnostic DPE - Maison Nantes Sud',
      type: 'pdf',
      category: 'Diagnostics',
      starred: false,
      documentType: 'agent'
    },
  ]);
  
  // Hierarchical Noovimo documents structure
  const [noovimoFolders] = useState<Folder[]>([
    {
      id: 'folder-1',
      name: 'Formations',
      type: 'folder',
      documents: [
        {
          id: 'folder-1-1',
          name: 'Techniques de vente',
          type: 'folder',
          documents: [
            {
              id: '6',
              name: 'Formation - Techniques de négociation',
              type: 'mp4',
              category: 'Formations',
              starred: false,
              documentType: 'noovimo'
            },
            {
              id: '6-1',
              name: 'Support - Techniques de négociation',
              type: 'pdf',
              category: 'Formations',
              starred: false,
              documentType: 'noovimo'
            }
          ]
        },
        {
          id: 'folder-1-2',
          name: 'Outils Noovimo',
          type: 'folder',
          documents: [
            {
              id: '6-2',
              name: 'Formation - Utilisation CRM',
              type: 'mp4',
              category: 'Formations',
              starred: false,
              documentType: 'noovimo'
            }
          ]
        }
      ]
    },
    {
      id: 'folder-2',
      name: 'Documentation Juridique',
      type: 'folder',
      documents: [
        {
          id: '7',
          name: 'Guide juridique - Mandats de vente',
          type: 'pdf',
          category: 'Guides',
          starred: true,
          documentType: 'noovimo'
        },
        {
          id: 'folder-2-1',
          name: 'Contrats',
          type: 'folder',
          documents: [
            {
              id: '7-1',
              name: 'Modèles contrats de vente',
              type: 'pdf',
              category: 'Guides',
              starred: false,
              documentType: 'noovimo'
            }
          ]
        }
      ]
    },
    {
      id: 'folder-3',
      name: 'Webinaires',
      type: 'folder',
      documents: [
        {
          id: '8',
          name: 'Webinaire - Optimisation fiscale',
          type: 'mp4',
          category: 'Webinaires',
          starred: false,
          documentType: 'noovimo'
        }
      ]
    },
    {
      id: 'folder-4',
      name: 'Communication',
      type: 'folder',
      documents: [
        {
          id: '9',
          name: 'Charte graphique Noovimo 2023',
          type: 'pdf',
          category: 'Communication',
          starred: true,
          documentType: 'noovimo'
        }
      ]
    },
    {
      id: 'folder-5',
      name: 'Modèles',
      type: 'folder',
      documents: [
        {
          id: '10',
          name: 'Modèles d\'emails clients',
          type: 'docx',
          category: 'Modèles',
          starred: false,
          documentType: 'noovimo'
        }
      ]
    },
  ]);

  const [agentCategories] = useState([
    { name: 'Compromis', icon: <FileText size={18} className="text-noovimo-500" />, count: 4 },
    { name: 'Mandats', icon: <FileText size={18} className="text-green-500" />, count: 8 },
    { name: 'Factures', icon: <FileText size={18} className="text-yellow-500" />, count: 6 },
    { name: 'Photos', icon: <FileText size={18} className="text-purple-500" />, count: 12 },
    { name: 'Diagnostics', icon: <FileText size={18} className="text-red-500" />, count: 5 },
  ]);

  // Function to find folders and documents recursively
  const findFolderAndContents = (folderId: string, folders: Folder[]): (Document | Folder)[] | null => {
    // If we're at the root, return the top-level folders
    if (folderId === 'root') {
      return folders;
    }
    
    // Search recursively through folders
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder.documents;
      }
      
      // Search in nested folders
      if (folder.type === 'folder') {
        const foundInNested = findFolderAndContents(folderId, folder.documents.filter(d => d.type === 'folder') as Folder[]);
        if (foundInNested) {
          return foundInNested;
        }
      }
    }
    
    return null;
  };

  // Function to navigate to a folder
  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    
    // Update breadcrumbs
    const newBreadcrumbs = [...breadcrumbs];
    const existingIndex = newBreadcrumbs.findIndex(b => b.id === folderId);
    
    if (existingIndex >= 0) {
      // If we're navigating to an existing breadcrumb, trim the array
      setBreadcrumbs(newBreadcrumbs.slice(0, existingIndex + 1));
    } else {
      // Add the new folder to breadcrumbs
      setBreadcrumbs([...newBreadcrumbs, { id: folderId, name: folderName }]);
    }
  };

  // Function to search documents recursively
  const searchDocuments = (query: string): Document[] => {
    if (!query) return [];
    
    const results: Document[] = [];
    
    const searchInFolder = (items: (Document | Folder)[]) => {
      items.forEach(item => {
        if ('documents' in item) {
          // This is a folder
          searchInFolder(item.documents);
        } else if (item.documentType === activeDocType && 
                  (item.name.toLowerCase().includes(query.toLowerCase()) || 
                   item.category.toLowerCase().includes(query.toLowerCase()))) {
          // This is a matching document
          results.push(item);
        }
      });
    };
    
    if (activeDocType === 'agent') {
      return agentDocuments.filter(doc => 
        doc.name.toLowerCase().includes(query.toLowerCase()) || 
        doc.category.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      searchInFolder(noovimoFolders);
      return results;
    }
  };

  // Function to get current folder contents
  const getCurrentFolderContents = (): (Document | Folder)[] => {
    if (activeDocType === 'agent') {
      return agentDocuments;
    } else {
      const contents = findFolderAndContents(currentFolder, noovimoFolders);
      return contents || [];
    }
  };

  // Handle document click for preview
  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
  };

  // Get filtered contents
  const filteredContents = searchQuery ? 
    searchDocuments(searchQuery) : 
    getCurrentFolderContents();

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground mt-1">Gérez et organisez tous vos documents</p>
      </div>
      
      <Tabs defaultValue={activeDocType} onValueChange={(value) => {
        setActiveDocType(value as 'agent' | 'noovimo');
        setCurrentFolder('root');
        setBreadcrumbs([{ id: 'root', name: value === 'agent' ? 'Mes Documents' : 'Base Documentaire' }]);
      }}>
        <TabsList className="mb-6">
          <TabsTrigger value="agent" className="flex items-center gap-2 px-6 py-3 text-sm font-medium">
            <FileUp size={18} />
            <span>Mes Documents</span>
          </TabsTrigger>
          <TabsTrigger value="noovimo" className="flex items-center gap-2 px-6 py-3 text-sm font-medium">
            <BookOpen size={18} />
            <span>Base Documentaire Noovimo</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="agent">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <DocumentSearch 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                showUploadButton={true}
                placeholder="Rechercher un document..."
              />
              
              {/* Document Scanner Button */}
              <Button 
                variant="outline" 
                className="ml-2 flex items-center gap-2"
                onClick={() => setScanDialogOpen(true)}
              >
                <FileScan size={18} />
                <span className="hidden sm:inline">Scanner</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Categories sidebar */}
              <div className="lg:col-span-1">
                <DocumentSidebar 
                  title="Mes Documents"
                  currentFolder={currentFolder}
                  categories={agentCategories}
                  onFolderClick={navigateToFolder}
                  starredCount={agentDocuments.filter(doc => doc.starred).length}
                  totalCount={agentDocuments.length}
                  showAddCategory={true}
                />
              </div>
              
              {/* Document list */}
              <div className="lg:col-span-3">
                <DocumentList 
                  items={filteredContents} 
                  isSearchResult={!!searchQuery}
                  onFileClick={handleDocumentClick}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="noovimo">
          <div className="glass-card rounded-xl p-6">
            <DocumentSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              placeholder="Rechercher dans la base documentaire..."
            />
            
            {/* Breadcrumbs */}
            {!searchQuery && (
              <DocumentBreadcrumbs 
                breadcrumbs={breadcrumbs}
                onNavigate={navigateToFolder}
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Categories sidebar */}
              <div className="lg:col-span-1">
                <DocumentSidebar 
                  title="Base Documentaire"
                  currentFolder={currentFolder}
                  folders={noovimoFolders}
                  onFolderClick={navigateToFolder}
                />
              </div>
              
              {/* Document and folder list */}
              <div className="lg:col-span-3">
                <DocumentList 
                  items={filteredContents}
                  onFolderClick={navigateToFolder}
                  onFileClick={handleDocumentClick}
                  isSearchResult={!!searchQuery}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreview 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
      
      {/* Document Scanner Dialog */}
      <DocumentScanDialog 
        open={scanDialogOpen}
        onOpenChange={setScanDialogOpen}
        onSuccess={() => {
          // Refresh document list if necessary
          // In a real implementation, you would fetch updated document list
        }}
      />
    </div>
  );
};

export default Documents;
