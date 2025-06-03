"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Scan, AlertCircle, Check, Loader2, Sun, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/authContext"

export default function ClientPreview() {
  const { user } = useAuth()
  const router = useRouter()
  
  const handleRedirect = () => {
    if (user) {
      router.push('/espace-client')
    } else {
      // If we had a global state for the auth modal, we could open it here
      // For now, we'll just scroll to the login button in the header
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Espace Client</h1>
      
      <div className="max-w-4xl mx-auto">
        <Alert className="mb-8 bg-copper/10 border-copper">
          <AlertCircle className="h-4 w-4 text-copper" />
          <AlertTitle>Accès Restreint</AlertTitle>
          <AlertDescription>
            Cette fonctionnalité nécessite une connexion. Veuillez vous connecter pour accéder à toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="relative">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg z-10">
              <div className="text-center p-6">
                <Lock className="h-12 w-12 text-copper mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Fonctionnalité Verrouillée</h3>
                <p className="text-white/80 mb-4">Connectez-vous pour analyser vos images d'architecture</p>
                <Button onClick={handleRedirect} className="bg-copper hover:bg-copper-dark">
                  {user ? "Accéder" : "Se connecter"}
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Analyse d'Architecture</CardTitle>
              <CardDescription>Téléchargez et analysez vos images d'architecture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center opacity-50">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Glissez-déposez une image ou cliquez pour parcourir</p>
              </div>
              <Button disabled className="w-full">Analyser l'image</Button>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg z-10">
              <div className="text-center p-6">
                <Lock className="h-12 w-12 text-copper mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Fonctionnalité Verrouillée</h3>
                <p className="text-white/80 mb-4">Connectez-vous pour voir les résultats d'analyse</p>
                <Button onClick={handleRedirect} className="bg-copper hover:bg-copper-dark">
                  {user ? "Accéder" : "Se connecter"}
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Résultats d'Analyse</CardTitle>
              <CardDescription>Visualisez les problèmes et solutions identifiés</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="problems" className="opacity-50">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="problems">Problèmes</TabsTrigger>
                  <TabsTrigger value="solutions">Solutions</TabsTrigger>
                </TabsList>
                <TabsContent value="problems" className="space-y-4 mt-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Problème d'éclairage</h3>
                    <p className="text-sm text-gray-500">Éclairage insuffisant dans l'espace principal</p>
                  </div>
                </TabsContent>
                <TabsContent value="solutions" className="space-y-4 mt-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Ajout de sources lumineuses</h3>
                    <p className="text-sm text-gray-500">Installation de luminaires supplémentaires</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pourquoi utiliser notre outil d'analyse d'architecture ?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre outil d'intelligence artificielle analyse vos espaces architecturaux pour identifier les problèmes et proposer des solutions adaptées. Améliorez vos conceptions grâce à une analyse détaillée et des recommandations personnalisées.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-copper" />
                  Analyse Précise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Notre IA identifie les problèmes architecturaux avec une grande précision.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-copper" />
                  Solutions Pratiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Recevez des recommandations concrètes pour améliorer vos espaces.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-copper" />
                  Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Optimisez l'éclairage, l'espace et l'ergonomie de vos conceptions.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button onClick={handleRedirect} className="bg-copper hover:bg-copper-dark">
            {user ? "Accéder à l'Espace Client" : "Se connecter pour commencer"}
          </Button>
        </div>
      </div>
    </div>
  )
}
