interface IPatient {
    title: string;
  }
  
  declare global {
    interface Window {
      electronAPI: {
        insertPatient: (patient: IPatient) => Promise<void>;
        search: (keyword: string) => Promise<any[]>;
        fetchAll: () => Promise<any[]>;
      };
    }
  }
  
  export {};
  