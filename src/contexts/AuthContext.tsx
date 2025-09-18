"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, LoginRequest, WeChatLoginRequest, VerificationCodeRequest } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  loginWithWeChat: (data: WeChatLoginRequest) => Promise<void>;
  logout: () => void;
  sendVerificationCode: (data: VerificationCodeRequest) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储的token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // 验证token有效性（这里应该调用API验证）
          // await verifyToken(token);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 手机号验证码登录
  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      
      // 这里应该调用真实的API
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          phone: data.phone,
          nickname: `用户${data.phone.slice(-4)}`,
          industry: '建筑设计',
          region: '北京市',
          role: 'individual',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active',
          verified: true
        },
        token: 'mock_jwt_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        expires_in: 7200
      };

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(mockResponse.user);
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('refresh_token', mockResponse.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(mockResponse.user));
      localStorage.setItem('token_expires_at', (Date.now() + mockResponse.expires_in * 1000).toString());

    } catch (error) {
      console.error('Login error:', error);
      throw new Error('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 微信登录
  const loginWithWeChat = async (data: WeChatLoginRequest) => {
    try {
      setIsLoading(true);
      
      // 这里应该调用真实的微信登录API
      console.log('WeChat login with code:', data.code);
      
      const mockResponse: AuthResponse = {
        user: {
          id: '2',
          phone: '138****0000',
          wechat_openid: 'mock_openid_' + Date.now(),
          nickname: '微信用户',
          avatar: '/images/default-avatar.png',
          industry: '暖通空调',
          region: '上海市',
          role: 'company',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active',
          verified: true
        },
        token: 'mock_wechat_token_' + Date.now(),
        refresh_token: 'mock_wechat_refresh_' + Date.now(),
        expires_in: 7200
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(mockResponse.user);
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('refresh_token', mockResponse.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(mockResponse.user));
      localStorage.setItem('token_expires_at', (Date.now() + mockResponse.expires_in * 1000).toString());

    } catch (error) {
      console.error('WeChat login error:', error);
      throw new Error('微信登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 发送验证码
  const sendVerificationCode = async (data: VerificationCodeRequest) => {
    try {
      // 这里应该调用真实的发送验证码API
      console.log('Sending verification code to:', data.phone, 'type:', data.type);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 在开发环境下，可以在控制台显示验证码
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - Verification code: 123456');
      }
      
    } catch (error) {
      console.error('Send verification code error:', error);
      throw new Error('发送验证码失败，请重试');
    }
  };

  // 退出登录
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_expires_at');
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('用户未登录');
      
      // 这里应该调用真实的更新用户信息API
      const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() };
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('更新用户信息失败');
    }
  };

  // 刷新token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');

      // 这里应该调用真实的刷新token API
      const mockResponse: AuthResponse = {
        user: user!,
        token: 'new_mock_token_' + Date.now(),
        refresh_token: 'new_mock_refresh_' + Date.now(),
        expires_in: 7200
      };

      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('refresh_token', mockResponse.refresh_token);
      localStorage.setItem('token_expires_at', (Date.now() + mockResponse.expires_in * 1000).toString());

    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      throw new Error('登录已过期，请重新登录');
    }
  };

  // 自动刷新token
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiry = () => {
      const expiresAt = localStorage.getItem('token_expires_at');
      if (expiresAt) {
        const expiryTime = parseInt(expiresAt);
        const currentTime = Date.now();
        
        // 如果token在30分钟内过期，则刷新token
        if (expiryTime - currentTime < 30 * 60 * 1000) {
          refreshToken().catch(() => {
            // 刷新失败则退出登录
            logout();
          });
        }
      }
    };

    // 每5分钟检查一次token状态
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithWeChat,
    logout,
    sendVerificationCode,
    updateUser,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


