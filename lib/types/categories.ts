export interface ICategory {
  id: string; // UUID for the category
  name: string; // Category name
  description?: string; // Optional description
  active?: boolean; // Indicates if the category is active
  parent?: ICategory | null; // Supports nested categories
  subcategories?: ICategory[]; // List of child categories
  business_count?:number;
}