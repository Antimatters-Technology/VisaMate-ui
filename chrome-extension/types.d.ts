// Chrome Extension Types Declaration

declare namespace chrome {
  namespace runtime {
    function sendMessage(message: any): Promise<any>;
    function sendMessage(message: any, callback: (response: any) => void): void;
    function getURL(path: string): string;
    
    const onMessage: {
      addListener(callback: (request: any, sender: any, sendResponse: (response: any) => void) => boolean | void): void;
    };
  }
  
  namespace storage {
    namespace sync {
      function get(keys: string[] | string): Promise<any>;
      function set(items: any): Promise<void>;
    }
    
    namespace local {
      function get(keys: string[] | string): Promise<any>;
      function set(items: any): Promise<void>;
    }
  }
  
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
    }
    
    function query(queryInfo: { active?: boolean; currentWindow?: boolean }): Promise<Tab[]>;
    function sendMessage(tabId: number, message: any): Promise<any>;
    function sendMessage(tabId: number, message: any, callback: (response: any) => void): void;
  }
} 