"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, LoginRequest, WeChatLoginRequest, VerificationCodeRequest } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
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
          email: data.email || '', // 使用注册时提供的邮箱
          nickname: data.nickname || `用户${data.phone.slice(-4)}`,
          company: data.company || '',
          industry: data.industry || '建筑设计',
          region: data.region || '北京市',
          role: data.role || 'individual',
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

  // 邮箱登录
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // 检查是否是管理员邮箱
      if (email === 'admin@danfoss.com.cn' && password === 'admin12345') {
        // 创建管理员用户
        const adminUser: User = {
          id: 'admin_001',
          phone: '',
          email: email,
          nickname: '系统管理员',
          avatar: '',
          company: '丹佛斯（中国）有限公司',
          industry: '暖通空调',
          region: '全国',
          role: 'system_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active',
          verified: true
        };
        
        const adminResponse = {
          user: adminUser,
          token: 'admin_jwt_token_' + Date.now(),
          refresh_token: 'admin_refresh_token_' + Date.now(),
          expires_in: 7200
        };
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(adminResponse.user);
        localStorage.setItem('auth_token', adminResponse.token);
        localStorage.setItem('refresh_token', adminResponse.refresh_token);
        localStorage.setItem('user_data', JSON.stringify(adminResponse.user));
        localStorage.setItem('token_expires_at', (Date.now() + adminResponse.expires_in * 1000).toString());
        
        return;
      }
      
      // 其他邮箱登录逻辑（可以扩展）
      throw new Error('邮箱或密码错误');
      
    } catch (error) {
      console.error('Email login error:', error);
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
    loginWithEmail,
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


