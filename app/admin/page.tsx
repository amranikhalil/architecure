"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, FileText, Folder, Plus, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground mt-2">Gérez les projets, les utilisateurs et les ressources</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-4">
          <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-auto pb-2 md:pb-0">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("projects")}
            >
              <Folder className="mr-2 h-4 w-4" />
              Projets
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </Button>
            <Button
              variant={activeTab === "materials" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("materials")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Matériaux
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Projets totaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">248</div>
                    <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,024</div>
                    <p className="text-xs text-muted-foreground">+18% par rapport au mois dernier</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recommandations générées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,157</div>
                    <p className="text-xs text-muted-foreground">+24% par rapport au mois dernier</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Les derniers projets et recommandations générés</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projet</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Rénovation salle 101</TableCell>
                        <TableCell>Étudiant</TableCell>
                        <TableCell>jean.dupont@email.com</TableCell>
                        <TableCell>Il y a 2 heures</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Optimisation salon</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>marie.martin@email.com</TableCell>
                        <TableCell>Il y a 5 heures</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Laboratoire chimie</TableCell>
                        <TableCell>Étudiant</TableCell>
                        <TableCell>pierre.durand@email.com</TableCell>
                        <TableCell>Il y a 1 jour</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Réaménagement bureau</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>sophie.petit@email.com</TableCell>
                        <TableCell>Il y a 2 jours</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "materials" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestion des matériaux</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un matériau
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des matériaux</CardTitle>
                  <CardDescription>Gérez les matériaux disponibles pour les recommandations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Rechercher un matériau..." className="max-w-sm" />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="isolation">Isolation</SelectItem>
                        <SelectItem value="acoustique">Acoustique</SelectItem>
                        <SelectItem value="eclairage">Éclairage</SelectItem>
                        <SelectItem value="finition">Finition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Impact environnemental</TableHead>
                        <TableHead>Coût</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Laine de chanvre</TableCell>
                        <TableCell>Isolation</TableCell>
                        <TableCell>Élevée</TableCell>
                        <TableCell>Très faible</TableCell>
                        <TableCell>€€</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Fibre de bois</TableCell>
                        <TableCell>Isolation</TableCell>
                        <TableCell>Élevée</TableCell>
                        <TableCell>Faible</TableCell>
                        <TableCell>€€</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Panneaux acoustiques</TableCell>
                        <TableCell>Acoustique</TableCell>
                        <TableCell>Très élevée</TableCell>
                        <TableCell>Moyen</TableCell>
                        <TableCell>€€€</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Verre à contrôle solaire</TableCell>
                        <TableCell>Éclairage</TableCell>
                        <TableCell>Élevée</TableCell>
                        <TableCell>Moyen</TableCell>
                        <TableCell>€€€</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Affichage de 4 sur 24 matériaux</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      Suivant
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestion des projets</h2>
                <div className="flex space-x-2">
                  <Input placeholder="Rechercher un projet..." className="max-w-sm" />
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Projets récents</CardTitle>
                  <CardDescription>Liste des projets soumis par les utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom du projet</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Date de soumission</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Rénovation salle 101</TableCell>
                        <TableCell>Étudiant</TableCell>
                        <TableCell>jean.dupont@email.com</TableCell>
                        <TableCell>05/08/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Optimisation salon</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>marie.martin@email.com</TableCell>
                        <TableCell>05/08/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Laboratoire chimie</TableCell>
                        <TableCell>Étudiant</TableCell>
                        <TableCell>pierre.durand@email.com</TableCell>
                        <TableCell>04/08/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Réaménagement bureau</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>sophie.petit@email.com</TableCell>
                        <TableCell>03/08/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Complété
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Affichage de 4 sur 248 projets</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      Suivant
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>
                <div className="flex space-x-2">
                  <Input placeholder="Rechercher un utilisateur..." className="max-w-sm" />
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs actifs</CardTitle>
                  <CardDescription>Liste des utilisateurs de la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Projets</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Jean Dupont</TableCell>
                        <TableCell>jean.dupont@email.com</TableCell>
                        <TableCell>Étudiant</TableCell>
                        <TableCell>12</TableCell>
                        <TableCell>01/02/2025</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Marie Martin</TableCell>
                        <TableCell>marie.martin@email.com</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>15/03/2025</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pierre Durand</TableCell>
                        <TableCell>pierre.durand@email.com</TableCell>
                        <TableCell>Étudiant</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>10/04/2025</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sophie Petit</TableCell>
                        <TableCell>sophie.petit@email.com</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>22/05/2025</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Affichage de 4 sur 1,024 utilisateurs</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      Suivant
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Paramètres du système</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>Configurez les paramètres généraux de l'application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Nom de l'application</Label>
                    <Input id="app-name" defaultValue="Simulation et Recommandations" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue par défaut</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-file-size">Taille maximale des fichiers (MB)</Label>
                    <Input id="max-file-size" type="number" defaultValue="10" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enregistrer les modifications</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de recommandation</CardTitle>
                  <CardDescription>Configurez les paramètres du moteur de recommandation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rec-count">Nombre de recommandations par analyse</Label>
                    <Input id="rec-count" type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rec-threshold">Seuil de confiance minimal (%)</Label>
                    <Input id="rec-threshold" type="number" defaultValue="75" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rec-model">Modèle d'analyse</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="rec-model">
                        <SelectValue placeholder="Sélectionnez un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enregistrer les modifications</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
