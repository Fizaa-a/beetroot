import { create } from 'zustand';
import { PantryStore, PantryItem, GroceryItem, CarpoolEvent } from '../types';

export const usePantryStore = create<PantryStore>((set) => ({
  items: [],
  groceryList: [],
  carpoolEvents: [],
  
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: crypto.randomUUID(),
          addedAt: new Date(),
        },
      ],
    })),
    
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
    
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  addToGroceryList: (item) =>
    set((state) => ({
      groceryList: [
        ...state.groceryList,
        {
          ...item,
          id: crypto.randomUUID(),
          addedAt: new Date(),
        },
      ],
    })),

  removeFromGroceryList: (id) =>
    set((state) => ({
      groceryList: state.groceryList.filter((item) => item.id !== id),
    })),

  createCarpoolEvent: (event) =>
    set((state) => ({
      carpoolEvents: [
        ...state.carpoolEvents,
        {
          ...event,
          id: crypto.randomUUID(),
        },
      ],
    })),

  joinCarpoolEvent: (eventId, participant) =>
    set((state) => ({
      carpoolEvents: state.carpoolEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              participants: [...event.participants, participant],
            }
          : event
      ),
    })),
}));