// import React, { useState, useEffect } from 'react';
// import { electronAPI } from '../preload';

// const App: React.FC = () => {
//   const [items, setItems] = useState<any[]>([]);

//   useEffect(() => {
//     fetchAllItems();
//   }, []);

//   async function fetchAllItems() {
//     try {
//       const items = await window.electronAPI.fetchAll();
//       setItems(items);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//     }
//   }

//   return (
//     <div>
//       <h1>My Items</h1>
//       <ul>
//         {items.map((item) => (
//           <li key={item.id}>{item.title}</li>
//         ))}
//       </ul>
//       <button onClick={fetchAllItems}>Fetch All</button>
//     </div>
//   );
// };

// export default App;
