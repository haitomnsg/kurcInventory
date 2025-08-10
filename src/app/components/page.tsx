
"use client";

import * as React from "react";
import useSWR, { mutate } from 'swr';
import type { Component, Log, User, Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchComponents, fetchCategories, addComponent, updateComponent, deleteComponent, addCategory, updateCategory, deleteCategory } from "@/lib/data-service";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";


import Header from "@/components/dashboard/header";
import ComponentTable from "@/components/dashboard/component-table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { AddComponentDialog } from "@/components/add-component-dialog";
import { EditComponentDialog } from "@/components/edit-component-dialog";
import { DeleteComponentDialog } from "@/components/delete-component-dialog";
import CategoryManager from "@/components/dashboard/category-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import AuthGuard from "@/components/auth-guard";

export default function ComponentsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [user, setUser] = React.useState<any>(null);

  const { data: componentsData, error: componentsError } = useSWR<Component[]>('components', fetchComponents);
  const { data: categoriesData, error: categoriesError } = useSWR<Category[]>('categories', fetchCategories);

  const [componentSearchTerm, setComponentSearchTerm] = React.useState("");
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState<Component | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleOpenEditDialog = (component: Component) => {
    setSelectedComponent(component);
    setIsEditDialogOpen(true);
  }

  const handleOpenDeleteDialog = (component: Component) => {
    setSelectedComponent(component);
    setIsDeleteDialogOpen(true);
  }

  const handleAddComponent = async (newComponent: Omit<Component, 'id' | 'aiHint' | 'availableQuantity'>) => {
    try {
        const componentToAdd: Omit<Component, 'id'> = {
            ...newComponent,
            availableQuantity: newComponent.totalQuantity,
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

  const handleUpdateComponent = async (componentToUpdate: Omit<Component, 'id' | 'aiHint' | 'availableQuantity'>) => {
    if (!selectedComponent?.id) return;
    try {
        const availableQuantity = componentToUpdate.totalQuantity - (selectedComponent.totalQuantity - selectedComponent.availableQuantity)
        await updateComponent(selectedComponent.id, {
          ...componentToUpdate,
          availableQuantity: Math.max(0, availableQuantity) // Ensure it doesn't go below zero
        });
        mutate('components');
        toast({
            title: "Component Updated",
            description: `${componentToUpdate.name} has been successfully updated.`
        });
        setIsEditDialogOpen(false);
        setSelectedComponent(null);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to update component.",
            variant: "destructive"
        });
    }
  }

  const handleDeleteComponent = async () => {
      if (!selectedComponent?.id) return;
      try {
          await deleteComponent(selectedComponent.id);
          mutate('components');
          toast({
              title: "Component Deleted",
              description: `${selectedComponent.name} has been successfully deleted.`
          });
          setIsDeleteDialogOpen(false);
          setSelectedComponent(null);
      } catch (error) {
          toast({
              title: "Error",
              description: "Failed to delete component.",
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
              user={user}
            />
            <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-8">
              <div>
                  {!componentsData ? renderLoadingSkeleton() : (
                      <ComponentTable 
                        components={filteredComponents} 
                        onAddComponent={() => setIsAddDialogOpen(true)}
                        onEditComponent={handleOpenEditDialog}
                        onDeleteComponent={handleOpenDeleteDialog}
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
          {selectedComponent && (
            <>
              <EditComponentDialog
                  open={isEditDialogOpen}
                  onOpenChange={(open) => {
                      if (!open) setSelectedComponent(null);
                      setIsEditDialogOpen(open);
                  }}
                  onEditComponent={handleUpdateComponent}
                  component={selectedComponent}
                  categories={categoriesData || []}
              />
              <DeleteComponentDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={(open) => {
                      if (!open) setSelectedComponent(null);
                      setIsDeleteDialogOpen(open);
                  }}
                  onConfirmDelete={handleDeleteComponent}
                  componentName={selectedComponent.name}
              />
            </>
          )}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
