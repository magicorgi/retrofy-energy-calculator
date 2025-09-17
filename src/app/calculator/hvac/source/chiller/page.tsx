"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Calculator, 
  TrendingDown, 
  Clock, 
  Thermometer,
  BarChart3,
  FileText,
  Download,
  Database,
  Settings,
  Activity,
  Leaf,
  ArrowRight,
  Package,
  ExternalLink,
  Zap,
  ArrowLeft,
  ChevronRight
} from "lucide-react"

interface DefaultInput {
  building_type: string
  area: string
  province: string
  city: string
  old_chiller_type: string
  old_cop: string
  new_chiller_type: string
  new_cop: string
  runtime_hours: string
  load_ratio: string
  new_chiller_price: string
  electricity_price: string
}

interface CalculationResult {
  Q_est: number
  E_old: number
  E_new: number
  Save_e: number
  Save_cost: number
  Inv: number
  Payback: number
  CO2_t: number
  recommended_chiller: string
  efficiency_details: { segment: string, plr: number, cop: number, hours: number, load: number }[]
}

export default function ChillerCalculatorPage() {
  const [formData, setFormData] = useState<DefaultInput>({
    building_type: "office",
    area: "10000",
    province: "上海",
    city: "上海",
    old_chiller_type: "normal_screw",
    old_cop: "4.8",
    new_chiller_type: "magnetic_centrifugal",
    new_cop: "6.8",
    runtime_hours: "2160",
    load_ratio: "60",
    new_chiller_price: "1200",
    electricity_price: "0.85"
  })

  // 管理员模式（模拟）
  const [isAdmin, setIsAdmin] = useState(false)

  const [loadProfiles, setLoadProfiles] = useState([
    { segment: "A", plr: 10, ratio: 8, description: "低负荷段" },
    { segment: "B", plr: 30, ratio: 18, description: "中低负荷段" },
    { segment: "C", plr: 50, ratio: 30, description: "中负荷段" },
    { segment: "D", plr: 70, ratio: 28, description: "中高负荷段" },
    { segment: "E", plr: 90, ratio: 16, description: "高负荷段" }
  ])

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // 完整的省份+城市数据
  const cityData = [
    { province: "安徽", city: "合肥", city_coeff: 1.00, climate: "夏热冬冷", base_indicator: 85, source: "GB 50189-2015", electricity_price: 0.84 },
    { province: "安徽", city: "蚌埠", city_coeff: 1.00, climate: "夏热冬冷", base_indicator: 85, source: "GB 50189-2015", electricity_price: 0.84 },
    { province: "北京", city: "北京", city_coeff: 0.95, climate: "寒冷", base_indicator: 80, source: "GB 50189-2015", electricity_price: 0.82 },
    { province: "福建", city: "福州", city_coeff: 1.05, climate: "夏热冬暖", base_indicator: 90, source: "GB 50189-2015", electricity_price: 0.87 },
    { province: "福建", city: "厦门", city_coeff: 1.05, climate: "夏热冬暖", base_indicator: 90, source: "GB 50189-2015", electricity_price: 0.87 },
    { province: "广东", city: "广州", city_coeff: 1.05, climate: "夏热冬暖", base_indicator: 90, source: "GB 50189-2015", electricity_price: 0.88 },
    { province: "广东", city: "深圳", city_coeff: 1.05, climate: "夏热冬暖", base_indicator: 90, source: "GB 50189-2015", electricity_price: 0.88 },
    { province: "江苏", city: "南京", city_coeff: 1.00, climate: "夏热冬冷", base_indicator: 85, source: "GB 50189-2015", electricity_price: 0.86 },
    { province: "江苏", city: "苏州", city_coeff: 1.00, climate: "夏热冬冷", base_indicator: 85, source: "GB 50189-2015", electricity_price: 0.86 },
    { province: "上海", city: "上海", city_coeff: 1.00, climate: "夏热冬冷", base_indicator: 85, source: "GB 50189-2015", electricity_price: 0.85 },
    { province: "四川", city: "成都", city_coeff: 1.02, climate: "夏热冬冷", base_indicator: 87, source: "川建标 2022", electricity_price: 0.83 },
    { province: "浙江", city: "杭州", city_coeff: 1.02, climate: "夏热冬冷", base_indicator: 87, source: "GB 50189-2015", electricity_price: 0.87 },
    { province: "重庆", city: "重庆", city_coeff: 1.02, climate: "夏热冬冷", base_indicator: 87, source: "GB 50189-2015", electricity_price: 0.83 }
  ]

  const provinces = Array.from(new Set(cityData.map(item => item.province)))
  
  const getCitiesForProvince = (province: string) => {
    return cityData.filter(item => item.province === province)
  }

  const runtimeOptions = [
    { value: "1800", label: "1800小时", description: "办公楼-节假日多" },
    { value: "2160", label: "2160小时", description: "办公楼-标准" },
    { value: "2500", label: "2500小时", description: "办公楼-延时运行" },
    { value: "4000", label: "4000小时", description: "商场-标准" },
    { value: "5000", label: "5000小时", description: "酒店-标准" },
    { value: "6500", label: "6500小时", description: "医院-标准" },
    { value: "8760", label: "8760小时", description: "全年连续运行" }
  ]

  const buildingCoeffs = [
    { building_type: "office", label: "办公楼", type_coeff: 1.00, description: "基准" },
    { building_type: "mall", label: "商场", type_coeff: 1.20, description: "人员密度高" },
    { building_type: "hotel", label: "酒店", type_coeff: 1.30, description: "24h运行" },
    { building_type: "hospital", label: "医院", type_coeff: 1.15, description: "洁净需求" },
    { building_type: "factory", label: "工厂（轻）", type_coeff: 1.10, description: "发热设备" },
    { building_type: "school", label: "学校", type_coeff: 0.95, description: "寒暑假空载" },
    { building_type: "transport", label: "交通枢纽", type_coeff: 1.25, description: "高大空间" }
  ]

  const chillerDB = [
    { type: "magnetic_centrifugal", label: "磁悬浮离心", capacity_range: [300, 1500], iplv: 10.5, cop: 6.8, price: 1200, brand: "丹佛斯TurboCor" },
    { type: "vfd_centrifugal", label: "变频离心", capacity_range: [500, 2000], iplv: 9.2, cop: 6.2, price: 900, brand: "约克YMC²" },
    { type: "efficient_screw", label: "高效螺杆", capacity_range: [150, 800], iplv: 7.5, cop: 5.8, price: 675, brand: "开利30XW" },
    { type: "normal_screw", label: "普通螺杆", capacity_range: [150, 800], iplv: 5.5, cop: 4.8, price: 0, brand: "基准对照" },
    { type: "absorption", label: "溴化锂", capacity_range: [500, 2000], iplv: 1.3, cop: 1.3, price: 625, brand: "双良烟气型" }
  ]

  const partLoadData = {
    magnetic_centrifugal: [5.2, 8.9, 10.8, 10.5, 8.4],
    vfd_centrifugal: [4.8, 7.9, 9.5, 9.2, 7.6],
    efficient_screw: [3.9, 6.4, 7.8, 7.5, 6.6],
    normal_screw: [3.0, 4.9, 5.9, 5.7, 5.0],
    absorption: [1.2, 1.3, 1.4, 1.3, 1.2]
  }

  const calculateResults = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const area = parseFloat(formData.area) || 10000
      const runtimeHours = parseFloat(formData.runtime_hours) || 2160
      const electricityPrice = parseFloat(formData.electricity_price) || 0.85
      const oldCOP = parseFloat(formData.old_cop) || 4.8
      const newCOP = parseFloat(formData.new_cop) || 6.8

      const selectedCityData = cityData.find(c => c.city === formData.city) || cityData.find(c => c.city === "上海")!
      const buildingData = buildingCoeffs.find(b => b.building_type === formData.building_type) || buildingCoeffs[0]
      
      const Q_est = Math.ceil((area * selectedCityData.base_indicator * selectedCityData.city_coeff * buildingData.type_coeff / 1000) / 5) * 5
      const Q_segments = loadProfiles.map(profile => Q_est * (profile.plr / 100))
      const h_segments = loadProfiles.map(profile => (profile.ratio / 100) * runtimeHours)
      const E_old = Q_segments.reduce((sum, Q_i, index) => sum + (Q_i * h_segments[index] / oldCOP), 0)

      const newChillerCOPs = partLoadData[formData.new_chiller_type as keyof typeof partLoadData] || partLoadData.efficient_screw
      const E_new = Q_segments.reduce((sum, Q_i, index) => sum + (Q_i * h_segments[index] / newChillerCOPs[index]), 0)

      const Save_e = E_old - E_new
      const Save_cost = Save_e * electricityPrice
      const newChillerPrice = parseFloat(formData.new_chiller_price) || 1200
      const Inv = Q_est * newChillerPrice
      const Payback = Inv / Save_cost
      const CO2_t = Save_e * 0.000858

      const efficiency_details = loadProfiles.map((profile, index) => ({
        segment: profile.segment,
        plr: profile.plr / 100,
        cop: newChillerCOPs[index],
        hours: h_segments[index],
        load: Q_segments[index]
      }))

      const chillerData = chillerDB.find(c => c.type === formData.new_chiller_type) || chillerDB[0]
      
      setResult({
        Q_est,
        E_old,
        E_new,
        Save_e,
        Save_cost,
        Inv,
        Payback,
        CO2_t,
        recommended_chiller: chillerData.label,
        efficiency_details
      })
      setIsCalculating(false)
      setShowResults(true)
    }, 2000) // 增加动画时间
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      if (field === "province") {
        const provinceCities = getCitiesForProvince(value)
        if (provinceCities.length > 0) {
          newData.city = provinceCities[0].city
          newData.electricity_price = provinceCities[0].electricity_price.toString()
        }
      }
      
      if (field === "city") {
        const selectedCity = cityData.find(c => c.city === value)
        if (selectedCity) {
          newData.electricity_price = selectedCity.electricity_price.toString()
        }
      }

      // 自动匹配原有设备COP
      if (field === "old_chiller_type") {
        const selectedChiller = chillerDB.find(c => c.type === value)
        if (selectedChiller) {
          newData.old_cop = selectedChiller.cop.toString()
        }
      }

      // 自动匹配新设备COP和价格
      if (field === "new_chiller_type") {
        const selectedChiller = chillerDB.find(c => c.type === value)
        if (selectedChiller) {
          newData.new_cop = selectedChiller.cop.toString()
          if (selectedChiller.price > 0) {
            newData.new_chiller_price = selectedChiller.price.toString()
          }
        }
      }
      
      return newData
    })
  }

  const isFormValid = () => {
    return formData.area && formData.building_type && formData.city && formData.new_chiller_type && formData.runtime_hours && formData.electricity_price
  }

  // 计算结果页面 - 重新设计
  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-8">
        {/* 面包屑导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/calculator" className="hover:text-blue-600 transition-colors">
              计算器
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/calculator/hvac" className="hover:text-blue-600 transition-colors">
              HVAC节能改造
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">高效主机选型计算器 Pro</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">计算结果</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator/hvac">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回HVAC
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回输入
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">计算结果报告</h1>
          <p className="text-gray-600">高效主机选型节能改造分析</p>
        </div>

        {/* 1. 推荐改造方案 */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Thermometer className="w-6 h-6 text-blue-600" />
              推荐改造方案
            </CardTitle>
            <CardDescription>基于您的项目参数，系统推荐以下最优方案</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-900 mb-2">{result.recommended_chiller}</div>
                <div className="text-sm text-blue-700">推荐主机类型</div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-900 mb-2">{result.Q_est.toLocaleString()} kW</div>
                <div className="text-sm text-green-700">估算冷负荷</div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-900 mb-2">IPLV最优</div>
                <div className="text-sm text-purple-700">推荐理由</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. 核心计算结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-6 h-6 text-green-600" />
              核心计算结果
            </CardTitle>
            <CardDescription>节能效果和经济效益分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <TrendingDown className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {((result.Save_e / result.E_old) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">节能率</div>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {result.Payback.toFixed(1)}年
                </div>
                <div className="text-sm text-gray-600">投资回收期</div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {Math.round(result.Save_cost / 10000).toLocaleString()}万
                </div>
                <div className="text-sm text-gray-600">年节约成本</div>
              </div>

              <div className="text-center p-6 bg-green-100 rounded-lg">
                <Leaf className="w-8 h-8 mx-auto mb-3 text-green-500" />
                <div className="text-3xl font-bold text-green-500 mb-1">
                  {result.CO2_t.toFixed(1)}吨
                </div>
                <div className="text-sm text-gray-600">年减排CO₂</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. 详细计算结果 */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  详细计算结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">能耗对比</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">现有年耗电量</span>
                        <span className="font-medium">{Math.round(result.E_old).toLocaleString()} kWh</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">改造后年耗电量</span>
                        <span className="font-medium">{Math.round(result.E_new).toLocaleString()} kWh</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">年节约电量</span>
                        <span className="font-medium text-green-600">{Math.round(result.Save_e).toLocaleString()} kWh</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">经济效益</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">年节约成本</span>
                        <span className="font-medium text-green-600">¥{Math.round(result.Save_cost).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">初投资估算</span>
                        <span className="font-medium text-purple-600">¥{Math.round(result.Inv).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">年减排CO₂</span>
                        <span className="font-medium text-blue-600">{result.CO2_t.toFixed(2)} 吨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 分段效率分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  分段效率分析
                </CardTitle>
                <CardDescription>新主机在不同负荷下的运行效率</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 font-medium">负荷段</th>
                        <th className="text-center py-3 font-medium">负载率</th>
                        <th className="text-center py-3 font-medium">COP</th>
                        <th className="text-center py-3 font-medium">运行时间</th>
                        <th className="text-center py-3 font-medium">负荷</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.efficiency_details.map((detail, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{detail.segment}段</td>
                          <td className="text-center py-3">{(detail.plr * 100).toFixed(0)}%</td>
                          <td className="text-center py-3 font-semibold text-blue-600">{detail.cop}</td>
                          <td className="text-center py-3">{detail.hours.toFixed(0)}h</td>
                          <td className="text-center py-3">{detail.load.toFixed(0)}kW</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧操作区 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>操作选项</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  生成详细报告
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  导出Excel
                </Button>
                <Button className="w-full" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  推荐产品详情
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setShowResults(false)}>
                  <Calculator className="w-4 h-4 mr-2" />
                  重新计算
                </Button>
              </CardContent>
            </Card>

            {/* 项目信息摘要 */}
            <Card>
              <CardHeader>
                <CardTitle>项目摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">建筑类型</span>
                  <span className="font-medium">{buildingCoeffs.find(b => b.building_type === formData.building_type)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">建筑面积</span>
                  <span className="font-medium">{parseFloat(formData.area).toLocaleString()} ㎡</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">所在城市</span>
                  <span className="font-medium">{formData.province} {formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">年运行时间</span>
                  <span className="font-medium">{formData.runtime_hours}小时</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">当地电价</span>
                  <span className="font-medium">{formData.electricity_price}元/kWh</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 管理员专用：计算公式详解 */}
        {isAdmin && (
          <Card className="bg-gray-50 border-gray-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="w-5 h-5 text-gray-600" />
                  计算公式详解 (管理员专用)
                </CardTitle>
                <Badge variant="outline" className="text-xs text-gray-600">
                  Admin Only
                </Badge>
              </div>
              <CardDescription>
                完整的计算逻辑和公式，用于系统维护和算法验证
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2">核心计算公式</h4>
                  <div className="space-y-3 text-sm font-mono bg-white p-4 rounded border">
                    <div><strong>1. 估算冷负荷：</strong></div>
                    <div className="text-blue-600 ml-4">Q_est = CEILING(area × base_indicator × city_coeff × type_coeff / 1000, 5)</div>
                    
                    <div><strong>2. 逐段负荷：</strong></div>
                    <div className="text-green-600 ml-4">Q_i = Q_est × PLR_i</div>
                    
                    <div><strong>3. 逐段运行时间：</strong></div>
                    <div className="text-purple-600 ml-4">h_i = runtime_hours × ratio_i</div>
                    
                    <div><strong>4. 旧机年耗电：</strong></div>
                    <div className="text-orange-600 ml-4">E_old = SUMPRODUCT(Q_i, h_i) / old_cop</div>
                    
                    <div><strong>5. 新机年耗电：</strong></div>
                    <div className="text-red-600 ml-4">E_new = SUMPRODUCT(Q_i, h_i / COP_i)</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2">经济性计算</h4>
                  <div className="space-y-3 text-sm font-mono bg-white p-4 rounded border">
                    <div><strong>6. 年节电量：</strong></div>
                    <div className="text-blue-600 ml-4">Save_e = E_old - E_new</div>
                    
                    <div><strong>7. 年省电费：</strong></div>
                    <div className="text-green-600 ml-4">Save_cost = Save_e × electricity_price</div>
                    
                    <div><strong>8. 初投资：</strong></div>
                    <div className="text-purple-600 ml-4">Inv = Q_est × new_chiller_price</div>
                    
                    <div><strong>9. 投资回收期：</strong></div>
                    <div className="text-orange-600 ml-4">Payback = Inv / Save_cost</div>
                    
                    <div><strong>10. 碳减排：</strong></div>
                    <div className="text-red-600 ml-4">CO2_t = Save_e × 0.000858</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">当前计算参数</h4>
                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-medium text-gray-700">基本参数</div>
                    <div>面积: {formData.area} ㎡</div>
                    <div>城市: {formData.province} {formData.city}</div>
                    <div>建筑: {buildingCoeffs.find(b => b.building_type === formData.building_type)?.label}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">系数参数</div>
                    <div>城市系数: {(() => {
                      const selectedCity = cityData.find(c => c.city === formData.city)
                      return selectedCity?.city_coeff || 1.0
                    })()}</div>
                    <div>建筑系数: {buildingCoeffs.find(b => b.building_type === formData.building_type)?.type_coeff || 1.0}</div>
                    <div>冷指标: {(() => {
                      const selectedCity = cityData.find(c => c.city === formData.city)
                      return selectedCity?.base_indicator || 85
                    })()} W/㎡</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">设备参数</div>
                    <div>原COP: {formData.old_cop}</div>
                    <div>新主机: {chillerDB.find(c => c.type === formData.new_chiller_type)?.label}</div>
                    <div>新价格: {formData.new_chiller_price} 元/kW</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 管理员切换按钮 */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {isAdmin ? "隐藏" : "显示"}计算公式 (管理员)
          </Button>
        </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/calculator" className="hover:text-blue-600 transition-colors">
            计算器
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/calculator/hvac" className="hover:text-blue-600 transition-colors">
            HVAC节能改造
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">高效主机选型计算器 Pro</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/calculator/hvac">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回HVAC
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">高效主机选型计算器 Pro</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          基于5模块架构的专业HVAC节能计算系统，精确计算节能效果和投资回收期
        </p>
      </div>

      {/* 模块流程指示器 */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span>参数</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>系数</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>主机</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <span>负荷</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
              <span>计算</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1-4模块一排 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 1️⃣ 基本参数 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              基本参数
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 省份和城市一排 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm">省份</Label>
                <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  城市
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="联动电价和冷指标"></div>
                </Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getCitiesForProvince(formData.province).map((cityItem) => (
                      <SelectItem key={cityItem.city} value={cityItem.city}>
                        {cityItem.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 建筑类型和面积一排 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  建筑类型
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="影响修正系数"></div>
                </Label>
                <Select value={formData.building_type} onValueChange={(value) => handleInputChange("building_type", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingCoeffs.map((building) => (
                      <SelectItem key={building.building_type} value={building.building_type}>
                        {building.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">面积 (㎡)</Label>
                <Input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="10000"
                  className="h-8"
                />
              </div>
            </div>

            {/* 年运行小时和电价一排 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm">年运行小时 (h)</Label>
                <Select value={formData.runtime_hours} onValueChange={(value) => handleInputChange("runtime_hours", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {runtimeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col py-1">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  电价 (元/kWh)
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" title="根据城市自动匹配"></div>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.electricity_price}
                  onChange={(e) => handleInputChange("electricity_price", e.target.value)}
                  placeholder="0.85"
                  className="h-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2️⃣ 修正系数 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              修正系数
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm text-blue-700">城市修正</h4>
              {(() => {
                const selectedCity = cityData.find(c => c.city === formData.city)
                return selectedCity ? (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900 text-sm">{selectedCity.city}</div>
                    <div className="text-xs text-blue-700">气候区: {selectedCity.climate}</div>
                    <div className="text-xs text-blue-700">冷指标: {selectedCity.base_indicator}W/㎡</div>
                    <div className="text-xs text-blue-700">系数: {selectedCity.city_coeff}</div>
                    <div className="text-xs text-blue-600">来源: {selectedCity.source}</div>
                  </div>
                ) : null
              })()}
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm text-green-700">建筑修正</h4>
              {(() => {
                const buildingData = buildingCoeffs.find(b => b.building_type === formData.building_type)
                return buildingData ? (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900 text-sm">{buildingData.label}</div>
                    <div className="text-xs text-green-700">系数: {buildingData.type_coeff}</div>
                    <div className="text-xs text-green-600">备注: {buildingData.description}</div>
                  </div>
                ) : null
              })()}
            </div>

            {/* 预估冷负荷结果 */}
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium mb-2 text-sm text-yellow-800">预估冷负荷</h4>
              <div className="text-lg font-bold text-yellow-900">
                {(() => {
                  const area = parseFloat(formData.area) || 10000
                  const selectedCity = cityData.find(c => c.city === formData.city) || cityData.find(c => c.city === "上海")!
                  const buildingData = buildingCoeffs.find(b => b.building_type === formData.building_type) || buildingCoeffs[0]
                  const Q_est = Math.ceil((area * selectedCity.base_indicator * selectedCity.city_coeff * buildingData.type_coeff / 1000) / 5) * 5
                  return `${Q_est.toLocaleString()} kW`
                })()}
              </div>
              <div className="text-xs text-yellow-700 mt-1">
                = {formData.area} × {(() => {
                  const selectedCity = cityData.find(c => c.city === formData.city) || cityData.find(c => c.city === "上海")!
                  const buildingData = buildingCoeffs.find(b => b.building_type === formData.building_type) || buildingCoeffs[0]
                  return `${selectedCity.base_indicator} × ${selectedCity.city_coeff} × ${buildingData.type_coeff}`
                })()} ÷ 1000
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3️⃣ 主机选择 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              主机选择
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm text-gray-700">原有设备</h4>
              <div className="space-y-2">
                <Select value={formData.old_chiller_type} onValueChange={(value) => handleInputChange("old_chiller_type", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chillerDB.map((chiller) => (
                      <SelectItem key={chiller.type} value={chiller.type}>
                        {chiller.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="space-y-1">
                  <Label className="text-xs">COP (衰减后)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.old_cop}
                    onChange={(e) => handleInputChange("old_cop", e.target.value)}
                    placeholder="4.8"
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm text-green-700">新设备选型</h4>
              <div className="space-y-2">
                <Select value={formData.new_chiller_type} onValueChange={(value) => handleInputChange("new_chiller_type", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chillerDB.filter(c => c.type !== "normal_screw").map((chiller) => (
                      <SelectItem key={chiller.type} value={chiller.type}>
                        {chiller.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">COP</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.new_cop}
                      onChange={(e) => handleInputChange("new_cop", e.target.value)}
                      placeholder="6.8"
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">价格 (元/kW)</Label>
                    <Input
                      type="number"
                      value={formData.new_chiller_price}
                      onChange={(e) => handleInputChange("new_chiller_price", e.target.value)}
                      placeholder="1200"
                      className="h-8"
                    />
                  </div>
                </div>
                
                {(() => {
                  const selectedChiller = chillerDB.find(c => c.type === formData.new_chiller_type)
                  return selectedChiller ? (
                    <div className="p-2 bg-purple-50 rounded-lg text-xs">
                      <div className="text-purple-900 font-medium">品牌示例: {selectedChiller.brand}</div>
                      <div className="text-purple-700">IPLV: {selectedChiller.iplv}</div>
                      <div className="text-purple-700">COP: {selectedChiller.cop}</div>
                      <div className="text-purple-600">容量: {selectedChiller.capacity_range[0]}-{selectedChiller.capacity_range[1]}kW</div>
                    </div>
                  ) : null
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4️⃣ 负荷分布 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              负荷分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 表头 */}
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700 mb-3 p-2 bg-gray-100 rounded">
              <span>负荷段</span>
              <span className="text-center">PLR(%)</span>
              <span className="text-center">占比(%)</span>
              <span className="text-center">时间(h)</span>
            </div>
            
            {/* 可调负荷分布 - 更小字体 */}
            <div className="space-y-2">
              {loadProfiles.map((profile, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-sm font-medium">{profile.segment}段</span>
                  <Input
                    type="number"
                    value={profile.plr}
                    onChange={(e) => {
                      const newProfiles = [...loadProfiles]
                      newProfiles[index].plr = parseInt(e.target.value) || 0
                      setLoadProfiles(newProfiles)
                    }}
                    className="h-8 text-center"
                    min="0"
                    max="100"
                  />
                  <Input
                    type="number"
                    value={profile.ratio}
                    onChange={(e) => {
                      const newProfiles = [...loadProfiles]
                      newProfiles[index].ratio = parseInt(e.target.value) || 0
                      setLoadProfiles(newProfiles)
                    }}
                    className="h-8 text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-center text-gray-600 font-mono">
                    {((profile.ratio / 100) * parseFloat(formData.runtime_hours || "2160")).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-2 bg-orange-100 rounded text-sm">
              <div className="font-medium text-orange-900 mb-1">占比总计</div>
              <div className="text-orange-700 font-mono">
                {loadProfiles.reduce((sum, profile) => sum + profile.ratio, 0)}% 
                {loadProfiles.reduce((sum, profile) => sum + profile.ratio, 0) !== 100 && (
                  <span className="text-red-600 ml-2">⚠️ 应为100%</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5️⃣ 执行计算 - 单独一排 */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
            执行计算
          </CardTitle>
          <CardDescription>基于分段效率模型的精确计算</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-6">
            {isCalculating && (
              <div className="space-y-4">
                {/* 酷炫的计算动画 */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-medium text-red-900">正在计算中...</div>
                  <div className="text-sm text-red-700">
                    分析负荷分布 → 计算分段效率 → 生成节能报告
                  </div>
                </div>
              </div>
            )}
            
            {!isCalculating && (
              <div className="space-y-4">
                <div className="text-red-700 text-sm space-y-1">
                  <div>✓ 估算冷负荷</div>
                  <div>✓ 分段负荷计算</div>
                  <div>✓ 旧机年耗电</div>
                  <div>✓ 新机分段COP</div>
                  <div>✓ 新机年耗电</div>
                  <div>✓ 节能效果分析</div>
                </div>
                
                <Button 
                  className="px-12 py-4 text-lg" 
                  onClick={calculateResults}
                  disabled={!isFormValid()}
                  size="lg"
                >
                  <Calculator className="w-6 h-6 mr-3" />
                  开始计算
                  <Zap className="w-5 h-5 ml-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 数据来源说明 */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-600" />
            数据来源与标准
          </h3>
          <div className="text-xs text-green-700 grid md:grid-cols-2 gap-2">
            <div><strong>标准依据：</strong>GB50189-2015《公共建筑节能设计标准》</div>
            <div><strong>行业数据：</strong>《2023中国建筑节能年度发展报告》</div>
            <div><strong>设备参数：</strong>2024年政府采购中标均价、厂家技术样册</div>
            <div><strong>碳排放因子：</strong>2024全国电网平均 0.858 kgCO₂/kWh</div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}