"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Calculator,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Code,
  Sliders,
  FileText,
  Activity
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { 
  CalculatorConfig, 
  CalculatorParameter, 
  CalculatorFormula, 
  ADMIN_PERMISSIONS 
} from '@/types/admin';

// 模拟计算器配置数据
const mockCalculatorConfigs: CalculatorConfig[] = [
  {
    id: '1',
    calculator_type: 'heat_pump',
    version: '2.1.0',
    name: '热泵计算器',
    description: '用于计算热泵系统的节能效果和投资回报',
    parameters: [
      {
        id: '1',
        name: '建筑面积',
        key: 'building_area',
        type: 'number',
        default_value: 10000,
        min_value: 100,
        max_value: 1000000,
        unit: '平方米',
        description: '建筑的总面积',
        category: 'basic',
        is_required: true,
        display_order: 1
      },
      {
        id: '2',
        name: '热负荷',
        key: 'heat_load',
        type: 'number',
        default_value: 80,
        min_value: 20,
        max_value: 200,
        unit: 'W/m²',
        description: '单位面积热负荷',
        category: 'basic',
        is_required: true,
        display_order: 2
      },
      {
        id: '3',
        name: '地区系数',
        key: 'region_factor',
        type: 'select',
        default_value: 1.0,
        options: [
          { label: '华北地区', value: 1.0 },
          { label: '华东地区', value: 0.9 },
          { label: '华南地区', value: 0.8 },
          { label: '西北地区', value: 1.2 },
          { label: '西南地区', value: 1.1 }
        ],
        description: '不同地区的气候修正系数',
        category: 'regional',
        is_required: true,
        display_order: 3
      }
    ],
    formulas: [
      {
        id: '1',
        name: '设计热负荷',
        expression: 'building_area * heat_load * region_factor',
        description: '计算建筑的设计热负荷',
        variables: ['building_area', 'heat_load', 'region_factor'],
        category: 'load_calculation',
        is_active: true
      },
      {
        id: '2',
        name: 'COP修正',
        expression: 'base_cop * (1 + efficiency_factor * 0.1)',
        description: '根据效率因子修正COP值',
        variables: ['base_cop', 'efficiency_factor'],
        category: 'efficiency',
        is_active: true
      }
    ],
    is_active: true,
    created_by: 'admin',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    calculator_type: 'chiller',
    version: '1.8.0',
    name: '冷水机组计算器',
    description: '用于计算冷水机组的选型和节能分析',
    parameters: [
      {
        id: '4',
        name: '制冷量',
        key: 'cooling_capacity',
        type: 'number',
        default_value: 1000,
        min_value: 100,
        max_value: 10000,
        unit: 'kW',
        description: '所需制冷量',
        category: 'basic',
        is_required: true,
        display_order: 1
      }
    ],
    formulas: [
      {
        id: '3',
        name: 'EER计算',
        expression: 'cooling_capacity / power_consumption',
        description: '计算能效比',
        variables: ['cooling_capacity', 'power_consumption'],
        category: 'efficiency',
        is_active: true
      }
    ],
    is_active: true,
    created_by: 'admin',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  }
];

