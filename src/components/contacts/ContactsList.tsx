
import React from 'react';
import { Contact } from '@/types/contact';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, MapPin, Building, Tag, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface ContactsListProps {
  contacts: Contact[];
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts }) => {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-xl font-medium">Aucun contact trouvé</h3>
        <p className="text-muted-foreground mt-2">
          Commencez à ajouter des contacts ou modifiez vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border">
              {contact.photo ? (
                <AvatarImage src={contact.photo} alt={`${contact.firstName} ${contact.lastName}`} />
              ) : (
                <AvatarFallback className="text-lg">
                  {contact.firstName[0]}{contact.lastName[0]}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg truncate">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.position && (
                    <p className="text-sm text-muted-foreground">{contact.position}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
              
              {contact.company && (
                <div className="flex items-center gap-1 text-sm mt-1">
                  <Building size={14} className="text-muted-foreground" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
              
              {contact.city && (
                <div className="flex items-center gap-1 text-sm mt-1">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="truncate">{contact.city}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="text-sm hover:underline truncate">
                  {contact.phone}
                </a>
              </div>
            )}
            
            {contact.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-sm hover:underline truncate">
                  {contact.email}
                </a>
              </div>
            )}
          </div>
          
          {contact.tags && contact.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
            {contact.lastContact ? (
              <div>Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}</div>
            ) : (
              <div>Créé le: {new Date(contact.createdAt).toLocaleDateString('fr-FR')}</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContactsList;
