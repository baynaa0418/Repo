// src/context/AuthContext.js
<<<<<<< HEAD
"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (userData && storedToken) {
          // Token-ийг шалгах
          const response = await fetch('http://localhost:8000/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            setUser(JSON.parse(userData));
            setToken(storedToken);
          } else {
            // Token хүчинтэй биш бол localStorage-оос устгах
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
            router.push('/authentication/login');
          }
        }
      } catch (error) {
        console.error('Нэвтрэлт шалгахад алдаа гарлаа:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        router.push('/authentication/login');
      }
=======
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
>>>>>>> 4fee7c1 ([ADD] add some functions)
    };

    checkAuth();
  }, [router]);

<<<<<<< HEAD
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/authentication/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
=======
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
>>>>>>> 4fee7c1 ([ADD] add some functions)




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
