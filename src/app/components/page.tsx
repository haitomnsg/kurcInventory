
"use client";

import * as React from "react";
import useSWR, { mutate } from 'swr';
import type { Component, Log, User, Category } from "@/lib/types";
import { mockUsers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { fetchComponents, fetchCategories, addComponent, addCategory, updateCategory, deleteCategory } from "@/lib/data-service";


import Header from "@/components/dashboard/header";
import ComponentTable from "@/components/dashboard/component-table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { AddComponentDialog } from "@/components/add-component-dialog";
import CategoryManager from "@/components/dashboard/category-manager";
import { ReturnItemDialog } from "@/components/return-item-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import AuthGuard from "@/components/auth-guard";

export default function ComponentsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");

  const { data: componentsData, error: componentsError } = useSWR<Component[]>('components', fetchComponents);
  const { data: categoriesData, error: categoriesError } = useSWR<Category[]>('categories', fetchCategories);

  const [componentSearchTerm, setComponentSearchTerm] = React.useState("");
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState<Component | null>(null);

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleBorrow = (component: Component, details: { expectedReturnDate: Date; purpose: string }) => {
    // This needs to be implemented with Firestore updates
    console.log("Borrowing component:", component, "with details:", details);
    toast({
      title: "Component Borrowed",
      description: `${component.name} has been successfully borrowed.`,
    });
  };
  
  const handleReturn = (component: Component, remarks: string) => {
    // This needs to be implemented with Firestore updates
     console.log("Returning component:", component, "with remarks:", remarks);
    toast({
      title: "Component Returned",
      description: `${component.name} has been returned.`,
    });
    setIsReturnDialogOpen(false);
    setSelectedComponent(null);
  }

  const handleAddComponent = async (newComponent: Omit<Component, 'id' | 'status' | 'imageUrl' | 'aiHint'>) => {
    try {
        const componentToAdd: Omit<Component, 'id'> = {
            ...newComponent,
            status: "Available",
            imageUrl: "https://placehold.co/100x100.png",
            aiHint: `${newComponent.name.toLowerCase()} ${newComponent.category.toLowerCase()}`.trim(),
        };
        await addComponent(componentToAdd);
        mutate('components');
        toast({
            title: "Component Added",
            description: `${newComponent.name} has been successfully added to the inventory.`
        });
        setIsAddDialogOpen(false);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to add component.",
            variant: "destructive"
        });
    }
  }

  const handleAddCategory = async (name: string) => {
    try {
        await addCategory({ name });
        mutate('categories');
        toast({ title: "Category Added", description: `Category "${name}" has been added.`});
    } catch (error) {
        toast({ title: "Error", description: "Failed to add category.", variant: "destructive" });
    }
  }
  
  const handleUpdateCategory = async (id: string, name: string) => {
    try {
        await updateCategory(id, { name });
        mutate('categories');
        toast({ title: "Category Updated", description: `Category has been updated to "${name}".`});
    } catch (error) {
         toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
        await deleteCategory(id);
        mutate('categories');
        toast({ title: "Category Deleted", description: "The category has been deleted."});
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
  }

  const filteredComponents = React.useMemo(() => {
    if (!componentsData) return [];
    return componentsData.filter(
      (component) =>
        component.name.toLowerCase().includes(componentSearchTerm.toLowerCase()) ||
        component.category.toLowerCase().includes(componentSearchTerm.toLowerCase())
    );
  }, [componentsData, componentSearchTerm]);

  const filteredCategories = React.useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.filter((category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  }, [categoriesData, categorySearchTerm]);
  
  const handleOpenReturnDialog = (component: Component) => {
    setSelectedComponent(component);
    setIsReturnDialogOpen(true);
  }

  const renderLoadingSkeleton = () => (
    <Card>
        <CardContent className="p-6">
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </CardContent>
    </Card>
  )

  if (componentsError || categoriesError) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-destructive">Failed to load data. Please try again later.</p>
        </div>
    )
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <Header
              onThemeChange={handleThemeChange}
              theme={theme}
            />
            <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-8">
              <div>
                  {!componentsData ? renderLoadingSkeleton() : (
                      <ComponentTable 
                        components={filteredComponents.slice(0, 10)} 
                        onAddComponent={() => setIsAddDialogOpen(true)}
                        onSearch={setComponentSearchTerm}
                      />
                  )}
              </div>
              <div>
                  {!categoriesData ? renderLoadingSkeleton() : (
                      <CategoryManager 
                          categories={filteredCategories}
                          onAdd={handleAddCategory}
                          onUpdate={handleUpdateCategory}
                          onDelete={handleDeleteCategory}
                          onSearch={setCategorySearchTerm}
                      />
                  )}
              </div>
            </main>
          </div>
          <AddComponentDialog 
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onAddComponent={handleAddComponent}
              categories={categoriesData || []}
          />
          {selectedComponent && componentsData && (
              <ReturnItemDialog
                  open={isReturnDialogOpen}
                  onOpenChange={(open) => {
                      if (!open) {
                          setSelectedComponent(null);
                      }
                      setIsReturnDialogOpen(open);
                  }}
                  components={componentsData.filter(c => c.status === 'Borrowed')}
                  onReturn={(componentId, remarks) => {
                      const componentToReturn = componentsData.find(c => c.id === componentId);
                      if (componentToReturn) {
                          handleReturn(componentToReturn, remarks);
                      }
                  }}
                  selectedComponentId={selectedComponent.id}
              />
          )}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
