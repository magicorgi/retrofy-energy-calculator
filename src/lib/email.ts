// 邮件发送服务
// 注意：这是一个模拟实现，实际项目中需要使用真实的邮件服务

interface EmailInvitation {
  email: string;
  name: string;
  tempPassword: string;
  permissions: string[];
  message?: string;
}

interface EmailResult {
  success: boolean;
  message: string;
}

// 模拟邮件发送函数
export async function sendInvitationEmail(invitation: EmailInvitation): Promise<EmailResult> {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 在实际项目中，这里应该调用真实的邮件服务，如：
    // - SendGrid
    // - Nodemailer + SMTP
    // - AWS SES
    // - 腾讯云邮件推送
    
    console.log('📧 发送邀请邮件:', {
      to: invitation.email,
      subject: 'RetroPro 节改专家 - 账号邀请',
      content: generateEmailContent(invitation)
    });
    
    // 模拟邮件发送成功
    // 在实际环境中，这里应该处理真实的邮件发送结果
    const success = Math.random() > 0.1; // 90% 成功率
    
    if (success) {
      return {
        success: true,
        message: `邀请邮件已成功发送至 ${invitation.email}`
      };
    } else {
      return {
        success: false,
        message: '邮件发送失败，请稍后重试'
      };
    }
  } catch (error) {
    console.error('邮件发送错误:', error);
    return {
      success: false,
      message: '邮件发送过程中出现错误'
    };
  }
}

// 生成邮件内容
function generateEmailContent(invitation: EmailInvitation): string {
  const permissionNames = invitation.permissions.map(perm => {
    const permissionMap: Record<string, string> = {
      'demand-collection': '需求收集工具',
      'customer-visit': '客户拜访工具',
      'user-management': '用户管理'
    };
    return permissionMap[perm] || perm;
  }).join('、');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RetroPro 节改专家 - 账号邀请</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: #e0f2fe; border-left: 4px solid #0891b2; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 欢迎加入 RetroPro 节改专家</h1>
      <p>您已被邀请使用我们的节能改造专业工具</p>
    </div>
    
    <div class="content">
      <h2>亲爱的 ${invitation.name}，</h2>
      
      <p>您好！我们很高兴地通知您，您已被邀请加入 RetroPro 节改专家平台。</p>
      
      <div class="info-box">
        <h3>📋 您的账号信息</h3>
        <p><strong>登录邮箱：</strong>${invitation.email}</p>
        <p><strong>临时密码：</strong><code>${invitation.tempPassword}</code></p>
        <p><strong>访问权限：</strong>${permissionNames}</p>
      </div>
      
      <h3>🚀 开始使用</h3>
      <p>请点击下方按钮激活您的账号并设置新密码：</p>
      
      <a href="${window.location.origin}/auth/confirm?email=${encodeURIComponent(invitation.email)}&token=${btoa(invitation.tempPassword)}" class="button">
        激活账号
      </a>
      
      <h3>🛠️ 功能介绍</h3>
      <ul>
        ${invitation.permissions.includes('demand-collection') ? '<li><strong>需求收集工具：</strong>收集工厂和建筑节能改造需求</li>' : ''}
        ${invitation.permissions.includes('customer-visit') ? '<li><strong>客户拜访工具：</strong>记录客户拜访关键信息</li>' : ''}
        ${invitation.permissions.includes('user-management') ? '<li><strong>用户管理：</strong>管理用户账号和权限</li>' : ''}
      </ul>
      
      ${invitation.message ? `<p><strong>管理员留言：</strong>${invitation.message}</p>` : ''}
      
      <p>如果您有任何问题，请联系我们的技术支持团队。</p>
      
      <p>祝您使用愉快！</p>
      
      <p><strong>RetroPro 节改专家团队</strong></p>
    </div>
    
    <div class="footer">
      <p>此邮件由系统自动发送，请勿回复。</p>
      <p>© 2024 RetroPro 节改专家. 保留所有权利。</p>
    </div>
  </div>
</body>
</html>
  `;
}

// 发送测试邮件（用于开发调试）
export async function sendTestEmail(): Promise<EmailResult> {
  return sendInvitationEmail({
    email: 'test@example.com',
    name: '测试用户',
    tempPassword: 'test123',
    permissions: ['demand-collection', 'customer-visit'],
    message: '这是一个测试邮件'
  });
}
