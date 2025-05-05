// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 🔧 нэмэгдсэн
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie.split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      if (token) {
        const verifiedUser = verifyToken(token);
        if (verifiedUser) {
          setUser(verifiedUser);
        } else {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/login');
        }
      }
      setIsLoading(false); // 🔧 шалгалт дууссан үед false болгоно
    };

    checkAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}




// 'use client'

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'

// const LoginPage = () => {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleLogin = async () => {
//     const res = await fetch('/api/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     })

//     const data = await res.json()

//     if (data.success) {
//       // Role шалгаад тохирох page руу redirect хийнэ
//       if (data.user.role === 'doctor') {
//         router.push('/doctor') // Эмчийн dashboard руу чиглүүлж байна
//       } else if (data.user.role === 'nurse') {
//         router.push('/nurse') // Сувилагчийн dashboard руу чиглүүлж байна
//       } else {
//         router.push('/') // Энгийн хэрэглэгчийн хувьд home руу чиглүүлж байна
//       }
//     }
//   }

//   return (
//     <div>
//       <input 
//         type="email" 
//         value={email} 
//         onChange={(e) => setEmail(e.target.value)} 
//         placeholder="Email" 
//       />
//       <input 
//         type="password" 
//         value={password} 
//         onChange={(e) => setPassword(e.target.value)} 
//         placeholder="Password" 
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   )
// }

// export default LoginPage
