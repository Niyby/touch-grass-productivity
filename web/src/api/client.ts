/**
 * API Client for Touchgrass App
 * Connects React frontend to Flask backend
 */

const API_BASE = 'http://localhost:5000/api';

// ============= TYPES =============

export interface AppData {
  user: any;
  current_mode: string;
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
  daily_goal: string;
  daily_goal_completed: boolean;
  sentiment_entries: SentimentEntry[];
  food_entries: FoodEntry[];
  focus_points: number;
  comfort_vault: ComfortItem[];
  focus_history: any[];
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  created_at?: string;
}

export interface Note {
  title: string;
  content: string;
  date: string;
}

export interface Reminder {
  text: string;
  time?: string;
}

export interface SentimentEntry {
  id: string;
  date: string;
  mood?: string;
  color?: string;
  answers?: string[];
}

export interface FoodEntry {
  id: string;
  date: string;
  time: string;
  meal: string;
  ate: boolean;
}

export interface ComfortItem {
  id: string;
  type: 'image' | 'text' | 'quote';
  content: string;
  title?: string;
  createdAt: string;
}

export interface StatusResponse {
  character_state: string;
  focus_points: number;
  current_mode: string;
}

// ============= API CLIENT CLASS =============

class ApiClient {
  /**
   * Get current status (character state, points, mode)
   */
  async getStatus(): Promise<StatusResponse> {
    try {
      const response = await fetch(`${API_BASE}/status`);
      if (!response.ok) throw new Error('Failed to fetch status');
      return response.json();
    } catch (error) {
      console.error('API Error (getStatus):', error);
      throw error;
    }
  }

  /**
   * Get all app data
   */
  async getData(): Promise<AppData> {
    try {
      const response = await fetch(`${API_BASE}/data`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    } catch (error) {
      console.error('API Error (getData):', error);
      throw error;
    }
  }

  /**
   * Save all app data
   */
  async saveData(data: AppData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save data');
    } catch (error) {
      console.error('API Error (saveData):', error);
      throw error;
    }
  }

  /**
   * Set current mode (work/destress/selection)
   */
  async setMode(mode: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (!response.ok) throw new Error('Failed to set mode');
    } catch (error) {
      console.error('API Error (setMode):', error);
      throw error;
    }
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    } catch (error) {
      console.error('API Error (getTasks):', error);
      throw error;
    }
  }

  /**
   * Add a new task
   */
  async addTask(text: string): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      return response.json();
    } catch (error) {
      console.error('API Error (addTask):', error);
      throw error;
    }
  }

  /**
   * Toggle task completion (awards/deducts 10 points)
   */
  async toggleTask(taskId: number): Promise<{ focus_points: number }> {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle task');
      return response.json();
    } catch (error) {
      console.error('API Error (toggleTask):', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
    } catch (error) {
      console.error('API Error (deleteTask):', error);
      throw error;
    }
  }

  /**
   * Add sentiment entry (awards 15 points)
   */
  async addSentiment(entry: Partial<SentimentEntry>): Promise<{ points_earned: number }> {
    try {
      const response = await fetch(`${API_BASE}/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error('Failed to add sentiment');
      return response.json();
    } catch (error) {
      console.error('API Error (addSentiment):', error);
      throw error;
    }
  }

  /**
   * Add food entry (awards 5 points)
   */
  async addFood(entry: Partial<FoodEntry>): Promise<{ points_earned: number }> {
    try {
      const response = await fetch(`${API_BASE}/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error('Failed to add food');
      return response.json();
    } catch (error) {
      console.error('API Error (addFood):', error);
      throw error;
    }
  }

  /**
   * Add comfort vault item (awards 5 points)
   */
  async addComfort(entry: Partial<ComfortItem>): Promise<{ points_earned: number }> {
    try {
      const response = await fetch(`${API_BASE}/comfort`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error('Failed to add comfort item');
      return response.json();
    } catch (error) {
      console.error('API Error (addComfort):', error);
      throw error;
    }
  }

  /**
   * Update focus points manually
   */
  async updatePoints(change: number): Promise<{ focus_points: number }> {
    try {
      const response = await fetch(`${API_BASE}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change }),
      });
      if (!response.ok) throw new Error('Failed to update points');
      return response.json();
    } catch (error) {
      console.error('API Error (updatePoints):', error);
      throw error;
    }
  }

  /**
   * Set daily goal
   */
  async setGoal(goal: string, completed: boolean = false): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, completed }),
      });
      if (!response.ok) throw new Error('Failed to set goal');
    } catch (error) {
      console.error('API Error (setGoal):', error);
      throw error;
    }
  }
}

// Export singleton instance
export const api = new ApiClient();

// ============= REACT HOOKS =============

import { useState, useEffect } from 'react';

/**
 * Hook to get and auto-refresh status
 * @param intervalMs - Polling interval in milliseconds (default: 2000)
 */
export function useStatus(intervalMs: number = 2000) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getStatus();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { status, loading, error };
}

/**
 * Hook to get app data
 */
export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      const appData = await api.getData();
      setData(appData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, error, refresh };
}

/**
 * Hook to get tasks
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (text: string) => {
    try {
      await api.addTask(text);
      await refresh();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTask = async (taskId: number) => {
    try {
      await api.toggleTask(taskId);
      await refresh();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);
      await refresh();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { tasks, loading, addTask, toggleTask, deleteTask, refresh };
}
