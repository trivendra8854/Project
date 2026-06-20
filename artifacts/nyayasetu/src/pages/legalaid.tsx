import { useState } from "react";
import { Users, MapPin, Phone, Mail, Globe, Star } from "lucide-react";
import { useListLegalAid } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "lawyer", label: "Lawyer" },
  { value: "ngo", label: "NGO" },
  { value: "dlsa", label: "DLSA" },
];

export default function LegalAid() {
  const [filters, setFilters] = useState({ city: "", state: "", type: "", q: "" });
  const params: any = {};
  if (filters.city) params.city = filters.city;
  if (filters.state) params.state = filters.state;
  if (filters.type) params.type = filters.type;
  if (filters.q) params.q = filters.q;

  const { data: providers, isLoading } = useListLegalAid(Object.keys(params).length ? params : undefined);
  const list = (providers as any[]) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find Legal Aid</h1>
          <p className="text-muted-foreground mt-1">Connect with lawyers, NGOs, and legal services near you</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Search</Label>
                <Input placeholder="Name or keyword" value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">City</Label>
                <Input placeholder="e.g. Mumbai" value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">State</Label>
                <Input placeholder="e.g. Maharashtra" value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Type</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={filters.type}
                  onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                >
                  {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No providers found for your search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((provider: any) => (
              <Card key={provider.id} className="border-border hover:border-primary/30 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-foreground">{provider.name}</h3>
                        <Badge variant="secondary" className="text-xs capitalize">{provider.type}</Badge>
                        {provider.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-current" />
                            <span className="text-xs text-muted-foreground">{provider.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{provider.address}, {provider.city}, {provider.state}</span>
                      </div>
                      {provider.practiceAreas?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.practiceAreas.slice(0, 4).map((area: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{area}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm shrink-0">
                      {provider.phone && (
                        <a href={`tel:${provider.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Phone className="h-3.5 w-3.5" />{provider.phone}
                        </a>
                      )}
                      {provider.email && (
                        <a href={`mailto:${provider.email}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Mail className="h-3.5 w-3.5" />{provider.email}
                        </a>
                      )}
                      {provider.website && (
                        <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <Globe className="h-3.5 w-3.5" />Website
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