export default function CalculatorManagementPage() {
  const { hasPermission } = useAdmin();
  const [configs, setConfigs] = useState<CalculatorConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<CalculatorConfig | null>(null);
  const [editingParameter, setEditingParameter] = useState<CalculatorParameter | null>(null);
  const [editingFormula, setEditingFormula] = useState<CalculatorFormula | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载计算器配置
  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfigs(mockCalculatorConfigs);
      if (mockCalculatorConfigs.length > 0) {
        setSelectedConfig(mockCalculatorConfigs[0]);
      }
    } catch (error) {
      console.error('Load calculator configs error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  // 保存参数
  const handleSaveParameter = (parameter: CalculatorParameter) => {
    if (!selectedConfig) return;

    const updatedConfig = {
      ...selectedConfig,
      parameters: editingParameter?.id
        ? selectedConfig.parameters.map(p => p.id === editingParameter.id ? parameter : p)
        : [...selectedConfig.parameters, { ...parameter, id: Date.now().toString() }]
    };

    setSelectedConfig(updatedConfig);
    setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    setEditingParameter(null);
  };

  // 保存公式
  const handleSaveFormula = (formula: CalculatorFormula) => {
    if (!selectedConfig) return;

    const updatedConfig = {
      ...selectedConfig,
      formulas: editingFormula?.id
        ? selectedConfig.formulas.map(f => f.id === editingFormula.id ? formula : f)
        : [...selectedConfig.formulas, { ...formula, id: Date.now().toString() }]
    };

    setSelectedConfig(updatedConfig);
    setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    setEditingFormula(null);
  };

  // 删除参数
  const handleDeleteParameter = (parameterId: string) => {
    if (!selectedConfig || !confirm('确定要删除这个参数吗？')) return;

    const updatedConfig = {
      ...selectedConfig,
      parameters: selectedConfig.parameters.filter(p => p.id !== parameterId)
    };

    setSelectedConfig(updatedConfig);
    setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? updatedConfig : c));
  };

  // 删除公式
  const handleDeleteFormula = (formulaId: string) => {
    if (!selectedConfig || !confirm('确定要删除这个公式吗？')) return;

    const updatedConfig = {
      ...selectedConfig,
      formulas: selectedConfig.formulas.filter(f => f.id !== formulaId)
    };

    setSelectedConfig(updatedConfig);
    setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? updatedConfig : c));
  };

  // 发布配置版本
  const handlePublishConfig = () => {
    if (!selectedConfig) return;
    
    // 模拟发布新版本
    const newVersion = selectedConfig.version.split('.').map((v, i) => 
      i === 1 ? (parseInt(v) + 1).toString() : v
    ).join('.');

    const updatedConfig = {
      ...selectedConfig,
      version: newVersion,
      updated_at: new Date().toISOString()
    };

    setSelectedConfig(updatedConfig);
    setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    
    alert(`配置已发布为版本 ${newVersion}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      basic: '基础参数',
      advanced: '高级参数',
      regional: '地区参数',
      load_calculation: '负荷计算',
      efficiency: '效率计算',
      economic: '经济性计算'
    };
    return labels[category] || category;
  };

  if (!hasPermission(ADMIN_PERMISSIONS.CALCULATOR_VIEW)) {
    return (
      <div className="text-center py-12">
        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">无访问权限</h3>
        <p className="text-gray-600">您没有查看计算器管理的权限</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">计算器管理</h1>
          <p className="text-gray-600 mt-1">管理计算器参数、公式和版本</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            新建配置
          </Button>
          {selectedConfig && hasPermission(ADMIN_PERMISSIONS.CALCULATOR_VERSION) && (
            <Button onClick={handlePublishConfig}>
              <Activity className="w-4 h-4 mr-2" />
              发布版本
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 计算器列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">计算器列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
                    selectedConfig?.id === config.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedConfig(config)}
                >
                  <div className="font-medium text-sm">{config.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    v{config.version} • {config.parameters.length}个参数
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={config.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {config.is_active ? '活跃' : '停用'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 配置详情 */}
        <div className="lg:col-span-3">
          {selectedConfig ? (
            <Tabs defaultValue="parameters" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedConfig.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{selectedConfig.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>版本: v{selectedConfig.version}</span>
                    <span>更新: {formatDate(selectedConfig.updated_at)}</span>
                  </div>
                </div>
                <TabsList>
                  <TabsTrigger value="parameters">参数管理</TabsTrigger>
                  <TabsTrigger value="formulas">公式管理</TabsTrigger>
                  <TabsTrigger value="settings">配置设置</TabsTrigger>
                </TabsList>
              </div>

              {/* 参数管理 */}
              <TabsContent value="parameters" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sliders className="w-5 h-5" />
                        参数配置 ({selectedConfig.parameters.length})
                      </CardTitle>
                      <Button 
                        size="sm"
                        onClick={() => setEditingParameter({
                          id: '',
                          name: '',
                          key: '',
                          type: 'number',
                          default_value: 0,
                          description: '',
                          category: 'basic',
                          is_required: true,
                          display_order: selectedConfig.parameters.length + 1
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加参数
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedConfig.parameters
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((param) => (
                        <div key={param.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{param.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(param.category)}
                                </Badge>
                                <Badge variant={param.is_required ? "default" : "secondary"} className="text-xs">
                                  {param.is_required ? '必填' : '可选'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">参数键: </span>
                                  <code className="bg-gray-100 px-1 rounded">{param.key}</code>
                                </div>
                                <div>
                                  <span className="text-gray-600">类型: </span>
                                  {param.type}
                                </div>
                                <div>
                                  <span className="text-gray-600">默认值: </span>
                                  {param.default_value} {param.unit}
                                </div>
                                {param.min_value !== undefined && param.max_value !== undefined && (
                                  <div>
                                    <span className="text-gray-600">范围: </span>
                                    {param.min_value} - {param.max_value}
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-2">{param.description}</p>
                              {param.options && (
                                <div className="mt-2">
                                  <span className="text-gray-600 text-sm">选项: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {param.options.map((option, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {option.label}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingParameter(param)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteParameter(param.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 参数编辑弹窗 */}
                {editingParameter && (
                  <ParameterEditDialog
                    parameter={editingParameter}
                    onSave={handleSaveParameter}
                    onCancel={() => setEditingParameter(null)}
                  />
                )}
              </TabsContent>

              {/* 公式管理 */}
              <TabsContent value="formulas" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        公式配置 ({selectedConfig.formulas.length})
                      </CardTitle>
                      <Button 
                        size="sm"
                        onClick={() => setEditingFormula({
                          id: '',
                          name: '',
                          expression: '',
                          description: '',
                          variables: [],
                          category: 'load_calculation',
                          is_active: true
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加公式
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedConfig.formulas.map((formula) => (
                        <div key={formula.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{formula.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(formula.category)}
                                </Badge>
                                <Badge variant={formula.is_active ? "default" : "secondary"} className="text-xs">
                                  {formula.is_active ? '启用' : '禁用'}
                                </Badge>
                              </div>
                              <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                                {formula.expression}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{formula.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm">变量: </span>
                                {formula.variables.map((variable) => (
                                  <Badge key={variable} variant="outline" className="text-xs">
                                    {variable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingFormula(formula)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteFormula(formula.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 公式编辑弹窗 */}
                {editingFormula && (
                  <FormulaEditDialog
                    formula={editingFormula}
                    availableVariables={selectedConfig.parameters.map(p => p.key)}
                    onSave={handleSaveFormula}
                    onCancel={() => setEditingFormula(null)}
                  />
                )}
              </TabsContent>

              {/* 配置设置 */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      配置信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>计算器名称</Label>
                        <Input value={selectedConfig.name} readOnly />
                      </div>
                      <div>
                        <Label>版本号</Label>
                        <Input value={selectedConfig.version} readOnly />
                      </div>
                      <div>
                        <Label>计算器类型</Label>
                        <Input value={selectedConfig.calculator_type} readOnly />
                      </div>
                      <div>
                        <Label>状态</Label>
                        <Select value={selectedConfig.is_active ? 'active' : 'inactive'}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">启用</SelectItem>
                            <SelectItem value="inactive">禁用</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>描述</Label>
                      <Textarea value={selectedConfig.description} readOnly />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>创建时间: {formatDate(selectedConfig.created_at)}</div>
                      <div>更新时间: {formatDate(selectedConfig.updated_at)}</div>
                      <div>创建者: {selectedConfig.created_by}</div>
                      <div>参数数量: {selectedConfig.parameters.length}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择计算器</h3>
                <p className="text-gray-600">从左侧列表中选择一个计算器进行管理</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// 参数编辑对话框组件
const ParameterEditDialog = ({ 
  parameter, 
  onSave, 
  onCancel 
}: { 
  parameter: CalculatorParameter;
  onSave: (parameter: CalculatorParameter) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(parameter);

  const handleSave = () => {
    if (!formData.name || !formData.key) {
      alert('请填写必填字段');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          {parameter.id ? '编辑参数' : '添加参数'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>参数名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入参数名称"
              />
            </div>
            <div>
              <Label>参数键 *</Label>
              <Input
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="请输入参数键"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>参数类型</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">数字</SelectItem>
                  <SelectItem value="select">选择</SelectItem>
                  <SelectItem value="range">范围</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>分类</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">基础参数</SelectItem>
                  <SelectItem value="advanced">高级参数</SelectItem>
                  <SelectItem value="regional">地区参数</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>默认值</Label>
              <Input
                type="number"
                value={formData.default_value}
                onChange={(e) => setFormData(prev => ({ ...prev, default_value: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label>最小值</Label>
              <Input
                type="number"
                value={formData.min_value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, min_value: parseFloat(e.target.value) || undefined }))}
              />
            </div>
            <div>
              <Label>最大值</Label>
              <Input
                type="number"
                value={formData.max_value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, max_value: parseFloat(e.target.value) || undefined }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>单位</Label>
              <Input
                value={formData.unit || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="如：kW, m², %"
              />
            </div>
            <div>
              <Label>显示顺序</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div>
            <Label>描述</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入参数描述"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.is_required}
                onChange={(e) => setFormData(prev => ({ ...prev, is_required: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="required">必填参数</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};

// 公式编辑对话框组件
const FormulaEditDialog = ({ 
  formula, 
  availableVariables,
  onSave, 
  onCancel 
}: { 
  formula: CalculatorFormula;
  availableVariables: string[];
  onSave: (formula: CalculatorFormula) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(formula);

  const handleSave = () => {
    if (!formData.name || !formData.expression) {
      alert('请填写必填字段');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          {formula.id ? '编辑公式' : '添加公式'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>公式名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入公式名称"
              />
            </div>
            <div>
              <Label>分类</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load_calculation">负荷计算</SelectItem>
                  <SelectItem value="efficiency">效率计算</SelectItem>
                  <SelectItem value="economic">经济性计算</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>公式表达式 *</Label>
            <Textarea
              value={formData.expression}
              onChange={(e) => setFormData(prev => ({ ...prev, expression: e.target.value }))}
              placeholder="如：building_area * heat_load * region_factor"
              className="font-mono"
            />
          </div>

          <div>
            <Label>描述</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入公式描述"
            />
          </div>

          <div>
            <Label>可用变量</Label>
            <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-50 rounded">
              {availableVariables.map((variable) => (
                <Badge key={variable} variant="outline" className="text-xs cursor-pointer hover:bg-gray-200">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="active">启用公式</Label>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};






