// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function CreateUser() {
//   const router = useRouter();
  
//   // Form data state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     number: ''
//   });
  
//   // Loading & error states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   // Input change handle pannurathu
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError(''); // Error clear pannurathu
//   };

//   // Form submit handle pannurathu
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Page reload prevent pannurathu
//     setLoading(true);
//     setError('');
    
//     try {
//       // API call
//       const response = await fetch('/api/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Something went wrong');
//       }
      
//       // Success!
//       setSuccess(true);
//       console.log('✅ User created:', data);
      
//       // 2 seconds wait panni users page ku redirect pannurathu
//       setTimeout(() => {
//         router.push('/users');
//       }, 2000);
      
//     } catch (err) {
//       console.error('❌ Error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 ">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             New User
//           </h1>
//           <Link 
//             href="/users"
//             className="text-blue-600 hover:text-blue-800"
//           >
//             View All Users →
//           </Link>
//         </div>

//         {/* Success Message */}
//         {success && (
//           <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//             ✅ User created successfully! Redirecting...
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//             ❌ {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
          
//           {/* Name Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter full name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//               disabled={loading}
//             />
//           </div>

//           {/* Email Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="example@email.com"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//               disabled={loading}
//             />
//           </div>

//           {/* Phone Number Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="tel"
//               name="number"
//               value={formData.number}
//               onChange={handleChange}
//               placeholder="9876543210"
//               pattern="[0-9]{10,15}"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//               disabled={loading}
//             />
//             {/* <p className="mt-1 text-sm text-gray-500">
//               Enter 10-15 digit phone number
//             </p> */}
//           </div>

//           {/* Submit Button */}
//           <div className="flex gap-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
//             >
//               {loading ? 'Saving...' : 'Create User'}
//             </button>
            
//             <button
//               type="button"
//               onClick={() => router.push('/users')}
//               disabled={loading}
//               className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }